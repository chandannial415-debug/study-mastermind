/**
 * Drive Loader — reads drive-sources.json and builds flat lookup maps
 * so the rest of the app can call getPdfUrlFromConfig(chapterId) or
 * getMcqUrlsForSubject(subjectId) without knowing the JSON structure.
 *
 * The user only ever edits drive-sources.json — this file is auto-wiring.
 */

import driveConfig from './drive-sources.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QuizQuestion } from './quizData';

// ── Chapter ID arrays per subject (ordered) ───────────────────────────────────
// These must match pdfUrls.ts and syllabus.json exactly.
const CHAPTER_IDS: Record<string, string[]> = {
  'algebra':             ['alg-1','alg-2','alg-3','alg-4','alg-5','alg-6','alg-7','alg-8'],
  'geometry':            ['geo-1','geo-2','geo-3','geo-4','geo-5','geo-6','geo-7'],
  'physical-science':    ['phy-1','phy-2','phy-3','phy-4','phy-5','phy-6','phy-7','phy-8','phy-9'],
  'life-science':        ['ls-1','ls-2','ls-3','ls-4','ls-5','ls-6','ls-7','ls-8','ls-9','ls-10','ls-11'],
  'english':             ['eng-1','eng-2','eng-3','eng-4','eng-5','eng-6','eng-7','eng-8','eng-9','eng-10','eng-11','eng-12','eng-13','eng-14','eng-15'],
  'english-grammar':     ['eng-gr-1','eng-gr-2','eng-gr-3','eng-gr-4','eng-gr-5','eng-gr-6','eng-gr-7','eng-gr-8','eng-gr-9','eng-gr-10'],
  'history':             ['hist-1','hist-2','hist-3','hist-4','hist-5','hist-6','hist-7','hist-8'],
  'geography':           ['geog-1','geog-2','geog-3','geog-4','geog-5','geog-6','geog-7','geog-8','geog-9','geog-10','geog-11','geog-12','geog-13','geog-14','geog-15','geog-16','geog-17','geog-18','geog-19'],
  'odia':                ['odia-1','odia-2','odia-3','odia-4','odia-5','odia-6','odia-7','odia-8','odia-9','odia-10','odia-11','odia-12','odia-13','odia-14','odia-15','odia-16','odia-17','odia-18'],
  'odia-grammar':        ['odia-gr-1','odia-gr-2','odia-gr-3','odia-gr-4','odia-gr-5','odia-gr-6','odia-gr-7'],
  'hindi':               ['hin-1','hin-2','hin-3','hin-4','hin-5','hin-6','hin-7','hin-8','hin-9','hin-10','hin-11'],
  'hindi-grammar':       ['hin-gr-1','hin-gr-2','hin-gr-3','hin-gr-4','hin-gr-5','hin-gr-6','hin-gr-7','hin-gr-8','hin-gr-9','hin-gr-10','hin-gr-11','hin-gr-12'],
  'sanskrit':            ['skt-1','skt-2','skt-3','skt-4','skt-5','skt-6','skt-7','skt-8','skt-9','skt-10','skt-11','skt-12','skt-13','skt-14','skt-15','skt-16'],
  'sanskrit-grammar':    ['skt-gr-1','skt-gr-2','skt-gr-3','skt-gr-4','skt-gr-5','skt-gr-6','skt-gr-7','skt-gr-8','skt-gr-9','skt-gr-10','skt-gr-11','skt-gr-12','skt-gr-13'],
  'vocational-it':       ['vit-1','vit-2','vit-3','vit-4','vit-5','vit-6','vit-7'],
  'vocational-retail':   ['vrt-1','vrt-2','vrt-3','vrt-4','vrt-5'],
  'vocational-automobile':['vau-1','vau-2','vau-3','vau-4','vau-5'],
  'vocational-tourism':  ['vtr-1','vtr-2','vtr-3','vtr-4','vtr-5'],
};

