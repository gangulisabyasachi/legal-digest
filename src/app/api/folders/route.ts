import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { connectToDatabase } from '@/lib/db/mongoose';
import { FolderModel, BookmarkModel } from '@/lib/models/schemas';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectToDatabase();
    const [folders, bookmarks] = await Promise.all([
      FolderModel.find({ userId: user.id }).sort({ createdAt: -1 }).lean(),
      BookmarkModel.find({ userId: user.id }).lean(),
    ]);

    const foldersWithCounts = folders.map((f) => {
      const count = bookmarks.filter((b) => b.folderId === f.id).length;
      return { ...f, count };
    });

    return NextResponse.json({ success: true, folders: foldersWithCounts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch folders from MongoDB Atlas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { name, description, color } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    await connectToDatabase();
    const newFolder = await FolderModel.create({
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: user.id,
      name: name.trim(),
      description: description || '',
      color: color || '#007398',
    });

    return NextResponse.json({ success: true, folder: newFolder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create folder in MongoDB Atlas' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('id');

    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    await FolderModel.deleteOne({ id: folderId, userId: user.id });
    await BookmarkModel.updateMany({ userId: user.id, folderId }, { $set: { folderId: null } });

    return NextResponse.json({ success: true, message: 'Folder deleted from MongoDB Atlas' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}
