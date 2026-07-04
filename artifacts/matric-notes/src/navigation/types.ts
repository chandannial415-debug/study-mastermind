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
    categoryId: string;
    categoryName: string;
    /** Hex accent colour forwarded from the category */
    categoryColor: string;
  };

  /** Chapter/folder list for a subject */
  chapters: {
    subjectId: string;
    subjectName: string;
    /** Hex accent colour forwarded from the category */
    categoryColor: string;
  };

  /** PDF / notes viewer */
  viewer: {
    chapterId: string;
    chapterName: string;
    subjectName: string;
  };

  /** Gaming / Quiz revision mode */
  gaming: undefined;
};
