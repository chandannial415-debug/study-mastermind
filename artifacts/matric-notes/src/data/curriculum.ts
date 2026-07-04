/**
 * Study Mindset — Curriculum Data Layer
 * ─────────────────────────────────────
 * This file is the single source of truth for all navigation data.
 * Raw data lives in syllabus.json (BSE Odisha Class 10, strictly no Class 9).
 * This module re-exports typed constants and helper functions consumed by screens.
 */

import syllabusJson from './syllabus.json';

// ── Exported types ────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  color: string;
  lightBg: string;
};

export type Subject = {
  id: string;
  name: string;
  iconName: string;
  categoryId: string;
  totalChapters: number;
};

export type Chapter = {
  id: string;
  name: string;
  subjectId: string;
  pdfUrl: string;
};

// ── Typed constants derived from syllabus.json ────────────────────────────────

export const CATEGORIES: Category[] = syllabusJson.categories as Category[];

export const SUBJECTS: Subject[] = syllabusJson.subjects as Subject[];

export const CHAPTERS: Record<string, Chapter[]> =
  syllabusJson.chapters as Record<string, Chapter[]>;

// ── Helper functions ──────────────────────────────────────────────────────────

export function getSubjectsByCategory(categoryId: string): Subject[] {
  return SUBJECTS.filter((s) => s.categoryId === categoryId);
}

export function getChaptersBySubject(subjectId: string): Chapter[] {
  return CHAPTERS[subjectId] ?? [];
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

/** Total chapter count across all subjects */
export function getTotalChapterCount(): number {
  return SUBJECTS.reduce((acc, s) => acc + s.totalChapters, 0);
}
