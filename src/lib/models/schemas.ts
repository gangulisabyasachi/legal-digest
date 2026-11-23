import mongoose, { Schema, Model } from 'mongoose';
import { IJudgment } from './Judgment';
import { IUser } from './User';
import { IBookmark, IResearchFolder, IReadingHistory } from './Bookmark';

// 1. Judgment Schema
const JudgmentSchema = new Schema<IJudgment>(
  {
    id: { type: String, required: true, unique: true, index: true },
    caseTitle: { type: String, required: true, index: 'text' },
    petitioner: { type: String },
    respondent: { type: String },
    citation: { type: String, required: true, index: true },
    court: { type: String, required: true, index: true },
    bench: [{ type: String }],
    dateOfJudgment: { type: String, required: true, index: true },
    caseNumber: { type: String },
    jurisdiction: { type: String },
    catchwords: [{ type: String, index: true }],
    headnote: { type: String, required: true },
    ratioDecidendi: { type: String, required: true },
    issues: [{ type: String }],
    holding: { type: String },
    statutesCited: [
      {
        act: { type: String },
        sections: [{ type: String }],
      },
    ],
    casesReferred: [
      {
        caseName: { type: String },
        citation: { type: String },
        treatment: { type: String },
      },
    ],
    pdfUrl: { type: String },
    pdfFileName: { type: String },
    pdfBase64: { type: String },
    fullText: { type: String },
    status: { type: String, enum: ['draft', 'under_review', 'published'], default: 'under_review', index: true },
    isLandmark: { type: Boolean, default: false, index: true },
    publishedAt: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

// 2. User Schema
const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'editor', 'subscriber', 'user'], default: 'subscriber' },
    organization: { type: String },
    designation: { type: String },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    lastLoginAt: { type: String },
  },
  { timestamps: true }
);

// 3. Bookmark Schema
const BookmarkSchema = new Schema<IBookmark>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    judgmentId: { type: String, required: true, index: true },
    folderId: { type: String, default: null, index: true },
    personalNotes: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// 4. Folder Schema
const FolderSchema = new Schema<IResearchFolder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String, default: '#007398' },
  },
  { timestamps: true }
);

// 5. Reading History Schema
const HistorySchema = new Schema<IReadingHistory>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    judgmentId: { type: String, required: true, index: true },
    viewedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const JudgmentModel: Model<IJudgment> =
  mongoose.models.Judgment || mongoose.model<IJudgment>('Judgment', JudgmentSchema);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export const BookmarkModel: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

export const FolderModel: Model<IResearchFolder> =
  mongoose.models.Folder || mongoose.model<IResearchFolder>('Folder', FolderSchema);

export const HistoryModel: Model<IReadingHistory> =
  mongoose.models.History || mongoose.model<IReadingHistory>('History', HistorySchema);
