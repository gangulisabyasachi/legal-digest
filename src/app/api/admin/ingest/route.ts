import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { extractTextFromPdf } from '@/lib/ai/pdfExtractor';
import { extractHeadnoteWithGrok } from '@/lib/ai/grokClient';
import { connectToDatabase } from '@/lib/db/mongoose';
import { JudgmentModel } from '@/lib/models/schemas';
import { IJudgment } from '@/lib/models/Judgment';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized. Admin or Editor privileges required.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfBase64 = buffer.toString('base64');

    const judgmentId = `jdg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    let pdfUrl = `/api/judgments/${judgmentId}/pdf`;

    // Try saving locally for local development cache (safely ignore EROFS on Vercel serverless)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(uploadsDir, safeFileName);
      fs.writeFileSync(filePath, buffer);
    } catch (fsErr) {
      console.log('[Ingest] Running on serverless environment (Vercel), stored directly in MongoDB Atlas.');
    }

    console.log(`[Ingest] Parsing PDF: ${file.name} (${(buffer.length / 1024).toFixed(1)} KB)`);

    // 1. Extract plain text from PDF
    const { text, numpages } = await extractTextFromPdf(buffer);

    console.log(`[Ingest] Extracted ${text.length} characters across ${numpages} pages. Sending to Grok AI pipeline.`);

    // 2. Run Grok AI Legal Extraction
    const aiExtracted = await extractHeadnoteWithGrok(text, file.name);

    // 3. Create a Draft Judgment in MongoDB Atlas ready for editorial review
    const newJudgment: IJudgment = {
      id: judgmentId,
      caseTitle: aiExtracted.caseTitle || file.name.replace(/\.[^/.]+$/, ''),
      petitioner: aiExtracted.petitioner,
      respondent: aiExtracted.respondent,
      citation: aiExtracted.citation || `${new Date().getFullYear()} INSC (Pending)`,
      court: aiExtracted.court || 'Supreme Court of India',
      bench: aiExtracted.bench || [],
      dateOfJudgment: aiExtracted.dateOfJudgment || new Date().toISOString().split('T')[0],
      caseNumber: aiExtracted.caseNumber,
      jurisdiction: aiExtracted.jurisdiction || 'Appellate Jurisdiction',
      catchwords: aiExtracted.catchwords || ['LEGAL DIGEST', 'SUPREME COURT'],
      headnote: aiExtracted.headnote,
      ratioDecidendi: aiExtracted.ratioDecidendi,
      issues: aiExtracted.issues || [],
      holding: aiExtracted.holding,
      statutesCited: aiExtracted.statutesCited || [],
      casesReferred: aiExtracted.casesReferred || [],
      pdfUrl,
      pdfFileName: file.name,
      pdfBase64,
      fullText: text,
      status: 'under_review',
      isLandmark: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.name,
    };

    await connectToDatabase();
    const created = await JudgmentModel.create(newJudgment);

    console.log(`[Ingest] Judgment created in MongoDB Atlas with ID: ${judgmentId}. Ready for review.`);

    return NextResponse.json({
      success: true,
      judgmentId,
      judgment: created,
      extractedInfo: {
        pageCount: numpages,
        textLength: text.length,
      },
    });
  } catch (error: any) {
    console.error('Ingestion pipeline error:', error);
    return NextResponse.json({ error: error.message || 'PDF ingestion failed' }, { status: 500 });
  }
}
