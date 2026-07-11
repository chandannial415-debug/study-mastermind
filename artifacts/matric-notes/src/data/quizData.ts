/**
 * Study Mindset — Quiz Question Bank
 * ────────────────────────────────────────────────────────────────────
 * Questions are fetched dynamically from a Google Drive JSON file.
 * Falls back to the built-in LOCAL_QUIZ_BANK when offline or fetch fails.
 *
 * Drive JSON schema:
 * {
 *   "version": "1.0",
 *   "questions": QuizQuestion[]
 * }
 *
 * Replace QUIZ_DRIVE_JSON_URL with your published Google Drive JSON file URL.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Remote data source ────────────────────────────────────────────────────────
// To update: Sheets → File → Share → Publish to web → CSV/JSON, or upload a
// JSON file to Drive and set it to "Anyone with the link can view", then use:
// https://drive.google.com/uc?export=download&id={FILE_ID}
const QUIZ_DRIVE_JSON_URL =
  'https://drive.google.com/uc?export=download&id=REPLACE_WITH_YOUR_DRIVE_FILE_ID';

const QUIZ_CACHE_KEY   = '@matric_notes_quiz_bank_v1';
const CACHE_TTL_MS     = 24 * 60 * 60 * 1000; // 24 hours

// ── Types ─────────────────────────────────────────────────────────────────────
export type QuizQuestion = {
  id: string;
  subjectId: string;
  /** Optional — when set, this question is scoped to one specific chapter */
  chapterId?: string;
  /** Question text — may be in the subject's native language */
  question: string;
  /** Exactly 4 options */
  options: [string, string, string, string];
  /** 0-based index of the correct option */
  correctIndex: 0 | 1 | 2 | 3;
  /** Optional brief explanation shown after answering */
  explanation?: string;
};

