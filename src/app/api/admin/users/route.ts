import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { connectToDatabase } from '@/lib/db/mongoose';
import { UserModel } from '@/lib/models/schemas';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);
    if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    await connectToDatabase();
    const users = await UserModel.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users from MongoDB Atlas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);
    if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, email, role, password, organization, designation } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'subscriber',
      organization: organization || '',
      designation: designation || 'Advocate',
      status: 'active' as const,
    };

    const saved = await UserModel.create(newUser);
    const { passwordHash: _, ...safeUser } = saved.toObject();

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user in MongoDB Atlas' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);
    if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, role, status } = await req.json();
    await connectToDatabase();

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.id === 'user_admin_01' && (role !== 'superadmin' || status === 'suspended')) {
      return NextResponse.json({ error: 'Cannot modify primary root administrator' }, { status: 400 });
    }

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();
    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user in MongoDB Atlas' }, { status: 500 });
  }
}
