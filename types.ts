export type EntryType = 'journal' | 'idea';

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'productive' | 'tired';
  tags: string[];
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color: string; // Tailwind color class suffix (e.g., 'yellow-100')
  tags: string[];
}

export interface Goal {
  id: string;
  title: string;
  type: 'short-term' | 'long-term';
  completed: boolean; // For long-term: done or not. For short-term: archived/finished entirely.
  deadline?: string;
  progress: number; // 0-100
  targetDays?: number; // Duration of the plan in days
  completedDates: string[]; // Array of "YYYY-MM-DD" strings for daily check-ins
}

export interface DailyStats {
  date: string;
  checkedIn: boolean;
  tasksCompleted: number;
  mood?: string;
}

export interface AppData {
  userProfile: {
    name: string;
  };
  settings?: {
    themeColor: string;
  };
  journal: JournalEntry[];
  ideas: Idea[];
  goals: Goal[];
  stats: DailyStats[]; // History of daily check-ins
}