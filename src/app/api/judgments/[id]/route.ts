import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { JudgmentModel, HistoryModel } from '@/lib/models/schemas';
import { getCurrentUser } from '@/lib/auth/jwt';
import { triggerSitemapRegeneration } from '@/lib/sitemap-generator';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const judgment = await JudgmentModel.findOne({ id: params.id }).lean();

    if (!judgment) {
      return NextResponse.json({ error: 'Judgment not found' }, { status: 404 });
    }

    // Record reading history if logged in
    const user = await getCurrentUser(req);
    if (user) {
      await HistoryModel.create({
        id: `hist_${Date.now()}`,
        userId: user.id,
        judgmentId: judgment.id,
        viewedAt: new Date().toISOString(),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, judgment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch judgment from MongoDB Atlas' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updates = await req.json();
    await connectToDatabase();

    const existing = await JudgmentModel.findOne({ id: params.id });
    if (!existing) {
      return NextResponse.json({ error: 'Judgment not found' }, { status: 404 });
    }

    if (updates.status === 'published' && existing.status !== 'published') {
      updates.publishedAt = new Date().toISOString();
    }

    const updated = await JudgmentModel.findOneAndUpdate({ id: params.id }, updates, { new: true }).lean();

    triggerSitemapRegeneration();

    return NextResponse.json({ success: true, judgment: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update judgment in MongoDB Atlas' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized. Superadmin only.' }, { status: 403 });
    }

    await connectToDatabase();
    await JudgmentModel.deleteOne({ id: params.id });

    triggerSitemapRegeneration();

    return NextResponse.json({ success: true, message: 'Judgment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete judgment from MongoDB Atlas' }, { status: 500 });
  }
}
