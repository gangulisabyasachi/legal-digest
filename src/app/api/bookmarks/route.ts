import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { connectToDatabase } from '@/lib/db/mongoose';
import { BookmarkModel, JudgmentModel, FolderModel } from '@/lib/models/schemas';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectToDatabase();
    const userBookmarks = await BookmarkModel.find({ userId: user.id }).sort({ createdAt: -1 }).lean();

    const judgmentIds = userBookmarks.map((b) => b.judgmentId);
    const folderIds = userBookmarks.map((b) => b.folderId).filter(Boolean);

    const [judgments, folders] = await Promise.all([
      JudgmentModel.find({ id: { $in: judgmentIds } }).lean(),
      FolderModel.find({ id: { $in: folderIds } }).lean(),
    ]);

    const enriched = userBookmarks.map((bm) => {
      const judgment = judgments.find((j) => j.id === bm.judgmentId);
      const folder = bm.folderId ? folders.find((f) => f.id === bm.folderId) : null;
      return {
        ...bm,
        judgment,
        folderName: folder ? folder.name : 'General Bookmarks',
        folderColor: folder?.color || '#007398',
      };
    });

    return NextResponse.json({ success: true, bookmarks: enriched });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookmarks from MongoDB Atlas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to save and bookmark judgments.' }, { status: 401 });
    }

    const { judgmentId, folderId, personalNotes, tags } = await req.json();
    if (!judgmentId) {
      return NextResponse.json({ error: 'Judgment ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await BookmarkModel.findOne({ userId: user.id, judgmentId });

    if (existing) {
      if (folderId !== undefined || personalNotes !== undefined || tags !== undefined) {
        if (folderId !== undefined) existing.folderId = folderId;
        if (personalNotes !== undefined) existing.personalNotes = personalNotes;
        if (tags !== undefined) existing.tags = tags;
        await existing.save();
        return NextResponse.json({ success: true, action: 'updated', bookmark: existing });
      } else {
        await BookmarkModel.deleteOne({ userId: user.id, judgmentId });
        return NextResponse.json({ success: true, action: 'removed', bookmarked: false });
      }
    }

    const newBookmark = await BookmarkModel.create({
      id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: user.id,
      judgmentId,
      folderId: folderId || null,
      personalNotes: personalNotes || '',
      tags: tags || [],
    });

    return NextResponse.json({ success: true, action: 'added', bookmarked: true, bookmark: newBookmark });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process bookmark in MongoDB Atlas' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const judgmentId = searchParams.get('judgmentId');

    if (!judgmentId) {
      return NextResponse.json({ error: 'Judgment ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await BookmarkModel.deleteOne({ userId: user.id, judgmentId });

    return NextResponse.json({ success: true, message: 'Bookmark removed from MongoDB Atlas' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}