// ── Local question bank ───────────────────────────────────────────────────────
export const LOCAL_QUIZ_BANK: QuizQuestion[] = [
  // ── Algebra ────────────────────────────────────────────────────────────────
  {
    id: 'alg-q1', subjectId: 'algebra',
    question: 'Which of the following is a quadratic equation?',
    options: ['2x + 3 = 0', 'x² − 5x + 6 = 0', 'x³ + 2 = 0', '√x + 1 = 0'],
    correctIndex: 1,
    explanation: 'A quadratic equation has degree 2. x² − 5x + 6 = 0 is the only one with highest power 2.',
  },
  {
    id: 'alg-q2', subjectId: 'algebra',
    question: 'The roots of x² − 5x + 6 = 0 are:',
    options: ['2 and 3', '1 and 6', '−2 and −3', '1 and −6'],
    correctIndex: 0,
    explanation: '(x−2)(x−3) = 0, so x = 2 or x = 3.',
  },
  {
    id: 'alg-q3', subjectId: 'algebra',
    question: 'The sum of first n natural numbers is:',
    options: ['n(n+1)/2', 'n(n−1)/2', 'n²/2', '2n'],
    correctIndex: 0,
    explanation: 'Formula: Sₙ = n(n+1)/2.',
  },
  {
    id: 'alg-q4', subjectId: 'algebra',
    question: 'If P(E) = 0.7, then P(not E) = ?',
    options: ['0.7', '1.7', '0.3', '0'],
    correctIndex: 2,
    explanation: 'P(not E) = 1 − P(E) = 1 − 0.7 = 0.3.',
  },
  {
    id: 'alg-q5', subjectId: 'algebra',
    question: 'The degree of polynomial 3x⁴ − 5x² + 2 is:',
    options: ['2', '4', '3', '1'],
    correctIndex: 1,
    explanation: 'The highest power of x is 4, so degree = 4.',
  },
  {
    id: 'alg-q6', subjectId: 'algebra',
    question: 'For a pair of linear equations to have no solution, their graph lines must be:',
    options: ['Intersecting', 'Parallel', 'Coincident', 'Perpendicular'],
    correctIndex: 1,
    explanation: 'Parallel lines never meet, so there is no solution.',
  },
  {
    id: 'alg-q7', subjectId: 'algebra',
    question: 'The discriminant of ax² + bx + c = 0 is:',
    options: ['b² + 4ac', 'b² − 4ac', '4ac − b²', '√(b² − 4ac)'],
    correctIndex: 1,
    explanation: 'Discriminant D = b² − 4ac determines the nature of roots.',
  },
  {
    id: 'alg-q8', subjectId: 'algebra',
    question: 'The nth term of an AP with first term a and common difference d is:',
    options: ['a + nd', 'a + (n−1)d', 'a − (n−1)d', 'nd'],
    correctIndex: 1,
    explanation: 'aₙ = a + (n−1)d.',
  },

  // ── Geometry ───────────────────────────────────────────────────────────────
  {
    id: 'geo-q1', subjectId: 'geometry',
    question: 'The tangent to a circle at any point is ___ to the radius at that point.',
    options: ['Parallel', 'Perpendicular', 'Equal', 'Coincident'],
    correctIndex: 1,
    explanation: 'The tangent is always perpendicular to the radius at the point of tangency.',
  },
  {
    id: 'geo-q2', subjectId: 'geometry',
    question: 'The midpoint of the line joining (2, 4) and (6, 8) is:',
    options: ['(4, 6)', '(8, 12)', '(3, 5)', '(2, 4)'],
    correctIndex: 0,
    explanation: 'Midpoint = ((2+6)/2, (4+8)/2) = (4, 6).',
  },
  {
    id: 'geo-q3', subjectId: 'geometry',
    question: 'sin 45° equals:',
    options: ['1/2', '√3/2', '1/√2', '1'],
    correctIndex: 2,
    explanation: 'sin 45° = 1/√2 ≈ 0.707.',
  },
  {
    id: 'geo-q4', subjectId: 'geometry',
    question: 'Two triangles are similar if their corresponding ___ are equal.',
    options: ['Sides', 'Angles', 'Areas', 'Perimeters'],
    correctIndex: 1,
    explanation: 'AA (Angle-Angle) criterion: equal corresponding angles → similar triangles.',
  },
  {
    id: 'geo-q5', subjectId: 'geometry',
    question: 'Volume of a sphere of radius r is:',
    options: ['4πr²', '(4/3)πr³', '2πr²', '(2/3)πr³'],
    correctIndex: 1,
    explanation: 'Volume = (4/3)πr³.',
  },
  {
    id: 'geo-q6', subjectId: 'geometry',
    question: 'The value of tan 60° is:',
    options: ['1/√3', '1', '√3', '2'],
    correctIndex: 2,
    explanation: 'tan 60° = √3 ≈ 1.732.',
  },
  {
    id: 'geo-q7', subjectId: 'geometry',
    question: 'A ladder leans against a wall at 60° to the ground. If the foot is 4 m away, the height reached is:',
    options: ['4√3 m', '4/√3 m', '2√3 m', '8 m'],
    correctIndex: 0,
    explanation: 'height = 4 × tan 60° = 4√3 m.',
  },

  // ── Physical Science ───────────────────────────────────────────────────────
  {
    id: 'phy-q1', subjectId: 'physical-science',
    question: 'The chemical formula of baking soda is:',
    options: ['NaCl', 'NaHCO₃', 'Na₂CO₃', 'NaOH'],
    correctIndex: 1,
    explanation: 'Baking soda = Sodium bicarbonate = NaHCO₃.',
  },
  {
    id: 'phy-q2', subjectId: 'physical-science',
    question: 'Which metal is found in liquid state at room temperature?',
    options: ['Iron', 'Mercury', 'Sodium', 'Gold'],
    correctIndex: 1,
    explanation: 'Mercury (Hg) is the only metal liquid at standard room temperature.',
  },
  {
    id: 'phy-q3', subjectId: 'physical-science',
    question: 'The SI unit of electric current is:',
    options: ['Volt', 'Watt', 'Ampere', 'Ohm'],
    correctIndex: 2,
    explanation: 'Electric current is measured in Ampere (A).',
  },
  {
    id: 'phy-q4', subjectId: 'physical-science',
    question: 'pH of a pure neutral solution is:',
    options: ['0', '7', '14', '4'],
    correctIndex: 1,
    explanation: 'Pure water / neutral solution has pH = 7.',
  },
  {
    id: 'phy-q5', subjectId: 'physical-science',
    question: 'When light passes from a denser to rarer medium, it bends:',
    options: ['Towards the normal', 'Away from the normal', 'Straight through', 'Back (reflects)'],
    correctIndex: 1,
    explanation: 'Light bends away from the normal when entering a rarer medium.',
  },
  {
    id: 'phy-q6', subjectId: 'physical-science',
    question: 'Ohm\'s Law states V = ?',
    options: ['I/R', 'I × R', 'R/I', 'I²R'],
    correctIndex: 1,
    explanation: 'V = I × R (Voltage = Current × Resistance).',
  },
  {
    id: 'phy-q7', subjectId: 'physical-science',
    question: 'The most reactive metal in the activity series is:',
    options: ['Gold', 'Copper', 'Potassium', 'Iron'],
    correctIndex: 2,
    explanation: 'Potassium (K) is at the top of the reactivity series.',
  },
  {
    id: 'phy-q8', subjectId: 'physical-science',
    question: 'The mirror formula is:',
    options: ['1/v + 1/u = 1/f', '1/v − 1/u = 1/f', 'v + u = f', 'v × u = f'],
    correctIndex: 0,
    explanation: '1/v + 1/u = 1/f (mirror formula for concave/convex mirrors).',
  },
  {
    id: 'phy-q9', subjectId: 'physical-science',
    question: 'Carbon has valency:',
    options: ['2', '3', '4', '6'],
    correctIndex: 2,
    explanation: 'Carbon has 4 valence electrons, so its valency is 4.',
  },

  // ── Life Science ───────────────────────────────────────────────────────────
  {
    id: 'ls-q1', subjectId: 'life-science',
    question: 'Which part of the brain controls breathing and heart rate?',
    options: ['Cerebrum', 'Cerebellum', 'Medulla Oblongata', 'Thalamus'],
    correctIndex: 2,
    explanation: 'The medulla oblongata controls involuntary functions like breathing.',
  },
  {
    id: 'ls-q2', subjectId: 'life-science',
    question: 'DNA is found in which part of the cell?',
    options: ['Cell wall', 'Cytoplasm', 'Nucleus', 'Ribosome'],
    correctIndex: 2,
    explanation: 'DNA is located in the nucleus (and also in mitochondria).',
  },
  {
    id: 'ls-q3', subjectId: 'life-science',
    question: 'The process by which plants make their own food is called:',
    options: ['Respiration', 'Transpiration', 'Photosynthesis', 'Digestion'],
    correctIndex: 2,
    explanation: 'Photosynthesis uses sunlight + CO₂ + water → glucose + O₂.',
  },
  {
    id: 'ls-q4', subjectId: 'life-science',
    question: 'Insulin is secreted by the:',
    options: ['Thyroid gland', 'Pituitary gland', 'Liver', 'Pancreas'],
    correctIndex: 3,
    explanation: 'The beta cells of the pancreas produce insulin.',
  },
  {
    id: 'ls-q5', subjectId: 'life-science',
    question: 'Deficiency of Vitamin C causes:',
    options: ['Rickets', 'Scurvy', 'Night blindness', 'Beriberi'],
    correctIndex: 1,
    explanation: 'Scurvy is caused by Vitamin C (ascorbic acid) deficiency.',
  },
  {
    id: 'ls-q6', subjectId: 'life-science',
    question: 'The functional unit of the kidney is the:',
    options: ['Nephron', 'Neuron', 'Alveolus', 'Villus'],
    correctIndex: 0,
    explanation: 'Each kidney contains about 1 million nephrons for filtration.',
  },
  {
    id: 'ls-q7', subjectId: 'life-science',
    question: 'Which blood group is called the "universal donor"?',
    options: ['A', 'B', 'AB', 'O'],
    correctIndex: 3,
    explanation: 'Blood group O can donate to all blood groups.',
  },
  {
    id: 'ls-q8', subjectId: 'life-science',
    question: 'The theory of evolution by natural selection was proposed by:',
    options: ['Lamarck', 'Mendel', 'Darwin', 'Watson'],
    correctIndex: 2,
    explanation: 'Charles Darwin published "On the Origin of Species" in 1859.',
  },

  // ── English ────────────────────────────────────────────────────────────────
  {
    id: 'eng-q1', subjectId: 'english',
    question: 'Who wrote "A Letter to God"?',
    options: ['G.L. Fuentes', 'Anne Frank', 'Nelson Mandela', 'Gavin Maxwell'],
    correctIndex: 0,
    explanation: '"A Letter to God" was written by G.L. Fuentes, a Mexican author.',
  },
  {
    id: 'eng-q2', subjectId: 'english',
    question: 'In "Nelson Mandela", what event is described?',
    options: ['A coronation ceremony', 'A cricket match', 'An inauguration as President', 'A trial hearing'],
    correctIndex: 2,
    explanation: 'The chapter describes Mandela\'s inauguration as the first Black President of South Africa.',
  },
  {
    id: 'eng-q3', subjectId: 'english',
    question: 'Mijbil was an otter belonging to:',
    options: ['Gavin Maxwell', 'Anne Frank', 'G.L. Fuentes', 'Wanda Petronski'],
    correctIndex: 0,
    explanation: 'Gavin Maxwell wrote about his pet otter Mijbil in "Mijbil the Otter".',
  },
  {
    id: 'eng-q4', subjectId: 'english',
    question: '"The Proposal" is a one-act ___ by Anton Chekhov.',
    options: ['Drama', 'Novel', 'Comedy', 'Tragedy'],
    correctIndex: 2,
    explanation: '"The Proposal" is a farcical comedy in one act by Anton Chekhov.',
  },
  {
    id: 'eng-q5', subjectId: 'english',
    question: 'In "Madam Rides the Bus", where does Valli live?',
    options: ['In the city', 'In a village', 'In a forest', 'In a school hostel'],
    correctIndex: 1,
    explanation: 'Valli is a young girl who lives in a small village.',
  },
  {
    id: 'eng-q6', subjectId: 'english',
    question: '"The Hundred Dresses" is set in:',
    options: ['France', 'England', 'America', 'Germany'],
    correctIndex: 2,
    explanation: 'Wanda Petronski is a Polish girl living in America.',
  },
  {
    id: 'eng-q7', subjectId: 'english',
    question: 'In "The Sermon at Benares", who is the main character?',
    options: ['Tansen', 'Gautama Buddha', 'Kabir', 'Mirabai'],
    correctIndex: 1,
    explanation: 'The chapter is based on the Buddha\'s first sermon at Benares (Varanasi).',
  },

  // ── History ────────────────────────────────────────────────────────────────
  {
    id: 'hist-q1', subjectId: 'history',
    question: 'The concept of "Lebensraum" (living space) was introduced by:',
    options: ['Britain', 'France', 'Germany', 'Italy'],
    correctIndex: 2,
    explanation: 'The Nazi ideology demanded "Lebensraum" for the German people.',
  },
  {
    id: 'hist-q2', subjectId: 'history',
    question: 'The Non-Cooperation Movement was launched in:',
    options: ['1915', '1919', '1921', '1930'],
    correctIndex: 2,
    explanation: 'Gandhi launched the Non-Cooperation Movement in 1921.',
  },
  {
    id: 'hist-q3', subjectId: 'history',
    question: 'The Rowlatt Act was passed in:',
    options: ['1917', '1919', '1921', '1915'],
    correctIndex: 1,
    explanation: 'The Rowlatt Act (1919) allowed detention without trial.',
  },
  {
    id: 'hist-q4', subjectId: 'history',
    question: 'Silk Routes primarily connected:',
    options: ['India and Africa', 'China and the Mediterranean', 'Europe and America', 'Japan and Australia'],
    correctIndex: 1,
    explanation: 'Silk Routes were ancient trade networks connecting China to the Mediterranean.',
  },
  {
    id: 'hist-q5', subjectId: 'history',
    question: 'The Berlin Wall fell in:',
    options: ['1985', '1987', '1989', '1991'],
    correctIndex: 2,
    explanation: 'The Berlin Wall fell on November 9, 1989.',
  },
  {
    id: 'hist-q6', subjectId: 'history',
    question: 'The Dandi March of 1930 was to protest against:',
    options: ['Salt Tax', 'Land Tax', 'Rowlatt Act', 'Partition'],
    correctIndex: 0,
    explanation: 'Gandhi led the Dandi March to break the British Salt Tax law.',
  },

  // ── Geography ──────────────────────────────────────────────────────────────
  {
    id: 'geog-q1', subjectId: 'geography',
    question: 'Which soil is most suitable for cotton cultivation?',
    options: ['Alluvial soil', 'Black soil', 'Red soil', 'Sandy soil'],
    correctIndex: 1,
    explanation: 'Black cotton soil (regur) has high moisture-retention capacity.',
  },
  {
    id: 'geog-q2', subjectId: 'geography',
    question: 'The longest river in India is:',
    options: ['Brahmaputra', 'Ganga', 'Yamuna', 'Godavari'],
    correctIndex: 1,
    explanation: 'The Ganga is the longest river in India, flowing ~2,525 km.',
  },
  {
    id: 'geog-q3', subjectId: 'geography',
    question: 'Which state is the largest producer of iron ore in India?',
    options: ['Gujarat', 'Odisha', 'Kerala', 'Assam'],
    correctIndex: 1,
    explanation: 'Odisha is the largest producer of iron ore in India.',
  },
  {
    id: 'geog-q4', subjectId: 'geography',
    question: 'The dominant climate type of India is:',
    options: ['Tropical Monsoon', 'Arid', 'Polar', 'Temperate Continental'],
    correctIndex: 0,
    explanation: 'India has a tropical monsoon climate heavily influenced by the monsoon winds.',
  },
  {
    id: 'geog-q5', subjectId: 'geography',
    question: 'Which state is the largest producer of wheat in India?',
    options: ['Punjab', 'Bihar', 'Uttar Pradesh', 'Haryana'],
    correctIndex: 0,
    explanation: 'Punjab is known as the "Granary of India" for wheat production.',
  },
  {
    id: 'geog-q6', subjectId: 'geography',
    question: 'Chilika Lake — the largest brackish water lagoon in India — is in:',
    options: ['Andhra Pradesh', 'Odisha', 'West Bengal', 'Kerala'],
    correctIndex: 1,
    explanation: 'Chilika Lake is on the east coast of Odisha.',
  },

  // ── Odia (Questions in Odia script) ───────────────────────────────────────
  {
    id: 'odia-q1', subjectId: 'odia',
    question: 'ଓଡ଼ିଆ ଭାଷାର ଆଦ୍ୟ କବି କିଏ?',
    options: ['ସାରଳା ଦାସ', 'ଜୟଦେବ', 'ଉପେନ୍ଦ୍ର ଭଞ୍ଜ', 'ଫକୀର ମୋହନ'],
    correctIndex: 0,
    explanation: 'ସାରଳା ଦାସ ଓଡ଼ିଆ ଭାଷାର ଆଦ୍ୟ କବି। ସେ ମହାଭାରତ ଓ ଅନ୍ୟ ଗ୍ରନ୍ଥ ରଚନା କରିଥିଲେ।',
  },
  {
    id: 'odia-q2', subjectId: 'odia',
    question: 'ଫକୀର ମୋହନ ସେନାପତିଙ୍କ ବିଖ୍ୟାତ ଉପନ୍ୟାସ ହେଉଛି:',
    options: ['ଛ ମାଣ ଆଠ ଗୁଣ୍ଠ', 'ଆମ ଓଡ଼ିଶା', 'ପ୍ରତ୍ୟାଗ୍ନି', 'ଦ୍ୱୀପ'],
    correctIndex: 0,
    explanation: '"ଛ ମାଣ ଆଠ ଗୁଣ୍ଠ" ଫକୀର ମୋହନ ସେନାପତିଙ୍କ ବିଖ୍ୟାତ ଓଡ଼ିଆ ଉପନ୍ୟାସ।',
  },
  {
    id: 'odia-q3', subjectId: 'odia',
    question: 'ଉତ୍କଳ ଗୌରବ ମଧୁସୂଦନ ଦାସ କେଉଁ ଜିଲ୍ଲାରେ ଜନ୍ମ ନେଇଥିଲେ?',
    options: ['ଭୁବନେଶ୍ୱର', 'ଜଗତ୍ ସିଂହପୁର', 'ପୁରୀ', 'କଟକ'],
    correctIndex: 1,
    explanation: 'ମଧୁସୂଦନ ଦାସ ଜଗତ୍ ସିଂହପୁର ଜିଲ୍ଲାର ସତ୍ୟଭାମାପୁରରେ ଜନ୍ମ ନେଇଥିଲେ।',
  },
  {
    id: 'odia-q4', subjectId: 'odia',
    question: 'ଓଡ଼ିଶାର ରାଜ୍ୟ ଭାଷା ହେଉଛି:',
    options: ['ହିନ୍ଦୀ', 'ଇଂରାଜୀ', 'ଓଡ଼ିଆ', 'ତେଲୁଗୁ'],
    correctIndex: 2,
    explanation: 'ଓଡ଼ିଆ ଓଡ଼ିଶାର ସରକାରୀ ଭାଷା ଏବଂ ଭାରତୀୟ ସଂବିଧାନର ୮ମ ଅନୁସୂଚୀରେ ଅଛି।',
  },
  {
    id: 'odia-q5', subjectId: 'odia',
    question: 'କବି ଉପେନ୍ଦ୍ର ଭଞ୍ଜ ରଚନା କରିଥିବା ଗ୍ରନ୍ଥ:',
    options: ['ଲାଵଣ୍ୟବତୀ', 'ଛ ମାଣ ଆଠ ଗୁଣ୍ଠ', 'ପ୍ରଳୟ ପଯ୍ୟୋଧ', 'ଚିଲିକା'],
    correctIndex: 0,
    explanation: '"ଲାଵଣ୍ୟବତୀ" ଉପେନ୍ଦ୍ର ଭଞ୍ଜ ରଚିତ ଏକ ବିଖ୍ୟାତ ଓଡ଼ିଆ ଖଣ୍ଡ କାଵ୍ୟ।',
  },

  // ── Hindi (Questions in Devanagari) ───────────────────────────────────────
  {
    id: 'hin-q1', subjectId: 'hindi',
    question: 'कबीर दास किस काल के कवि थे?',
    options: ['आदिकाल', 'भक्तिकाल', 'रीतिकाल', 'आधुनिक काल'],
    correctIndex: 1,
    explanation: 'कबीर दास भक्तिकाल (1375–1700 CE) के प्रमुख संत कवि थे।',
  },
  {
    id: 'hin-q2', subjectId: 'hindi',
    question: '"नेताजी का चश्मा" कहानी के लेखक हैं:',
    options: ['यशपाल', 'स्वयं प्रकाश', 'मन्नू भंडारी', 'रामवृक्ष बेनीपुरी'],
    correctIndex: 1,
    explanation: '"नेताजी का चश्मा" कहानी स्वयं प्रकाश द्वारा लिखी गई है।',
  },
  {
    id: 'hin-q3', subjectId: 'hindi',
    question: '"बालगोबिन भगत" पाठ में भगत के पुत्र की मृत्यु के बाद अंतिम संस्कार किसने किया?',
    options: ['पत्नी ने', 'पुत्रवधू ने', 'पड़ोसियों ने', 'भगत ने स्वयं'],
    correctIndex: 1,
    explanation: 'भगत ने अपनी पुत्रवधू से ही अपने पुत्र का अंतिम संस्कार कराया।',
  },
  {
    id: 'hin-q4', subjectId: 'hindi',
    question: '"लखनवी अंदाज़" कहानी में नवाब साहब किस ट्रेन में यात्रा कर रहे थे?',
    options: ['दिल्ली से लखनऊ', 'लखनऊ से दिल्ली', 'पटना से मुंबई', 'मुंबई से दिल्ली'],
    correctIndex: 1,
    explanation: 'नवाब साहब लखनऊ से दिल्ली जाने वाली ट्रेन में यात्रा कर रहे थे।',
  },
  {
    id: 'hin-q5', subjectId: 'hindi',
    question: 'सूरदास किस भाषा में कविता लिखते थे?',
    options: ['ब्रज भाषा', 'अवधी', 'खड़ी बोली', 'मैथिली'],
    correctIndex: 0,
    explanation: 'सूरदास ब्रज भाषा में भक्ति गीत लिखते थे।',
  },

  // ── Vocational IT ──────────────────────────────────────────────────────────
  {
    id: 'vit-q1', subjectId: 'voc-it',
    question: 'CPU stands for:',
    options: ['Central Processing Unit', 'Computer Power Unit', 'Central Power Unit', 'Computer Processing Unit'],
    correctIndex: 0,
    explanation: 'CPU = Central Processing Unit — the brain of the computer.',
  },
  {
    id: 'vit-q2', subjectId: 'voc-it',
    question: 'The shortcut key to Save a file is:',
    options: ['Ctrl+C', 'Ctrl+V', 'Ctrl+S', 'Ctrl+Z'],
    correctIndex: 2,
    explanation: 'Ctrl+S saves the current document in most applications.',
  },
  {
    id: 'vit-q3', subjectId: 'voc-it',
    question: 'WWW stands for:',
    options: ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'],
    correctIndex: 0,
    explanation: 'WWW = World Wide Web — the system of interlinked hypertext documents.',
  },
  {
    id: 'vit-q4', subjectId: 'voc-it',
    question: 'Which file extension is used for spreadsheets in LibreOffice?',
    options: ['.docx', '.ods', '.pptx', '.pdf'],
    correctIndex: 1,
    explanation: 'LibreOffice Calc uses .ods (Open Document Spreadsheet) format.',
  },
  {
    id: 'vit-q5', subjectId: 'voc-it',
    question: 'A database is primarily used to:',
    options: ['Browse the internet', 'Store and manage structured data', 'Create presentations', 'Edit images'],
    correctIndex: 1,
    explanation: 'Databases store, organise, and retrieve structured data efficiently.',
  },

  // ── Vocational Retail ──────────────────────────────────────────────────────
  {
    id: 'vrt-q1', subjectId: 'voc-retail',
    question: 'CRM stands for:',
    options: ['Customer Retail Management', 'Customer Relationship Management', 'Corporate Revenue Management', 'Consumer Retail Mode'],
    correctIndex: 1,
    explanation: 'CRM = Customer Relationship Management — managing interactions with customers.',
  },
  {
    id: 'vrt-q2', subjectId: 'voc-retail',
    question: 'Visual Merchandising means:',
    options: ['Online advertising', 'Designing store layouts and product displays', 'Managing inventory software', 'Training salespeople'],
    correctIndex: 1,
    explanation: 'Visual merchandising arranges products and displays to attract customers.',
  },

  // ── Vocational Automobile ─────────────────────────────────────────────────
  {
    id: 'vau-q1', subjectId: 'voc-auto',
    question: 'The main function of an engine is to:',
    options: ['Store fuel', 'Convert fuel energy into mechanical energy', 'Cool the vehicle', 'Transmit power to wheels'],
    correctIndex: 1,
    explanation: 'An internal combustion engine converts chemical energy (fuel) to mechanical energy.',
  },
  {
    id: 'vau-q2', subjectId: 'voc-auto',
    question: 'ABS in vehicles stands for:',
    options: ['Automatic Braking System', 'Anti-lock Braking System', 'Advanced Brake Signal', 'Auto Brake Sensor'],
    correctIndex: 1,
    explanation: 'ABS = Anti-lock Braking System — prevents wheels from locking during hard braking.',
  },

  // ── Vocational Tourism ─────────────────────────────────────────────────────
  {
    id: 'vtr-q1', subjectId: 'voc-tourism',
    question: 'What does "Front Office" in a hotel primarily handle?',
    options: ['Food preparation', 'Housekeeping', 'Guest check-in/out and reservations', 'Accounting'],
    correctIndex: 2,
    explanation: 'The Front Office is the guest-facing department handling check-in, check-out, and reservations.',
  },
  {
    id: 'vtr-q2', subjectId: 'voc-tourism',
    question: 'Ecotourism focuses on:',
    options: ['Luxury travel', 'Adventure sports', 'Responsible travel to natural areas', 'Medical tourism'],
    correctIndex: 2,
    explanation: 'Ecotourism promotes conservation and sustainable travel to natural environments.',
  },
];

