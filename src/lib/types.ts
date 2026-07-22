export type Theme = 'dark' | 'light';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  // Simplified spaced-repetition state (SM-2 inspired)
  interval: number; // days until next review
  ease: number; // ease factor, starts at 2.5
  dueAt: number; // timestamp
  reviewCount: number;
}

export interface Chapter {
  id: string;
  name: string;
  walked: boolean;
  walkedAt: number | null;
  cards: Flashcard[];
}

export interface Subject {
  id: string;
  name: string;
  color: string; // hex, chosen at creation
  createdAt: number;
  chapters: Chapter[];
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  minutesFocused: number;
  cardsReviewed: number;
  chaptersWalked: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlockedAt: number | null;
}

export interface AppState {
  theme: Theme;
  subjects: Subject[];
  xp: number;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  badges: Badge[];
  history: DayActivity[];
  onboarded: boolean;
}

export interface Quest {
  subjectId: string;
  chapterId: string;
  subjectName: string;
  chapterName: string;
  color: string;
  reason: string;
}
