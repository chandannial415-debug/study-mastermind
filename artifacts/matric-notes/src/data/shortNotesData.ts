/**
 * Study Mindset — Short Notes ("Small Notebook") Data
 * ────────────────────────────────────────────────────────────────────
 * Bite-sized revision notes per chapter, shown in the "Small Notebook"
 * folder inside each chapter hub. Works fully offline (bundled in the app).
 *
 * To add notes for a chapter: add an entry keyed by the chapter's `id`
 * (see src/data/syllabus.json for valid chapter IDs).
 */

export type ShortNote = {
  chapterId: string;
  /** Short bullet-point summary points, shown as a revision checklist */
  points: string[];
};

export const SHORT_NOTES: Record<string, ShortNote> = {
  'alg-1': {
    chapterId: 'alg-1',
    points: [
      'Real numbers include all rational and irrational numbers.',
      'Euclid\'s Division Lemma: a = bq + r, where 0 ≤ r < b.',
      'HCF of two numbers can be found using Euclid\'s algorithm.',
      'Fundamental Theorem of Arithmetic: every composite number can be expressed as a product of primes uniquely.',
      '√2, √3, √5 are irrational numbers — proved by contradiction.',
    ],
  },
  'geo-1': {
    chapterId: 'geo-1',
    points: [
      'A tangent touches the circle at exactly one point.',
      'Tangent is perpendicular to the radius at the point of contact.',
      'Lengths of tangents drawn from an external point are equal.',
      'Number of tangents from a point: 0 (inside), 1 (on circle), 2 (outside).',
    ],
  },
  'phy-1': {
    chapterId: 'phy-1',
    points: [
      'Chemical reactions involve rearrangement of atoms.',
      'Types: combination, decomposition, displacement, double displacement, redox.',
      'Balancing equations follows the Law of Conservation of Mass.',
      'Oxidation = loss of electrons; Reduction = gain of electrons.',
    ],
  },
  'ls-1': {
    chapterId: 'ls-1',
    points: [
      'Life processes: nutrition, respiration, transportation, excretion.',
      'Autotrophic nutrition: organism makes its own food (e.g. photosynthesis).',
      'Heterotrophic nutrition: organism depends on others for food.',
      'Respiration can be aerobic (with O₂) or anaerobic (without O₂).',
    ],
  },
};

/** Returns the short notes for a chapter, or null if not yet authored. */
export function getShortNotes(chapterId: string): ShortNote | null {
  return SHORT_NOTES[chapterId] ?? null;
}
