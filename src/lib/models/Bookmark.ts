export interface IBookmark {
  id: string;
  userId: string;
  judgmentId: string;
  folderId?: string | null;
  personalNotes?: string;
  tags?: string[];
  createdAt: string;
}

export interface IResearchFolder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string; // Hex color for folder chip
  createdAt: string;
  updatedAt: string;
}

export interface IReadingHistory {
  id: string;
  userId: string;
  judgmentId: string;
  viewedAt: string;
}
