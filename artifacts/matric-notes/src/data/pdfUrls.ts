/**
 * Study Mindset — Google Drive PDF URL Registry
 * ──────────────────────────────────────────────
 * Maps each chapter ID to its Google Drive file ID.
 * Replace the empty strings with real file IDs once PDFs are uploaded to Drive.
 *
 * How to get a file ID:
 *   1. Upload the PDF to Google Drive
 *   2. Right-click → Share → Copy link
 *   3. The URL is: https://drive.google.com/file/d/{FILE_ID}/view
 *   4. Paste the FILE_ID below for the matching chapter
 *
 * Viewer URL format:  https://drive.google.com/file/d/{ID}/view
 * Embed URL format:   https://drive.google.com/file/d/{ID}/preview
 * Download URL:       https://drive.google.com/uc?export=download&id={ID}
 */

/** Google Drive file IDs keyed by chapter ID. Empty = not yet uploaded. */
export const PDF_DRIVE_IDS: Record<string, string> = {
  // ── Odia ────────────────────────────────────────
  'odia-1': '', 'odia-2': '', 'odia-3': '', 'odia-4': '', 'odia-5': '',
  'odia-6': '', 'odia-7': '', 'odia-8': '', 'odia-9': '', 'odia-10': '',
  'odia-11': '', 'odia-12': '', 'odia-13': '', 'odia-14': '', 'odia-15': '',
  'odia-16': '', 'odia-17': '', 'odia-18': '',

  // ── Odia Grammar ────────────────────────────────
  'odia-gr-1': '', 'odia-gr-2': '', 'odia-gr-3': '', 'odia-gr-4': '',
  'odia-gr-5': '', 'odia-gr-6': '', 'odia-gr-7': '',

  // ── Algebra ─────────────────────────────────────
  'alg-1': '', 'alg-2': '', 'alg-3': '', 'alg-4': '',
  'alg-5': '', 'alg-6': '', 'alg-7': '', 'alg-8': '',

  // ── Geometry ────────────────────────────────────
  'geo-1': '', 'geo-2': '', 'geo-3': '', 'geo-4': '',
  'geo-5': '', 'geo-6': '', 'geo-7': '',

  // ── Physical Science ────────────────────────────
  'phy-1': '', 'phy-2': '', 'phy-3': '', 'phy-4': '', 'phy-5': '',
  'phy-6': '', 'phy-7': '', 'phy-8': '', 'phy-9': '',

  // ── Life Science ────────────────────────────────
  'ls-1': '', 'ls-2': '', 'ls-3': '', 'ls-4': '', 'ls-5': '', 'ls-6': '',
  'ls-7': '', 'ls-8': '', 'ls-9': '', 'ls-10': '', 'ls-11': '',

  // ── English ─────────────────────────────────────
  'eng-1': '', 'eng-2': '', 'eng-3': '', 'eng-4': '', 'eng-5': '',
  'eng-6': '', 'eng-7': '', 'eng-8': '', 'eng-9': '', 'eng-10': '',
  'eng-11': '', 'eng-12': '', 'eng-13': '', 'eng-14': '', 'eng-15': '',

  // ── English Grammar ─────────────────────────────
  'eng-gr-1': '', 'eng-gr-2': '', 'eng-gr-3': '', 'eng-gr-4': '', 'eng-gr-5': '',
  'eng-gr-6': '', 'eng-gr-7': '', 'eng-gr-8': '', 'eng-gr-9': '', 'eng-gr-10': '',

  // ── History ─────────────────────────────────────
  'hist-1': '', 'hist-2': '', 'hist-3': '', 'hist-4': '',
  'hist-5': '', 'hist-6': '', 'hist-7': '', 'hist-8': '',

  // ── Geography ───────────────────────────────────
  'geog-1': '', 'geog-2': '', 'geog-3': '', 'geog-4': '', 'geog-5': '',
  'geog-6': '', 'geog-7': '', 'geog-8': '', 'geog-9': '', 'geog-10': '',
  'geog-11': '', 'geog-12': '', 'geog-13': '', 'geog-14': '', 'geog-15': '',
  'geog-16': '', 'geog-17': '', 'geog-18': '', 'geog-19': '',

  // ── Hindi ───────────────────────────────────────
  'hin-1': '', 'hin-2': '', 'hin-3': '', 'hin-4': '', 'hin-5': '',
  'hin-6': '', 'hin-7': '', 'hin-8': '', 'hin-9': '', 'hin-10': '', 'hin-11': '',

  // ── Hindi Grammar ───────────────────────────────
  'hin-gr-1': '', 'hin-gr-2': '', 'hin-gr-3': '', 'hin-gr-4': '', 'hin-gr-5': '',
  'hin-gr-6': '', 'hin-gr-7': '', 'hin-gr-8': '', 'hin-gr-9': '', 'hin-gr-10': '',
  'hin-gr-11': '', 'hin-gr-12': '',

  // ── Sanskrit Literature ─────────────────────────
  'skt-1': '', 'skt-2': '', 'skt-3': '', 'skt-4': '', 'skt-5': '', 'skt-6': '',
  'skt-7': '', 'skt-8': '', 'skt-9': '', 'skt-10': '', 'skt-11': '', 'skt-12': '',
  'skt-13': '', 'skt-14': '', 'skt-15': '', 'skt-16': '',

  // ── Sanskrit Grammar ────────────────────────────
  'skt-gr-1': '', 'skt-gr-2': '', 'skt-gr-3': '', 'skt-gr-4': '', 'skt-gr-5': '',
  'skt-gr-6': '', 'skt-gr-7': '', 'skt-gr-8': '', 'skt-gr-9': '', 'skt-gr-10': '',
  'skt-gr-11': '', 'skt-gr-12': '', 'skt-gr-13': '',

  // ── Vocational IT ───────────────────────────────
  'vit-1': '', 'vit-2': '', 'vit-3': '', 'vit-4': '',
  'vit-5': '', 'vit-6': '', 'vit-7': '',

  // ── Vocational Retail ───────────────────────────
  'vrt-1': '', 'vrt-2': '', 'vrt-3': '', 'vrt-4': '', 'vrt-5': '',

  // ── Vocational Automobile ───────────────────────
  'vau-1': '', 'vau-2': '', 'vau-3': '', 'vau-4': '', 'vau-5': '',

  // ── Vocational Tourism ──────────────────────────
  'vtr-1': '', 'vtr-2': '', 'vtr-3': '', 'vtr-4': '', 'vtr-5': '',
};

const DRIVE_BASE = 'https://drive.google.com/file/d';

/**
 * Returns the Google Drive viewer URL for a chapter, or null if no ID is set.
 * Opens as a standard Google Drive view page — works in any browser.
 */
export function getPdfViewUrl(chapterId: string): string | null {
  const id = PDF_DRIVE_IDS[chapterId];
  if (!id) return null;
  return `${DRIVE_BASE}/${id}/view`;
}

/**
 * Returns the Google Drive embeddable preview URL (for WebView use).
 * Returns null if no ID is set.
 */
export function getPdfEmbedUrl(chapterId: string): string | null {
  const id = PDF_DRIVE_IDS[chapterId];
  if (!id) return null;
  return `${DRIVE_BASE}/${id}/preview`;
}

/**
 * Returns whether a chapter has a real Drive PDF configured.
 */
export function hasPdf(chapterId: string): boolean {
  return Boolean(PDF_DRIVE_IDS[chapterId]);
}
