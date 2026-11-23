export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin' | 'editor' | 'subscriber' | 'user';
  organization?: string;
  designation?: string; // e.g. "Advocate", "Legal Scholar", "Judge"
  status: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}
