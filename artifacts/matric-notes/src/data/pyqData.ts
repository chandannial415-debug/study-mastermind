/**
 * Study Mindset — Previous Year Questions (PYQ) Data
 * ────────────────────────────────────────────────────────────────────
 * BSE Odisha board exam questions from previous years, organised per
 * chapter. Works fully offline (bundled in the app).
 *
 * To add PYQs for a chapter: append entries with the matching `chapterId`
 * (see src/data/syllabus.json for valid chapter IDs).
 */

export type PYQQuestion = {
  id: string;
  chapterId: string;
  year: number;
  question: string;
  answer: string;
  marks: number;
};

export const PYQ_BANK: PYQQuestion[] = [
  {
    id: 'pyq-alg1-2024',
    chapterId: 'alg-1',
    year: 2024,
    question: 'Prove that √5 is an irrational number.',
    answer:
      'Assume √5 is rational, so √5 = p/q where p, q are co-prime integers and q ≠ 0. ' +
      'Squaring: 5q² = p², so p² is divisible by 5, hence p is divisible by 5. ' +
      'Let p = 5k. Then 5q² = 25k² → q² = 5k², so q is also divisible by 5. ' +
      'This contradicts p, q being co-prime. Hence √5 is irrational.',
    marks: 3,
  },
  {
    id: 'pyq-alg1-2023',
    chapterId: 'alg-1',
    year: 2023,
    question: 'Find the HCF and LCM of 26 and 91 using the Fundamental Theorem of Arithmetic.',
    answer:
      '26 = 2 × 13, 91 = 7 × 13. HCF = 13 (common prime factor). ' +
      'LCM = (26 × 91)/HCF = 2366/13 = 182.',
    marks: 2,
  },
  {
    id: 'pyq-geo1-2024',
    chapterId: 'geo-1',
    year: 2024,
    question: 'Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.',
    answer:
      'Let O be the centre and P the point of contact of tangent XY. Take any other point Q ' +
      'on XY and join OQ. Since Q lies outside the circle, OQ > OP (radius). This is true for ' +
      'every point on XY except P, so OP is the shortest distance, meaning OP ⊥ XY.',
    marks: 3,
  },
  {
    id: 'pyq-phy1-2023',
    chapterId: 'phy-1',
    year: 2023,
    question: 'Balance the chemical equation: Fe + H₂O → Fe₃O₄ + H₂',
    answer: '3Fe + 4H₂O → Fe₃O₄ + 4H₂',
    marks: 2,
  },
  {
    id: 'pyq-ls1-2024',
    chapterId: 'ls-1',
    year: 2024,
    question: 'Differentiate between aerobic and anaerobic respiration.',
    answer:
      'Aerobic respiration uses oxygen, occurs in mitochondria, and produces CO₂ + H₂O + more energy (38 ATP). ' +
      'Anaerobic respiration does not use oxygen, occurs in cytoplasm, and produces less energy (2 ATP), ' +
      'along with lactic acid (in muscles) or ethanol + CO₂ (in yeast).',
    marks: 3,
  },
];

/** Returns all PYQ entries for a given chapter, most recent year first. */
export function getPyqByChapter(chapterId: string): PYQQuestion[] {
  return PYQ_BANK
    .filter((q) => q.chapterId === chapterId)
    .sort((a, b) => b.year - a.year);
}