// ── Types ─────────────────────────────────────────────────────────────────────
type ChapterEntry = { PDF?: string; MCQs?: string };
type SubjectEntry = Record<string, string | ChapterEntry>;
type CategoryData = Record<string, SubjectEntry>;

// ── Lookup maps (built once at module init) ───────────────────────────────────
const _pdfUrlMap:  Record<string, string>   = {};  // chapterId → PDF drive URL
const _mcqUrlMap:  Record<string, string[]> = {};  // subjectId → MCQ drive URL[]

function _isPlaceholder(val: string): boolean {
  return !val || val.includes('PASTE_') || val.includes('YOUR_FILE_ID');
}

function _buildMaps() {
  const classData = driveConfig['10th_Class'] as Record<string, CategoryData>;

  for (const categoryData of Object.values(classData)) {
    for (const [, subjectEntry] of Object.entries(categoryData)) {
      if (typeof subjectEntry !== 'object') continue;

      const subjectId = (subjectEntry as any)['_subject_id'] as string | undefined;
      if (!subjectId) continue;

      const chapterIds = CHAPTER_IDS[subjectId] ?? [];

      for (const [key, value] of Object.entries(subjectEntry)) {
        // Skip meta keys
        if (key.startsWith('_')) continue;

        // Chapter_N key
        const match = key.match(/^Chapter_(\d+)$/);
        if (!match) continue;

        const idx       = parseInt(match[1], 10) - 1;
        const chapterId = chapterIds[idx];
        if (!chapterId) continue;

        if (typeof value === 'object' && value !== null) {
          const entry = value as ChapterEntry;

          // PDF URL
          if (entry.PDF && !_isPlaceholder(entry.PDF)) {
            _pdfUrlMap[chapterId] = entry.PDF;
          }

          // Per-chapter MCQ URL
          if (entry.MCQs && !_isPlaceholder(entry.MCQs)) {
            _mcqUrlMap[subjectId] = _mcqUrlMap[subjectId] ?? [];
            if (!_mcqUrlMap[subjectId].includes(entry.MCQs)) {
              _mcqUrlMap[subjectId].push(entry.MCQs);
            }
          }
        }
      }

      // Subject-level MCQ URL (applies to all chapters)
      const allMcqs = (subjectEntry as any)['_all_chapter_mcqs'] as string | undefined;
      if (allMcqs && !_isPlaceholder(allMcqs)) {
        _mcqUrlMap[subjectId] = _mcqUrlMap[subjectId] ?? [];
        if (!_mcqUrlMap[subjectId].includes(allMcqs)) {
          _mcqUrlMap[subjectId].unshift(allMcqs); // subject-level first
        }
      }
    }
  }
}

// Build maps immediately on import
_buildMaps();

// ── Public helpers ─────────────────────────────────────────────────────────────

/**
 * Extracts the Google Drive file ID from any Drive share URL format.
 * Returns null for placeholders or unrecognised strings.
 */
export function extractDriveFileId(url: string): string | null {
  if (!url || _isPlaceholder(url)) return null;

  // /file/d/{ID}/
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // ?id={ID} or &id={ID}
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];

  // /spreadsheets/d/{ID}/
  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetMatch) return sheetMatch[1];

  // Bare file ID (25+ alphanumeric chars)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) return url;

  return null;
}

/**
 * Returns the Google Drive PDF URL for a chapter as configured in drive-sources.json.
 * Returns null if not configured yet.
 */
export function getPdfUrlFromConfig(chapterId: string): string | null {
  return _pdfUrlMap[chapterId] ?? null;
}

/**
 * Returns Drive PDF viewer URL (for opening in browser).
 * Tries config first, falls back to a raw file ID if provided.
 */
export function buildDrivePdfViewUrl(configUrl: string): string {
  const id = extractDriveFileId(configUrl);
  if (id) return `https://drive.google.com/file/d/${id}/view`;
  return configUrl; // already a full URL
}

