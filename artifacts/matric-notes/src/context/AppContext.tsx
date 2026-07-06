import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const DOWNLOADS_KEY  = '@matric_notes_downloads_v1';
const QUIZ_STATS_KEY = '@matric_notes_quiz_v1';

// ── Total chapters in the locked syllabus ────────────────────────────────────
export const TOTAL_CHAPTERS = 186;

// ── Types ─────────────────────────────────────────────────────────────────────
export type QuizStats = {
  correct:  number;
  attempted: number;
};

type AppContextValue = {
  // Downloads
  downloadedChapters:  Set<string>;
  isLoadingDownloads:  boolean;
  markDownloaded:      (chapterId: string) => Promise<void>;
  isDownloaded:        (chapterId: string) => boolean;

  // Connectivity
  isOnline: boolean;

  // Quiz / Gaming progress
  quizStats:           QuizStats;
  isLoadingQuizStats:  boolean;
  recordQuizAnswer:    (correct: boolean) => Promise<void>;
  resetQuizStats:      () => Promise<void>;

  // Derived metrics (0-100)
  studyProgressPct:    number;
  quizScorePct:        number;
  boardPredictionPct:  number;
};

// ── Default context ───────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue>({
  downloadedChapters:  new Set(),
  isLoadingDownloads:  true,
  markDownloaded:      async () => {},
  isDownloaded:        () => false,

  isOnline: true,

  quizStats:           { correct: 0, attempted: 0 },
  isLoadingQuizStats:  true,
  recordQuizAnswer:    async () => {},
  resetQuizStats:      async () => {},

  studyProgressPct:    0,
  quizScorePct:        0,
  boardPredictionPct:  0,
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [downloadedChapters, setDownloadedChapters] = useState<Set<string>>(new Set());
  const [isOnline,            setIsOnline]           = useState(true);
  const [isLoadingDownloads,  setIsLoadingDownloads] = useState(true);
  const [quizStats,           setQuizStats]          = useState<QuizStats>({ correct: 0, attempted: 0 });
  const [isLoadingQuizStats,  setIsLoadingQuizStats] = useState(true);

  // ── Load persisted data ────────────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      try {
        const [rawDownloads, rawQuiz] = await Promise.all([
          AsyncStorage.getItem(DOWNLOADS_KEY),
          AsyncStorage.getItem(QUIZ_STATS_KEY),
        ]);
        if (rawDownloads) {
          const arr: string[] = JSON.parse(rawDownloads);
          setDownloadedChapters(new Set(arr));
        }
        if (rawQuiz) {
          const stats: QuizStats = JSON.parse(rawQuiz);
          setQuizStats(stats);
        }
      } catch {
        // ignore read errors — start fresh
      } finally {
        setIsLoadingDownloads(false);
        setIsLoadingQuizStats(false);
      }
    }
    loadAll();
  }, []);

  // ── Network subscription ───────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
    return unsubscribe;
  }, []);

  // ── Downloads ─────────────────────────────────────────────────────────────
  const markDownloaded = useCallback(async (chapterId: string) => {
    setDownloadedChapters((prev) => {
      const next = new Set(prev);
      next.add(chapterId);
      AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(Array.from(next))).catch(() => {});
      return next;
    });
  }, []);

  const isDownloaded = useCallback(
    (chapterId: string) => downloadedChapters.has(chapterId),
    [downloadedChapters],
  );

  // ── Quiz stats ─────────────────────────────────────────────────────────────
  const recordQuizAnswer = useCallback(async (correct: boolean) => {
    setQuizStats((prev) => {
      const next: QuizStats = {
        correct:   prev.correct  + (correct ? 1 : 0),
        attempted: prev.attempted + 1,
      };
      AsyncStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetQuizStats = useCallback(async () => {
    const fresh: QuizStats = { correct: 0, attempted: 0 };
    setQuizStats(fresh);
    await AsyncStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(fresh));
  }, []);

  // ── Derived metrics ────────────────────────────────────────────────────────
  const studyProgressPct = Math.min(100, (downloadedChapters.size / TOTAL_CHAPTERS) * 100);
  const quizScorePct     = quizStats.attempted > 0
    ? Math.min(100, (quizStats.correct / quizStats.attempted) * 100)
    : 0;
  // Board prediction: 45% weight on study, 55% weight on quiz accuracy
  const boardPredictionPct = Math.round(studyProgressPct * 0.45 + quizScorePct * 0.55);

  return (
    <AppContext.Provider
      value={{
        downloadedChapters, isLoadingDownloads, markDownloaded, isDownloaded,
        isOnline,
        quizStats, isLoadingQuizStats, recordQuizAnswer, resetQuizStats,
        studyProgressPct, quizScorePct, boardPredictionPct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
