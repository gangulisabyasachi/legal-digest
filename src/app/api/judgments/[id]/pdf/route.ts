import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { JudgmentModel } from '@/lib/models/schemas';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const judgment = await JudgmentModel.findOne({ id: params.id }).lean();

    if (!judgment) {
      return new NextResponse('Judgment not found', { status: 404 });
    }

    const fileName = judgment.pdfFileName || `${judgment.caseTitle.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    // 1. If stored as Base64 in MongoDB Atlas (Vercel Serverless Persistent Storage)
    if (judgment.pdfBase64) {
      const buffer = Buffer.from(judgment.pdfBase64, 'base64');
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${fileName}"`,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. If stored locally on disk
    if (judgment.pdfUrl) {
      const localRelPath = judgment.pdfUrl.startsWith('/') ? judgment.pdfUrl.slice(1) : judgment.pdfUrl;
      const fullPath = path.join(process.cwd(), 'public', localRelPath);
      if (fs.existsSync(fullPath)) {
        const fileBuffer = fs.readFileSync(fullPath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${fileName}"`,
            'Content-Length': fileBuffer.length.toString(),
          },
        });
      }
    }

    return new NextResponse('PDF document not available for this record.', { status: 404 });
  } catch (error) {
    console.error('Error serving PDF document:', error);
    return new NextResponse('Error loading PDF document', { status: 500 });
  }
}
