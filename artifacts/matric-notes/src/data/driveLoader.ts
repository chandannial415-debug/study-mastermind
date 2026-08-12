/**
 * Content Loader
 * ─────────────────────────────────────────────
 * Google Drive configuration has been removed.
 *
 * PDF and MCQ data will now be fetched directly
 * from Supabase.
 *
 * This file is kept as a compatibility layer so
 * existing imports do not break.
 */

import type { QuizQuestion } from './quizData';

/**
 * Google Drive is no longer used.
 */
export function extractDriveFileId(_url: string): string | null {
  return null;
}

/**
 * PDF URLs are now provided by Supabase.
 */
export function getPdfUrlFromConfig(_chapterId: string): string | null {
  return null;
}

export function buildDrivePdfViewUrl(_configUrl: string): string {
  return '';
}

export function buildDrivePdfEmbedUrl(_configUrl: string): string {
  return '';
}

export function hasPdfInConfig(_chapterId: string): boolean {
  return false;
}

/**
 * MCQs are now fetched directly from Supabase.
 */
export function getMcqUrlsForSubject(_subjectId: string): string[] {
  return [];
}

/**
 * Kept for compatibility with existing code.
 * Supabase will be the actual source of MCQ data.
 */
export async function fetchMcqsFromConfig(
  _subjectId: string
): Promise<QuizQuestion[]> {
  return [];
}

/**
 * Google Drive configuration is no longer used.
 */
export function getConfigSummary(): {
  pdfs: string[];
  mcqSubjects: string[];
} {
  return {
    pdfs: [],
    mcqSubjects: [],
  };
}
