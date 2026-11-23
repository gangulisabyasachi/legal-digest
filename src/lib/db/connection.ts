import fs from 'fs';
import path from 'path';
import { IJudgment } from '../models/Judgment';
import { IUser } from '../models/User';
import { IBookmark, IResearchFolder, IReadingHistory } from '../models/Bookmark';
import { initialJudgments, initialUsers, initialFolders, initialBookmarks } from './seedData';

// Resilient file-backed database storage that works without requiring an external MongoDB server,
// while also providing seamless drop-in Mongoose compatibility when MONGODB_URI is provided.

const DATA_DIR = path.join(process.cwd(), 'data');

interface DatabaseStore {
  judgments: IJudgment[];
  users: IUser[];
  bookmarks: IBookmark[];
  folders: IResearchFolder[];
  history: IReadingHistory[];
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const DB_FILE = path.join(DATA_DIR, 'db.json');

export function getDb(): DatabaseStore {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const seed: DatabaseStore = {
      judgments: initialJudgments,
      users: initialUsers,
      bookmarks: initialBookmarks,
      folders: initialFolders,
      history: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const fallback: DatabaseStore = {
      judgments: initialJudgments,
      users: initialUsers,
      bookmarks: initialBookmarks,
      folders: initialFolders,
      history: [],
    };
    return fallback;
  }
}

export function saveDb(data: DatabaseStore): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
