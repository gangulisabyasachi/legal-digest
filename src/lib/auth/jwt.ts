import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { IUser } from '../models/User';
import { connectToDatabase } from '../db/mongoose';
import { UserModel } from '../models/schemas';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-legal-digest-secret-key-32chars-min';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(req: NextRequest): Promise<IUser | null> {
  const authCookie = req.cookies.get('legal_digest_token')?.value;
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const token = authCookie || authHeader;

  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;

  try {
    await connectToDatabase();
    const user = await UserModel.findOne({ id: decoded.userId }).lean();
    return (user as unknown as IUser) || null;
  } catch (err) {
    console.error('Error fetching current user from MongoDB Atlas:', err);
    return null;
  }
}
