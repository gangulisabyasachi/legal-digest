import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './db/mongoose';
import { JudgmentModel } from './models/schemas';
import { getDb } from './db/connection';
import { IJudgment } from './models/Judgment';

const projectRoot = process.cwd();

const BASE_URL = (
  process.env.SITE_URL ||
  (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_APP_URL
    : 'https://legal-digest-lovat.vercel.app')
).replace(/\/+$/, '');

// Scan src/app for static pages
function getStaticAppRoutes(): string[] {
  const appDir = path.join(projectRoot, 'src', 'app');
  const staticRoutes: string[] = [];

  function scan(dir: string, currentRoute = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name.startsWith('_') ||
        entry.name.startsWith('.') ||
        entry.name === 'api' ||
        entry.name === 'admin' ||
        entry.name === 'workspace' ||
        entry.name === 'node_modules'
      ) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const seg = entry.name.startsWith('(') && entry.name.endsWith(')')
          ? currentRoute
          : `${currentRoute}/${entry.name}`;
        scan(fullPath, seg);
      } else if (entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        const finalRoute = currentRoute === '' ? '/' : currentRoute;
        if (!finalRoute.includes('[')) {
          staticRoutes.push(finalRoute);
        }
      }
    }
  }

  scan(appDir);
  return Array.from(new Set(['/', ...staticRoutes]));
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export async function getDynamicJudgmentEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  let judgments: any[] = [];

  try {
    await connectToDatabase();
    judgments = await JudgmentModel.find({ status: 'published' }, 'id status updatedAt dateOfJudgment publishedAt').lean();
  } catch (err: any) {
    // Fallback to local db.json store
    try {
      const db = getDb();
      judgments = (db.judgments || []).filter((j: IJudgment) => j.status === 'published');
    } catch (e: any) {
      console.warn('Fallback to local store failed:', e.message);
    }
  }

  if (Array.isArray(judgments)) {
    for (const j of judgments) {
      if (j && j.id) {
        const dateStr = j.updatedAt || j.publishedAt || j.dateOfJudgment || new Date();
        entries.push({
          url: `${BASE_URL}/judgments/${j.id}`,
          lastModified: new Date(dateStr),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const staticRoutes = getStaticAppRoutes();
  const staticEntries: SitemapEntry[] = staticRoutes.map((route) => {
    let priority = 0.7;
    let changeFrequency: SitemapEntry['changeFrequency'] = 'weekly';

    if (route === '/') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route === '/search') {
      priority = 0.9;
      changeFrequency = 'daily';
    } else if (route === '/login') {
      priority = 0.5;
      changeFrequency = 'monthly';
    }

    return {
      url: route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  const dynamicEntries = await getDynamicJudgmentEntries();
  return [...staticEntries, ...dynamicEntries];
}

export async function generateSitemapXml(): Promise<string> {
  const entries = await getSitemapEntries();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const item of entries) {
    const modIso = item.lastModified instanceof Date
      ? item.lastModified.toISOString()
      : new Date(item.lastModified).toISOString();

    xml += '  <url>\n';
    xml += `    <loc>${item.url}</loc>\n`;
    xml += `    <lastmod>${modIso}</lastmod>\n`;
    xml += `    <changefreq>${item.changeFrequency}</changefreq>\n`;
    xml += `    <priority>${item.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  // 1. Write repo root sitemap.xml
  fs.writeFileSync(path.join(projectRoot, 'sitemap.xml'), xml, 'utf-8');

  // 2. Write public/robots.txt
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /workspace\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');

  console.log(`✓ [Legal Digest] Sitemap updated with ${entries.length} URLs (static & dynamic DB judgments)`);
  return xml;
}

export function triggerSitemapRegeneration(): void {
  setTimeout(async () => {
    try {
      await generateSitemapXml();
    } catch (err: any) {
      console.error('Background sitemap regeneration failed in Legal Digest:', err.message);
    }
  }, 100);
}