/**
 * Returns Drive PDF embed URL (for WebView).
 */
export function buildDrivePdfEmbedUrl(configUrl: string): string {
  const id = extractDriveFileId(configUrl);
  if (id) return `https://drive.google.com/file/d/${id}/preview`;
  return configUrl;
}

/**
 * Returns whether a chapter has a PDF URL configured in drive-sources.json.
 */
export function hasPdfInConfig(chapterId: string): boolean {
  return Boolean(_pdfUrlMap[chapterId]);
}

/**
 * Returns the MCQ Drive URL(s) for a subject.
 * Subject-level URL comes first; per-chapter URLs follow.
 */
export function getMcqUrlsForSubject(subjectId: string): string[] {
  return _mcqUrlMap[subjectId] ?? [];
}

// ── MCQ fetching from Drive ────────────────────────────────────────────────────
const MCQ_CACHE_PREFIX = '@matric_drive_mcq_v1_';
const MCQ_CACHE_TTL    = 12 * 60 * 60 * 1000; // 12 hours

type CachedMcq = { timestamp: number; questions: QuizQuestion[] };

/**
 * Fetches MCQ questions for a subject from all configured Drive URLs.
 * Results are merged, validated, and cached for 12 hours.
 * Returns empty array if nothing is configured or fetch fails.
 */
export async function fetchMcqsFromConfig(subjectId: string): Promise<QuizQuestion[]> {
  const urls = getMcqUrlsForSubject(subjectId);
  if (urls.length === 0) return [];

  const cacheKey = MCQ_CACHE_PREFIX + subjectId;

  // Check cache
  try {
    const raw = await AsyncStorage.getItem(cacheKey);
    if (raw) {
      const cached: CachedMcq = JSON.parse(raw);
      if (Date.now() - cached.timestamp < MCQ_CACHE_TTL && cached.questions.length > 0) {
        return cached.questions;
      }
    }
  } catch {
    // ignore
  }

  // Fetch from all configured URLs, merge results
  const all: QuizQuestion[] = [];
  for (const url of urls) {
    try {
      const downloadUrl = _toDownloadUrl(url);
      const controller  = new AbortController();
      const timer       = setTimeout(() => controller.abort(), 8000);
      const res         = await fetch(downloadUrl, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const data = await res.json();
      const qs: unknown[] = Array.isArray(data?.questions) ? data.questions : (Array.isArray(data) ? data : []);

      const valid = qs.filter(_isValidQuestion) as QuizQuestion[];
      all.push(...valid);
    } catch {
      // silently skip failed URLs
    }
  }

  if (all.length === 0) return [];

  // De-duplicate by id
  const seen = new Set<string>();
  const unique = all.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });

  // Persist cache
  try {
    const cached: CachedMcq = { timestamp: Date.now(), questions: unique };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch {
    // ignore
  }

  return unique;
}

/** Convert any Drive share URL to a direct-download URL for JSON fetching */
function _toDownloadUrl(url: string): string {
  const id = extractDriveFileId(url);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return url;
}

function _isValidQuestion(q: unknown): boolean {
  if (typeof q !== 'object' || q === null) return false;
  const r = q as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.subjectId === 'string' &&
    typeof r.question === 'string' &&
    Array.isArray(r.options) &&
    (r.options as unknown[]).length === 4 &&
    (r.options as unknown[]).every((o) => typeof o === 'string') &&
    typeof r.correctIndex === 'number' &&
    r.correctIndex >= 0 &&
    r.correctIndex <= 3
  );
}

/**
 * Returns a debug summary of what's configured (useful for development).
 * Lists which chapters and subjects have Drive URLs set.
 */
export function getConfigSummary(): { pdfs: string[]; mcqSubjects: string[] } {
  return {
    pdfs:        Object.keys(_pdfUrlMap),
    mcqSubjects: Object.keys(_mcqUrlMap),
  };
}
