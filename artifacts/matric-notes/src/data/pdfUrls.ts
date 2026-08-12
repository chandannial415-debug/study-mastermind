/**
 * PDF URL Registry
 * ─────────────────────────────────────────────
 * Google Drive configuration has been removed.
 *
 * All PDF data will now be fetched directly
 * from Supabase.
 *
 * This file is kept only for compatibility with
 * existing imports in the app.
 */

export function getPdfViewUrl(chapterId: string): string | null {
  return null;
}

export function getPdfEmbedUrl(chapterId: string): string | null {
  return null;
}

export function hasPdf(chapterId: string): boolean {
  return false;
}

export const PDF_DRIVE_IDS: Record<string, string> = {};
