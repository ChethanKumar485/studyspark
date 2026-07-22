import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppState, Badge, Chapter, DayActivity, Flashcard, Quest, Subject, Theme } from './types';

const STORAGE_KEY = 'studyspark:v1';

const DEFAULT_BADGES: Badge[] = [
  { id: 'first-step', name: 'First Step', description: 'Walk your first chapter.', unlockedAt: null },
  { id: 'first-card', name: 'Card Carrier', description: 'Review your first flashcard.', unlockedAt: null },
  { id: 'streak-3', name: 'Warming Up', description: 'Reach a 3-day streak.', unlockedAt: null },
  { id: 'streak-7', name: 'One Week Trail', description: 'Reach a 7-day streak.', unlockedAt: null },
  { id: 'streak-30', name: 'Long Hauler', description: 'Reach a 30-day streak.', unlockedAt: null },
  { id: 'focus-10', name: 'Locked In', description: 'Complete a focus session.', unlockedAt: null },
  { id: 'subjects-3', name: 'Multi-Tasker', description: 'Track 3 subjects at once.', unlockedAt: null },
  { id: 'cards-50', name: 'Card Master', description: 'Review 50 flashcards in total.', unlockedAt: null },
];

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function defaultState(): AppState {
  return {
    theme: 'dark',
    subjects: [],
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    badges: DEFAULT_BADGES,
    history: [],
    onboarded: false,
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    // merge in any newly-added badges for users with older saved state
    const knownIds = new Set(parsed.badges?.map((b) => b.id) ?? []);
    const merged = [...(parsed.badges ?? [])];
    for (const b of DEFAULT_BADGES) {
      if (!knownIds.has(b.id)) merged.push(b);
    }
    return { ...defaultState(), ...parsed, badges: merged };
  } catch {
    return defaultState();
  }
}

function levelFromXp(xp: number): { level: number; into: number; span: number } {
  // Each level needs progressively more XP: level n requires n*100 XP total span.
  let level = 1;
  let remaining = xp;
  let span = 100;
  while (remaining >= span) {
    remaining -= span;
    level += 1;
    span = 100 + (level - 1) * 25;
  }
  return { level, into: remaining, span };
}

interface Store extends AppState {
  level: number;
  xpIntoLevel: number;
  xpSpanForLevel: number;
  toggleTheme: () => void;
  addSubject: (name: string, color: string, chapterNames: string[]) => void;
  deleteSubject: (subjectId: string) => void;
  addChapter: (subjectId: string, name: string) => void;
  markChapterWalked: (subjectId: string, chapterId: string) => void;
  addCard: (subjectId: string, chapterId: string, front: string, back: string) => void;
  reviewCard: (subjectId: string, chapterId: string, cardId: string, quality: 'again' | 'hard' | 'good' | 'easy') => void;
  logFocusSession: (minutes: number) => void;
  getQuest: () => Quest | null;
  getDueCards: () => { subject: Subject; chapter: Chapter; card: Flashcard }[];
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  setOnboarded: () => void;
}

const StoreContext = createContext<Store | null>(null);

