/**
 * Study Mindset — Navigation Parameter Types
 * Typed params for every route in the Stack navigator.
 */

export type RootStackParamList = {
  /** Animated splash / entry screen */
  index: undefined;

  /** Home dashboard — category list */
  home: undefined;

  /** Subject list for a category */
  subjects: {
    categoryId:    string;
    categoryName:  string;
    /** Hex accent colour forwarded from the category */
    categoryColor: string;
  };

  /** Chapter/folder list for a subject */
  chapters: {
    subjectId:     string;
    subjectName:   string;
    /** Hex accent colour forwarded from the category */
    categoryColor: string;
  };

  /** Chapter hub — 5 folders (Full Book, Small Notebook, MCQ, PYQ, Gaming Mode) */
  chapterHub: {
    chapterId:     string;
    chapterName:   string;
    subjectId:     string;
    subjectName:   string;
    categoryColor: string;
  };

  /** PDF / full textbook notes viewer */
  viewer: {
    chapterId:   string;
    chapterName: string;
    subjectName: string;
  };

  /** Small Notebook — short revision notes for a chapter */
  notes: {
    chapterId:   string;
    chapterName: string;
    subjectName: string;
  };

  /** Previous Year Questions practice screen for a chapter */
  pyq: {
    chapterId:      string;
    chapterName:    string;
    subjectName:    string;
    categoryColor?: string;
  };

  /** Gaming / Quiz revision mode hub (subject-wide) */
  gaming: undefined;

  /** Active MCQ quiz — either subject-wide or scoped to one chapter */
  quiz: {
    subjectId:      string;
    subjectName:    string;
    categoryColor?: string;
    /** When set, quiz pulls chapter-specific questions first (falls back to subject bank) */
    chapterId?:     string;
    chapterName?:   string;
    /** 'mcq' = standard practice, 'gaming' = same engine with festive framing, requires internet */
    mode?:          'mcq' | 'gaming';
  };
};
