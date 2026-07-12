import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const DOWNLOADS_KEY   = '@matric_notes_downloads_v1';
const QUIZ_STATS_KEY  = '@matric_notes_quiz_v1';
const BOARD_STATS_KEY = '@matric_notes_board_v2';

export const TOTAL_CHAPTERS  = 186;
export const QUIZ_BANK_SIZE  = 80;

// ── Types ─────────────────────────────────────────────────────────────────────
export type QuizStats = {
  correct:   number;
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
  recordQuizAnswer:    (questionId: string, correct: boolean) => Promise<void>;
  resetQuizStats:      () => Promise<void>;

  // Unique MCQ + revision tracking
  uniqueQsAnswered:    Set<string>;
  questionRevisions:   Record<string, number>;
  revisedCount:        number;

  // Quiz bank size (exposed for UI)
  QUIZ_BANK_SIZE:      number;

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

  uniqueQsAnswered:    new Set(),
  questionRevisions:   {},
  revisedCount:        0,

  QUIZ_BANK_SIZE,

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
  const [uniqueQsAnswered,    setUniqueQsAnswered]   = useState<Set<string>>(new Set());
  const [questionRevisions,   setQuestionRevisions]  = useState<Record<string, number>>({});

  // ── Load persisted data ────────────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      try {
        const [rawDownloads, rawQuiz, rawBoard] = await Promise.all([
          AsyncStorage.getItem(DOWNLOADS_KEY),
          AsyncStorage.getItem(QUIZ_STATS_KEY),
          AsyncStorage.getItem(BOARD_STATS_KEY),
        ]);
        if (rawDownloads) {
          setDownloadedChapters(new Set(JSON.parse(rawDownloads) as string[]));
        }
        if (rawQuiz) {
          setQuizStats(JSON.parse(rawQuiz) as QuizStats);
        }
        if (rawBoard) {
          const board = JSON.parse(rawBoard) as {
            uniqueQsAnswered: string[];
            questionRevisions: Record<string, number>;
          };
          setUniqueQsAnswered(new Set(board.uniqueQsAnswered ?? []));
          setQuestionRevisions(board.questionRevisions ?? {});
        }
      } catch {
        // ignore — start fresh
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

  // ── Quiz stats + unique tracking ───────────────────────────────────────────
  const recordQuizAnswer = useCallback(async (questionId: string, correct: boolean) => {
    // Update simple stats
    setQuizStats((prev) => {
      const next: QuizStats = {
        correct:   prev.correct   + (correct ? 1 : 0),
        attempted: prev.attempted + 1,
      };
      AsyncStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });

    // Update unique question tracking + revisions
    setUniqueQsAnswered((prevSet) => {
      const nextSet = new Set(prevSet);
      nextSet.add(questionId);

      setQuestionRevisions((prevRev) => {
        const nextRev = { ...prevRev };
        nextRev[questionId] = (nextRev[questionId] ?? 0) + 1;

        // Persist board stats
        AsyncStorage.setItem(
          BOARD_STATS_KEY,
          JSON.stringify({
            uniqueQsAnswered: Array.from(nextSet),
            questionRevisions: nextRev,
          }),
        ).catch(() => {});

        return nextRev;
      });

      return nextSet;
    });
  }, []);

  const resetQuizStats = useCallback(async () => {
    const fresh: QuizStats = { correct: 0, attempted: 0 };
    setQuizStats(fresh);
    setUniqueQsAnswered(new Set());
    setQuestionRevisions({});
    await Promise.all([
      AsyncStorage.setItem(QUIZ_STATS_KEY,  JSON.stringify(fresh)),
      AsyncStorage.setItem(BOARD_STATS_KEY, JSON.stringify({ uniqueQsAnswered: [], questionRevisions: {} })),
    ]);
  }, []);

  // ── Derived metrics ────────────────────────────────────────────────────────
  // Study Progress (40%): unique MCQs solved / total quiz bank
  const uniqueQsPct  = Math.min(100, (uniqueQsAnswered.size / QUIZ_BANK_SIZE) * 100);

  // Revision Factor (35%): questions answered 2+ times / total quiz bank
  const revisedCnt   = Object.values(questionRevisions).filter((n) => n >= 2).length;
  const revisionPct  = Math.min(100, (revisedCnt / QUIZ_BANK_SIZE) * 100);

  // Quiz Accuracy (25%): correct / attempted
  const accuracyPct  = quizStats.attempted > 0
    ? Math.min(100, (quizStats.correct / quizStats.attempted) * 100)
    : 0;

  const studyProgressPct   = uniqueQsPct;
  const quizScorePct        = accuracyPct;

  // Board Prediction = Study Progress * 40% + Revision Factor * 35% + Quiz Accuracy * 25%
  const boardPredictionPct  = Math.round(
    uniqueQsPct * 0.40 + revisionPct * 0.35 + accuracyPct * 0.25,
  );

  return (
    <AppContext.Provider
      value={{
        downloadedChapters, isLoadingDownloads, markDownloaded, isDownloaded,
        isOnline,
        quizStats, isLoadingQuizStats, recordQuizAnswer, resetQuizStats,
        uniqueQsAnswered, questionRevisions, revisedCount: revisedCnt,
        QUIZ_BANK_SIZE,
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
