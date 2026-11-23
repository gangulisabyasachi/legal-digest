import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { JudgmentModel } from '@/lib/models/schemas';
import { getCurrentUser } from '@/lib/auth/jwt';
import { IJudgment } from '@/lib/models/Judgment';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const court = searchParams.get('court');
    const year = searchParams.get('year');
    const statute = searchParams.get('statute')?.toLowerCase();
    const catchword = searchParams.get('catchword')?.toLowerCase();
    const status = searchParams.get('status') || 'published';

    await connectToDatabase();

    const mongoFilter: any = {};

    if (status !== 'all') {
      mongoFilter.status = status;
    }

    if (court) {
      mongoFilter.court = { $regex: court, $options: 'i' };
    }

    if (year) {
      mongoFilter.dateOfJudgment = { $regex: `^${year}` };
    }

    if (catchword) {
      mongoFilter.catchwords = { $regex: catchword, $options: 'i' };
    }

    let judgments = await JudgmentModel.find(mongoFilter).sort({ dateOfJudgment: -1 }).lean();

    // In-memory filter for flexible regex across text/statute/query
    if (query) {
      judgments = judgments.filter((j) => {
        const titleMatch = j.caseTitle?.toLowerCase().includes(query);
        const citationMatch = j.citation?.toLowerCase().includes(query);
        const headnoteMatch = j.headnote?.toLowerCase().includes(query);
        const ratioMatch = j.ratioDecidendi?.toLowerCase().includes(query);
        const catchwordsMatch = j.catchwords?.some((cw) => cw.toLowerCase().includes(query));
        const benchMatch = j.bench?.some((b) => b.toLowerCase().includes(query));
        const statuteMatch = j.statutesCited?.some(
          (s) => s.act.toLowerCase().includes(query) || s.sections.some((sec) => sec.toLowerCase().includes(query))
        );
        return titleMatch || citationMatch || headnoteMatch || ratioMatch || catchwordsMatch || benchMatch || statuteMatch;
      });
    }

    if (statute) {
      judgments = judgments.filter((j) =>
        j.statutesCited?.some((s) => s.act.toLowerCase().includes(statute) || s.sections.some((sec) => sec.toLowerCase().includes(statute)))
      );
    }

    return NextResponse.json({
      success: true,
      count: judgments.length,
      judgments,
    });
  } catch (error: any) {
    console.error('Error fetching judgments from MongoDB Atlas:', error);
    return NextResponse.json({ error: 'Failed to retrieve judgments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized. Admin or Editor privileges required.' }, { status: 403 });
    }

    const body: Partial<IJudgment> = await req.json();
    if (!body.caseTitle || !body.citation) {
      return NextResponse.json({ error: 'Case title and citation are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const newJudgment: IJudgment = {
      id: `jdg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      caseTitle: body.caseTitle,
      petitioner: body.petitioner || '',
      respondent: body.respondent || '',
      citation: body.citation,
      court: body.court || 'Supreme Court of India',
      bench: body.bench || [],
      dateOfJudgment: body.dateOfJudgment || new Date().toISOString().split('T')[0],
      caseNumber: body.caseNumber || '',
      jurisdiction: body.jurisdiction || 'Appellate Jurisdiction',
      catchwords: body.catchwords || [],
      headnote: body.headnote || '',
      ratioDecidendi: body.ratioDecidendi || '',
      issues: body.issues || [],
      holding: body.holding || '',
      statutesCited: body.statutesCited || [],
      casesReferred: body.casesReferred || [],
      pdfUrl: body.pdfUrl || '',
      pdfFileName: body.pdfFileName || '',
      fullText: body.fullText || '',
      status: body.status || 'published',
      isLandmark: Boolean(body.isLandmark),
      publishedAt: body.status === 'published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.name,
    };

    const saved = await JudgmentModel.create(newJudgment);

    return NextResponse.json({ success: true, judgment: saved }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating judgment in MongoDB Atlas:', error);
    return NextResponse.json({ error: 'Failed to create judgment' }, { status: 500 });
  }
}