// ── Remote fetch with caching ─────────────────────────────────────────────────
type CachedBank = {
  timestamp: number;
  questions: QuizQuestion[];
};

/**
 * Attempts to fetch the latest question bank from Google Drive.
 * Falls back to the local bank on any error or if the cache is fresh.
 * Questions are cached for 24 hours to reduce Drive traffic.
 */
export async function fetchQuizQuestions(subjectId: string): Promise<QuizQuestion[]> {
  // Always return local questions for the requested subject
  // (Drive fetch enriches the full bank; for now always use local)
  const localQuestions = LOCAL_QUIZ_BANK.filter((q) => q.subjectId === subjectId);

  // Try Drive refresh in background (fire-and-forget for first load)
  _tryRefreshFromDrive().catch(() => {});

  // Return local if nothing from Drive yet
  try {
    const raw = await AsyncStorage.getItem(QUIZ_CACHE_KEY);
    if (raw) {
      const cached: CachedBank = JSON.parse(raw);
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_TTL_MS && cached.questions.length > 0) {
        const remote = cached.questions.filter((q) => q.subjectId === subjectId);
        if (remote.length > 0) return remote;
      }
    }
  } catch {
    // ignore cache errors
  }

  return localQuestions.length > 0 ? localQuestions : LOCAL_QUIZ_BANK.slice(0, 5);
}

