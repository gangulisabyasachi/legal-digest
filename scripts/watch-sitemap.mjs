import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const appDir = path.join(projectRoot, 'src', 'app');

console.log('🔍 [Legal Digest] Sitemap Auto-Watcher started...');
console.log(`📁 Watching directory: ${appDir}`);

const { generateSitemapXml } = await import('./generate-sitemap.mjs');

let debounceTimer = null;

function triggerRegeneration(eventType, filename) {
  if (filename && (filename.includes('sitemap') || filename.includes('robots'))) {
    return;
  }
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    console.log(`⚡ Change detected in app routes (${eventType}: ${filename || 'unknown'}). Auto-regenerating sitemap...`);
    try {
      await generateSitemapXml();
    } catch (err) {
      console.error('Error during auto sitemap regeneration:', err);
    }
  }, 500);
}

if (fs.existsSync(appDir)) {
  fs.watch(appDir, { recursive: true }, (eventType, filename) => {
    triggerRegeneration(eventType, filename);
  });
}