function recordActivity(state: AppState, patch: Partial<DayActivity>): AppState {
  const key = todayKey();
  const history = [...state.history];
  const idx = history.findIndex((h) => h.date === key);
  if (idx >= 0) {
    history[idx] = {
      ...history[idx],
      minutesFocused: history[idx].minutesFocused + (patch.minutesFocused ?? 0),
      cardsReviewed: history[idx].cardsReviewed + (patch.cardsReviewed ?? 0),
      chaptersWalked: history[idx].chaptersWalked + (patch.chaptersWalked ?? 0),
    };
  } else {
    history.push({
      date: key,
      minutesFocused: patch.minutesFocused ?? 0,
      cardsReviewed: patch.cardsReviewed ?? 0,
      chaptersWalked: patch.chaptersWalked ?? 0,
    });
  }
  // keep last 60 days
  const trimmed = history.slice(-60);

  let { streak, lastActiveDate } = state;
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  if (lastActiveDate !== key) {
    if (lastActiveDate === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
    lastActiveDate = key;
  }

  return { ...state, history: trimmed, streak, lastActiveDate };
}

function unlockBadges(state: AppState): AppState {
  const totalCardsReviewed = state.subjects.reduce(
    (sum, s) => sum + s.chapters.reduce((cs, c) => cs + c.cards.reduce((rs, card) => rs + card.reviewCount, 0), 0),
    0,
  );
  const anyChapterWalked = state.subjects.some((s) => s.chapters.some((c) => c.walked));
  const anyCardReviewed = totalCardsReviewed > 0;
  const anyFocusLogged = state.history.some((h) => h.minutesFocused > 0);

  const checks: Record<string, boolean> = {
    'first-step': anyChapterWalked,
    'first-card': anyCardReviewed,
    'streak-3': state.streak >= 3,
    'streak-7': state.streak >= 7,
    'streak-30': state.streak >= 30,
    'focus-10': anyFocusLogged,
    'subjects-3': state.subjects.length >= 3,
    'cards-50': totalCardsReviewed >= 50,
  };

  const badges = state.badges.map((b) =>
    !b.unlockedAt && checks[b.id] ? { ...b, unlockedAt: Date.now() } : b,
  );

  return { ...state, badges };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  function update(fn: (s: AppState) => AppState) {
    setState((prev) => unlockBadges(fn(prev)));
  }

  const toggleTheme = () =>
    update((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));

  const setOnboarded = () => update((s) => ({ ...s, onboarded: true }));

  const addSubject = (name: string, color: string, chapterNames: string[]) =>
    update((s) => {
      const subject: Subject = {
        id: uid(),
        name,
        color,
        createdAt: Date.now(),
        chapters: chapterNames
          .filter((n) => n.trim().length > 0)
          .map((n) => ({ id: uid(), name: n.trim(), walked: false, walkedAt: null, cards: [] })),
      };
      return { ...s, subjects: [...s.subjects, subject] };
    });

  const deleteSubject = (subjectId: string) =>
    update((s) => ({ ...s, subjects: s.subjects.filter((sub) => sub.id !== subjectId) }));

  const addChapter = (subjectId: string, name: string) =>
    update((s) => ({
      ...s,
      subjects: s.subjects.map((sub) =>
        sub.id === subjectId
          ? { ...sub, chapters: [...sub.chapters, { id: uid(), name, walked: false, walkedAt: null, cards: [] }] }
          : sub,
      ),
    }));

  const markChapterWalked = (subjectId: string, chapterId: string) =>
    update((s) => {
      let xpGain = 0;
      const subjects = s.subjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((c) => {
            if (c.id !== chapterId || c.walked) return c;
            xpGain = 15;
            return { ...c, walked: true, walkedAt: Date.now() };
          }),
        };
      });
      const withXp = { ...s, subjects, xp: s.xp + xpGain };
      return xpGain > 0 ? recordActivity(withXp, { chaptersWalked: 1 }) : withXp;
    });

  const addCard = (subjectId: string, chapterId: string, front: string, back: string) =>
    update((s) => ({
      ...s,
      subjects: s.subjects.map((sub) =>
        sub.id !== subjectId
          ? sub
          : {
              ...sub,
              chapters: sub.chapters.map((c) =>
                c.id !== chapterId
                  ? c
                  : {
                      ...c,
                      cards: [
                        ...c.cards,
                        { id: uid(), front, back, interval: 0, ease: 2.5, dueAt: Date.now(), reviewCount: 0 },
                      ],
                    },
              ),
            },
      ),
    }));

  const reviewCard = (
    subjectId: string,
    chapterId: string,
    cardId: string,
    quality: 'again' | 'hard' | 'good' | 'easy',
  ) =>
    update((s) => {
      let xpGain = 0;
      const subjects = s.subjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((c) => {
            if (c.id !== chapterId) return c;
            return {
              ...c,
              cards: c.cards.map((card) => {
                if (card.id !== cardId) return card;
                let ease = card.ease;
                let interval = card.interval;
                if (quality === 'again') {
                  interval = 0;
                  ease = Math.max(1.3, ease - 0.2);
                  xpGain = 2;
                } else {
                  if (quality === 'hard') ease = Math.max(1.3, ease - 0.15);
                  if (quality === 'easy') ease += 0.15;
                  interval = interval === 0 ? 1 : Math.round(interval * ease);
                  xpGain = quality === 'easy' ? 8 : quality === 'good' ? 5 : 3;
                }
                return {
                  ...card,
                  ease,
                  interval,
                  dueAt: Date.now() + interval * 86400000,
                  reviewCount: card.reviewCount + 1,
                };
              }),
            };
          }),
        };
      });
      const withXp = { ...s, subjects, xp: s.xp + xpGain };
      return recordActivity(withXp, { cardsReviewed: 1 });
    });

  const logFocusSession = (minutes: number) =>
    update((s) => recordActivity({ ...s, xp: s.xp + Math.round(minutes) }, { minutesFocused: minutes }));

  const getQuest = (): Quest | null => {
    const candidates = state.subjects.flatMap((s) =>
      s.chapters
        .filter((c) => !c.walked)
        .map((c) => ({ subject: s, chapter: c })),
    );
    if (candidates.length === 0) return null;
    // Suggest the subject untouched longest: pick the chapter belonging to the subject
    // whose most recent walked timestamp (or creation date) is oldest.
    const lastTouch = (s: Subject) => {
      const walkedTimes = s.chapters.filter((c) => c.walked && c.walkedAt).map((c) => c.walkedAt as number);
      return walkedTimes.length ? Math.max(...walkedTimes) : s.createdAt;
    };
    candidates.sort((a, b) => lastTouch(a.subject) - lastTouch(b.subject));
    const pick = candidates[0];
    return {
      subjectId: pick.subject.id,
      chapterId: pick.chapter.id,
      subjectName: pick.subject.name,
      chapterName: pick.chapter.name,
      color: pick.subject.color,
      reason: `${pick.subject.name} hasn't been walked in a while — pick it back up.`,
    };
  };

  const getDueCards = () => {
    const now = Date.now();
    const out: { subject: Subject; chapter: Chapter; card: Flashcard }[] = [];
    for (const subject of state.subjects) {
      for (const chapter of subject.chapters) {
        for (const card of chapter.cards) {
          if (card.dueAt <= now) out.push({ subject, chapter, card });
        }
      }
    }
    return out.sort((a, b) => a.card.dueAt - b.card.dueAt);
  };

  const exportBackup = () => JSON.stringify(state, null, 2);

  const importBackup = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as AppState;
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.subjects)) return false;
      setState(unlockBadges({ ...defaultState(), ...parsed }));
      return true;
    } catch {
      return false;
    }
  };

  const { level, into, span } = useMemo(() => levelFromXp(state.xp), [state.xp]);

  const value: Store = {
    ...state,
    level,
    xpIntoLevel: into,
    xpSpanForLevel: span,
    toggleTheme,
    addSubject,
    deleteSubject,
    addChapter,
    markChapterWalked,
    addCard,
    reviewCard,
    logFocusSession,
    getQuest,
    getDueCards,
    exportBackup,
    importBackup,
    setOnboarded,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function setThemePreload() {
  // Applied before React mounts to avoid a flash of the wrong theme.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const theme: Theme = raw ? (JSON.parse(raw).theme ?? 'dark') : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch {
    document.documentElement.classList.add('dark');
  }
}