async function _tryRefreshFromDrive(): Promise<void> {
  // Skip if URL is still the placeholder
  if (QUIZ_DRIVE_JSON_URL.includes('REPLACE_WITH')) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(QUIZ_DRIVE_JSON_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data?.questions)) return;

    // Validate each question shape before trusting remote data
    const valid: QuizQuestion[] = data.questions.filter(
      (q: any) =>
        typeof q.id === 'string' &&
        typeof q.subjectId === 'string' &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every((o: any) => typeof o === 'string') &&
        typeof q.correctIndex === 'number' &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 3,
    );
    if (valid.length === 0) return;

    const cached: CachedBank = { timestamp: Date.now(), questions: valid };
    await AsyncStorage.setItem(QUIZ_CACHE_KEY, JSON.stringify(cached));
  } catch {
    // silently ignore — local bank is always available
  }
}

/** Returns all subjects that have at least one question in the local bank */
export function getQuizSubjectIds(): string[] {
  return [...new Set(LOCAL_QUIZ_BANK.map((q) => q.subjectId))];
}

/**
 * Fetches questions scoped to a specific chapter.
 * If chapter-specific questions exist, only those are returned.
 * Otherwise falls back to the full subject-level bank (existing behaviour),
 * so every chapter's MCQ/Gaming folder always has something to practice.
 */
export async function fetchQuizQuestionsForChapter(
  chapterId: string,
  subjectId: string,
): Promise<QuizQuestion[]> {
  const subjectQuestions = await fetchQuizQuestions(subjectId);
  const chapterQuestions = subjectQuestions.filter((q) => q.chapterId === chapterId);
  return chapterQuestions.length > 0 ? chapterQuestions : subjectQuestions;
}

/** Returns true if a chapter has at least one chapter-specific question authored. */
export function hasChapterQuestions(chapterId: string): boolean {
  return LOCAL_QUIZ_BANK.some((q) => q.chapterId === chapterId);
}
