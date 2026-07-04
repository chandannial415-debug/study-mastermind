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

export const CATEGORIES: Category[] = [
  {
    id: 'regular',
    name: 'Regular Courses',
    subtitle: 'Core subjects for Matric Class 10',
    iconName: 'school-outline',
    color: '#1565C0',
    lightBg: '#E3F2FD',
  },
  {
    id: 'third-language',
    name: 'Third Language',
    subtitle: 'Language electives & literature',
    iconName: 'language-outline',
    color: '#6A1B9A',
    lightBg: '#F3E5F5',
  },
  {
    id: 'vocational',
    name: 'Vocational Courses',
    subtitle: 'Class 10 Only — Skill-based learning',
    iconName: 'construct-outline',
    color: '#E65100',
    lightBg: '#FBE9E7',
  },
];

export const SUBJECTS: Subject[] = [
  // Regular Courses
  {
    id: 'eng',
    name: 'English (First Language)',
    iconName: 'book-outline',
    categoryId: 'regular',
    totalChapters: 10,
  },
  {
    id: 'math',
    name: 'Mathematics',
    iconName: 'calculator-outline',
    categoryId: 'regular',
    totalChapters: 15,
  },
  {
    id: 'sci',
    name: 'Science',
    iconName: 'flask-outline',
    categoryId: 'regular',
    totalChapters: 16,
  },
  {
    id: 'sst',
    name: 'Social Science',
    iconName: 'earth-outline',
    categoryId: 'regular',
    totalChapters: 18,
  },
  {
    id: 'hin',
    name: 'Hindi (Second Language)',
    iconName: 'text-outline',
    categoryId: 'regular',
    totalChapters: 8,
  },
  {
    id: 'mar',
    name: 'Marathi',
    iconName: 'text-outline',
    categoryId: 'regular',
    totalChapters: 8,
  },

  // Third Language
  {
    id: 'san',
    name: 'Sanskrit',
    iconName: 'library-outline',
    categoryId: 'third-language',
    totalChapters: 10,
  },
  {
    id: 'kan',
    name: 'Kannada',
    iconName: 'library-outline',
    categoryId: 'third-language',
    totalChapters: 8,
  },
  {
    id: 'tam',
    name: 'Tamil',
    iconName: 'library-outline',
    categoryId: 'third-language',
    totalChapters: 8,
  },
  {
    id: 'tel',
    name: 'Telugu',
    iconName: 'library-outline',
    categoryId: 'third-language',
    totalChapters: 8,
  },
  {
    id: 'urd',
    name: 'Urdu',
    iconName: 'library-outline',
    categoryId: 'third-language',
    totalChapters: 9,
  },
  {
    id: 'guj',
    name: 'Gujarati',
    iconName: 'library-outline',
    categoryId: 'third-language',
    totalChapters: 7,
  },

  // Vocational Courses
  {
    id: 'it',
    name: 'Information Technology',
    iconName: 'desktop-outline',
    categoryId: 'vocational',
    totalChapters: 12,
  },
  {
    id: 'agr',
    name: 'Agriculture',
    iconName: 'leaf-outline',
    categoryId: 'vocational',
    totalChapters: 10,
  },
  {
    id: 'hc',
    name: 'Health Care',
    iconName: 'medkit-outline',
    categoryId: 'vocational',
    totalChapters: 11,
  },
  {
    id: 'biz',
    name: 'Business Studies',
    iconName: 'briefcase-outline',
    categoryId: 'vocational',
    totalChapters: 9,
  },
];

export const CHAPTERS: Record<string, Chapter[]> = {
  eng: [
    { id: 'eng-1', name: 'Chapter 1: A Letter to God', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch1.pdf' },
    { id: 'eng-2', name: 'Chapter 2: Nelson Mandela – Long Walk to Freedom', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch2.pdf' },
    { id: 'eng-3', name: 'Chapter 3: Two Stories About Flying', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch3.pdf' },
    { id: 'eng-4', name: 'Chapter 4: From the Diary of Anne Frank', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch4.pdf' },
    { id: 'eng-5', name: 'Chapter 5: Glimpses of India', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch5.pdf' },
    { id: 'eng-6', name: 'Chapter 6: Mijbil the Otter', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch6.pdf' },
    { id: 'eng-7', name: 'Chapter 7: Madam Rides the Bus', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch7.pdf' },
    { id: 'eng-8', name: 'Chapter 8: The Sermon at Benares', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch8.pdf' },
    { id: 'eng-9', name: 'Chapter 9: The Proposal (Prose)', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch9.pdf' },
    { id: 'eng-10', name: 'Chapter 10: Grammar & Writing Skills', subjectId: 'eng', pdfUrl: 'placeholder://eng-ch10.pdf' },
  ],
  math: [
    { id: 'math-1', name: 'Chapter 1: Real Numbers', subjectId: 'math', pdfUrl: 'placeholder://math-ch1.pdf' },
    { id: 'math-2', name: 'Chapter 2: Polynomials', subjectId: 'math', pdfUrl: 'placeholder://math-ch2.pdf' },
    { id: 'math-3', name: 'Chapter 3: Pair of Linear Equations in Two Variables', subjectId: 'math', pdfUrl: 'placeholder://math-ch3.pdf' },
    { id: 'math-4', name: 'Chapter 4: Quadratic Equations', subjectId: 'math', pdfUrl: 'placeholder://math-ch4.pdf' },
    { id: 'math-5', name: 'Chapter 5: Arithmetic Progressions', subjectId: 'math', pdfUrl: 'placeholder://math-ch5.pdf' },
    { id: 'math-6', name: 'Chapter 6: Triangles', subjectId: 'math', pdfUrl: 'placeholder://math-ch6.pdf' },
    { id: 'math-7', name: 'Chapter 7: Coordinate Geometry', subjectId: 'math', pdfUrl: 'placeholder://math-ch7.pdf' },
    { id: 'math-8', name: 'Chapter 8: Introduction to Trigonometry', subjectId: 'math', pdfUrl: 'placeholder://math-ch8.pdf' },
    { id: 'math-9', name: 'Chapter 9: Some Applications of Trigonometry', subjectId: 'math', pdfUrl: 'placeholder://math-ch9.pdf' },
    { id: 'math-10', name: 'Chapter 10: Circles', subjectId: 'math', pdfUrl: 'placeholder://math-ch10.pdf' },
    { id: 'math-11', name: 'Chapter 11: Areas Related to Circles', subjectId: 'math', pdfUrl: 'placeholder://math-ch11.pdf' },
    { id: 'math-12', name: 'Chapter 12: Surface Areas and Volumes', subjectId: 'math', pdfUrl: 'placeholder://math-ch12.pdf' },
    { id: 'math-13', name: 'Chapter 13: Statistics', subjectId: 'math', pdfUrl: 'placeholder://math-ch13.pdf' },
    { id: 'math-14', name: 'Chapter 14: Probability', subjectId: 'math', pdfUrl: 'placeholder://math-ch14.pdf' },
    { id: 'math-15', name: 'Chapter 15: Constructions', subjectId: 'math', pdfUrl: 'placeholder://math-ch15.pdf' },
  ],
  sci: [
    { id: 'sci-1', name: 'Chapter 1: Chemical Reactions and Equations', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch1.pdf' },
    { id: 'sci-2', name: 'Chapter 2: Acids, Bases and Salts', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch2.pdf' },
    { id: 'sci-3', name: 'Chapter 3: Metals and Non-metals', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch3.pdf' },
    { id: 'sci-4', name: 'Chapter 4: Carbon and its Compounds', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch4.pdf' },
    { id: 'sci-5', name: 'Chapter 5: Life Processes', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch5.pdf' },
    { id: 'sci-6', name: 'Chapter 6: Control and Coordination', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch6.pdf' },
    { id: 'sci-7', name: 'Chapter 7: How do Organisms Reproduce?', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch7.pdf' },
    { id: 'sci-8', name: 'Chapter 8: Heredity and Evolution', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch8.pdf' },
    { id: 'sci-9', name: 'Chapter 9: Light – Reflection and Refraction', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch9.pdf' },
    { id: 'sci-10', name: 'Chapter 10: The Human Eye and Colourful World', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch10.pdf' },
    { id: 'sci-11', name: 'Chapter 11: Electricity', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch11.pdf' },
    { id: 'sci-12', name: 'Chapter 12: Magnetic Effects of Electric Current', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch12.pdf' },
    { id: 'sci-13', name: 'Chapter 13: Our Environment', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch13.pdf' },
    { id: 'sci-14', name: 'Chapter 14: Management of Natural Resources', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch14.pdf' },
    { id: 'sci-15', name: 'Chapter 15: Sources of Energy', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch15.pdf' },
    { id: 'sci-16', name: 'Chapter 16: Periodic Classification of Elements', subjectId: 'sci', pdfUrl: 'placeholder://sci-ch16.pdf' },
  ],
  sst: [
    { id: 'sst-1', name: 'Chapter 1: The Rise of Nationalism in Europe', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch1.pdf' },
    { id: 'sst-2', name: 'Chapter 2: Nationalism in India', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch2.pdf' },
    { id: 'sst-3', name: 'Chapter 3: The Making of a Global World', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch3.pdf' },
    { id: 'sst-4', name: 'Chapter 4: The Age of Industrialisation', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch4.pdf' },
    { id: 'sst-5', name: 'Chapter 5: Print Culture and the Modern World', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch5.pdf' },
    { id: 'sst-6', name: 'Chapter 6: Resources and Development', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch6.pdf' },
    { id: 'sst-7', name: 'Chapter 7: Forest and Wildlife Resources', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch7.pdf' },
    { id: 'sst-8', name: 'Chapter 8: Water Resources', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch8.pdf' },
    { id: 'sst-9', name: 'Chapter 9: Agriculture', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch9.pdf' },
    { id: 'sst-10', name: 'Chapter 10: Minerals and Energy Resources', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch10.pdf' },
    { id: 'sst-11', name: 'Chapter 11: Manufacturing Industries', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch11.pdf' },
    { id: 'sst-12', name: 'Chapter 12: Lifelines of National Economy', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch12.pdf' },
    { id: 'sst-13', name: 'Chapter 13: Power Sharing', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch13.pdf' },
    { id: 'sst-14', name: 'Chapter 14: Federalism', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch14.pdf' },
    { id: 'sst-15', name: 'Chapter 15: Democracy and Diversity', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch15.pdf' },
    { id: 'sst-16', name: 'Chapter 16: Gender, Religion and Caste', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch16.pdf' },
    { id: 'sst-17', name: 'Chapter 17: Development & Economic Growth', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch17.pdf' },
    { id: 'sst-18', name: 'Chapter 18: Money and Credit', subjectId: 'sst', pdfUrl: 'placeholder://sst-ch18.pdf' },
  ],
  hin: [
    { id: 'hin-1', name: 'Chapter 1: Surdas – Pad', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch1.pdf' },
    { id: 'hin-2', name: 'Chapter 2: Ram Lakshman Parshuram Samvad', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch2.pdf' },
    { id: 'hin-3', name: 'Chapter 3: Dev – Saviya', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch3.pdf' },
    { id: 'hin-4', name: 'Chapter 4: Jaishankar Prasad – Atm Traan', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch4.pdf' },
    { id: 'hin-5', name: 'Chapter 5: Sumitranandan Pant – Yeh Duniya', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch5.pdf' },
    { id: 'hin-6', name: 'Chapter 6: Netaji ka Chasma', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch6.pdf' },
    { id: 'hin-7', name: 'Chapter 7: Balgobin Bhagat', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch7.pdf' },
    { id: 'hin-8', name: 'Chapter 8: Lakhnawi Andaaz', subjectId: 'hin', pdfUrl: 'placeholder://hin-ch8.pdf' },
  ],
  mar: [
    { id: 'mar-1', name: 'Chapter 1: Parishram Dev Aahe', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch1.pdf' },
    { id: 'mar-2', name: 'Chapter 2: Aai', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch2.pdf' },
    { id: 'mar-3', name: 'Chapter 3: Mazha Desh', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch3.pdf' },
    { id: 'mar-4', name: 'Chapter 4: Shivaji Maharaj', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch4.pdf' },
    { id: 'mar-5', name: 'Chapter 5: Swatantrya Veer Savarkar', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch5.pdf' },
    { id: 'mar-6', name: 'Chapter 6: Shet Maza Shet', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch6.pdf' },
    { id: 'mar-7', name: 'Chapter 7: Kavita', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch7.pdf' },
    { id: 'mar-8', name: 'Chapter 8: Vyakaran ani Lekhan', subjectId: 'mar', pdfUrl: 'placeholder://mar-ch8.pdf' },
  ],
  san: [
    { id: 'san-1', name: 'Chapter 1: Shloka Parichay', subjectId: 'san', pdfUrl: 'placeholder://san-ch1.pdf' },
    { id: 'san-2', name: 'Chapter 2: Dhatu Roop', subjectId: 'san', pdfUrl: 'placeholder://san-ch2.pdf' },
    { id: 'san-3', name: 'Chapter 3: Shabda Roop', subjectId: 'san', pdfUrl: 'placeholder://san-ch3.pdf' },
    { id: 'san-4', name: 'Chapter 4: Subhashitani', subjectId: 'san', pdfUrl: 'placeholder://san-ch4.pdf' },
    { id: 'san-5', name: 'Chapter 5: Katha Mangalam', subjectId: 'san', pdfUrl: 'placeholder://san-ch5.pdf' },
    { id: 'san-6', name: 'Chapter 6: Vyakaran', subjectId: 'san', pdfUrl: 'placeholder://san-ch6.pdf' },
    { id: 'san-7', name: 'Chapter 7: Anuwaad', subjectId: 'san', pdfUrl: 'placeholder://san-ch7.pdf' },
    { id: 'san-8', name: 'Chapter 8: Nibandh Lekhan', subjectId: 'san', pdfUrl: 'placeholder://san-ch8.pdf' },
    { id: 'san-9', name: 'Chapter 9: Patra Lekhan', subjectId: 'san', pdfUrl: 'placeholder://san-ch9.pdf' },
    { id: 'san-10', name: 'Chapter 10: Avyaya aur Sandhi', subjectId: 'san', pdfUrl: 'placeholder://san-ch10.pdf' },
  ],
  kan: [
    { id: 'kan-1', name: 'Chapter 1: Baaligondu Haadu', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch1.pdf' },
    { id: 'kan-2', name: 'Chapter 2: Prabhuthva', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch2.pdf' },
    { id: 'kan-3', name: 'Chapter 3: Namma Nadu Namma Jeevan', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch3.pdf' },
    { id: 'kan-4', name: 'Chapter 4: Kaliyuga', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch4.pdf' },
    { id: 'kan-5', name: 'Chapter 5: Gadegalu', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch5.pdf' },
    { id: 'kan-6', name: 'Chapter 6: Vyakaran', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch6.pdf' },
    { id: 'kan-7', name: 'Chapter 7: Sahitya Parichaya', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch7.pdf' },
    { id: 'kan-8', name: 'Chapter 8: Lekhan Kaushalya', subjectId: 'kan', pdfUrl: 'placeholder://kan-ch8.pdf' },
  ],
  tam: [
    { id: 'tam-1', name: 'Chapter 1: Thirukkural', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch1.pdf' },
    { id: 'tam-2', name: 'Chapter 2: Kavithaikal', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch2.pdf' },
    { id: 'tam-3', name: 'Chapter 3: Natai Nool', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch3.pdf' },
    { id: 'tam-4', name: 'Chapter 4: Paadal Thirattu', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch4.pdf' },
    { id: 'tam-5', name: 'Chapter 5: Ilakkana', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch5.pdf' },
    { id: 'tam-6', name: 'Chapter 6: Uraravu Paechu', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch6.pdf' },
    { id: 'tam-7', name: 'Chapter 7: Seithimalar', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch7.pdf' },
    { id: 'tam-8', name: 'Chapter 8: Kaditham Eluthudhal', subjectId: 'tam', pdfUrl: 'placeholder://tam-ch8.pdf' },
  ],
  tel: [
    { id: 'tel-1', name: 'Chapter 1: Padyalu', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch1.pdf' },
    { id: 'tel-2', name: 'Chapter 2: Gadyalu', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch2.pdf' },
    { id: 'tel-3', name: 'Chapter 3: Vyakaranam', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch3.pdf' },
    { id: 'tel-4', name: 'Chapter 4: Sandhulu', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch4.pdf' },
    { id: 'tel-5', name: 'Chapter 5: Samasyalu', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch5.pdf' },
    { id: 'tel-6', name: 'Chapter 6: Prabandham', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch6.pdf' },
    { id: 'tel-7', name: 'Chapter 7: Pathyam', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch7.pdf' },
    { id: 'tel-8', name: 'Chapter 8: Rachana', subjectId: 'tel', pdfUrl: 'placeholder://tel-ch8.pdf' },
  ],
  urd: [
    { id: 'urd-1', name: 'Chapter 1: Ghazalen', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch1.pdf' },
    { id: 'urd-2', name: 'Chapter 2: Nazmein', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch2.pdf' },
    { id: 'urd-3', name: 'Chapter 3: Afsane', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch3.pdf' },
    { id: 'urd-4', name: 'Chapter 4: Mazameen', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch4.pdf' },
    { id: 'urd-5', name: 'Chapter 5: Qawaid', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch5.pdf' },
    { id: 'urd-6', name: 'Chapter 6: Imlaa Aur Inshaa', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch6.pdf' },
    { id: 'urd-7', name: 'Chapter 7: Tahreer', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch7.pdf' },
    { id: 'urd-8', name: 'Chapter 8: Khutoot Nawisi', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch8.pdf' },
    { id: 'urd-9', name: 'Chapter 9: Adab Aur Taqreer', subjectId: 'urd', pdfUrl: 'placeholder://urd-ch9.pdf' },
  ],
  guj: [
    { id: 'guj-1', name: 'Chapter 1: Kavita', subjectId: 'guj', pdfUrl: 'placeholder://guj-ch1.pdf' },
    { id: 'guj-2', name: 'Chapter 2: Gadya', subjectId: 'guj', pdfUrl: 'placeholder://guj-ch2.pdf' },
    { id: 'guj-3', name: 'Chapter 3: Vyakaran', subjectId: 'guj', pdfUrl: 'placeholder://guj-ch3.pdf' },
    { id: 'guj-4', name: 'Chapter 4: Nibandha', subjectId: 'guj', pdfUrl: 'placeholder://guj-ch4.pdf' },
    { id: 'guj-5', name: 'Chapter 5: Patra Lekhan', subjectId: 'guj', pdfUrl: 'placeholder://guj-ch5.pdf' },
    { id: 'guj-6', name: 'Chapter 6: Avachedan Bodh', subjectId: 'guj', pdfUrl: 'placeholder://guj-ch6.pdf' },
    { id: 'guj-7', name: 'Chapter 7: Natak', subjectId: 'guj', pdfUrl: 'placeholder://guj-ch7.pdf' },
  ],
  it: [
    { id: 'it-1', name: 'Unit 1: Fundamentals of Computing', subjectId: 'it', pdfUrl: 'placeholder://it-ch1.pdf' },
    { id: 'it-2', name: 'Unit 2: Computer Hardware', subjectId: 'it', pdfUrl: 'placeholder://it-ch2.pdf' },
    { id: 'it-3', name: 'Unit 3: Operating Systems', subjectId: 'it', pdfUrl: 'placeholder://it-ch3.pdf' },
    { id: 'it-4', name: 'Unit 4: Word Processing (MS Word)', subjectId: 'it', pdfUrl: 'placeholder://it-ch4.pdf' },
    { id: 'it-5', name: 'Unit 5: Spreadsheets (MS Excel)', subjectId: 'it', pdfUrl: 'placeholder://it-ch5.pdf' },
    { id: 'it-6', name: 'Unit 6: Presentations (PowerPoint)', subjectId: 'it', pdfUrl: 'placeholder://it-ch6.pdf' },
    { id: 'it-7', name: 'Unit 7: Internet & E-mail Basics', subjectId: 'it', pdfUrl: 'placeholder://it-ch7.pdf' },
    { id: 'it-8', name: 'Unit 8: Digital Literacy & Cyber Safety', subjectId: 'it', pdfUrl: 'placeholder://it-ch8.pdf' },
    { id: 'it-9', name: 'Unit 9: HTML Basics', subjectId: 'it', pdfUrl: 'placeholder://it-ch9.pdf' },
    { id: 'it-10', name: 'Unit 10: Introduction to Programming', subjectId: 'it', pdfUrl: 'placeholder://it-ch10.pdf' },
    { id: 'it-11', name: 'Unit 11: Database Concepts', subjectId: 'it', pdfUrl: 'placeholder://it-ch11.pdf' },
    { id: 'it-12', name: 'Unit 12: Practical & Project Work', subjectId: 'it', pdfUrl: 'placeholder://it-ch12.pdf' },
  ],
  agr: [
    { id: 'agr-1', name: 'Unit 1: Introduction to Agriculture', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch1.pdf' },
    { id: 'agr-2', name: 'Unit 2: Soil Health & Management', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch2.pdf' },
    { id: 'agr-3', name: 'Unit 3: Crop Production', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch3.pdf' },
    { id: 'agr-4', name: 'Unit 4: Irrigation Methods', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch4.pdf' },
    { id: 'agr-5', name: 'Unit 5: Fertilisers & Manures', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch5.pdf' },
    { id: 'agr-6', name: 'Unit 6: Plant Protection', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch6.pdf' },
    { id: 'agr-7', name: 'Unit 7: Animal Husbandry', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch7.pdf' },
    { id: 'agr-8', name: 'Unit 8: Horticulture Basics', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch8.pdf' },
    { id: 'agr-9', name: 'Unit 9: Farm Machinery', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch9.pdf' },
    { id: 'agr-10', name: 'Unit 10: Practical & Field Work', subjectId: 'agr', pdfUrl: 'placeholder://agr-ch10.pdf' },
  ],
  hc: [
    { id: 'hc-1', name: 'Unit 1: Introduction to Health Care', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch1.pdf' },
    { id: 'hc-2', name: 'Unit 2: Human Body Systems', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch2.pdf' },
    { id: 'hc-3', name: 'Unit 3: Nutrition and Diet', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch3.pdf' },
    { id: 'hc-4', name: 'Unit 4: First Aid & Emergency Care', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch4.pdf' },
    { id: 'hc-5', name: 'Unit 5: Common Diseases & Prevention', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch5.pdf' },
    { id: 'hc-6', name: 'Unit 6: Community Health & Hygiene', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch6.pdf' },
    { id: 'hc-7', name: 'Unit 7: Mental Health Awareness', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch7.pdf' },
    { id: 'hc-8', name: 'Unit 8: Medical Terminology', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch8.pdf' },
    { id: 'hc-9', name: 'Unit 9: Health Care Careers', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch9.pdf' },
    { id: 'hc-10', name: 'Unit 10: Practical & Lab Work', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch10.pdf' },
    { id: 'hc-11', name: 'Unit 11: Project & Case Studies', subjectId: 'hc', pdfUrl: 'placeholder://hc-ch11.pdf' },
  ],
  biz: [
    { id: 'biz-1', name: 'Unit 1: Nature and Purpose of Business', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch1.pdf' },
    { id: 'biz-2', name: 'Unit 2: Forms of Business Organisation', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch2.pdf' },
    { id: 'biz-3', name: 'Unit 3: Public Sector and Private Sector', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch3.pdf' },
    { id: 'biz-4', name: 'Unit 4: Business Services', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch4.pdf' },
    { id: 'biz-5', name: 'Unit 5: Emerging Modes of Business', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch5.pdf' },
    { id: 'biz-6', name: 'Unit 6: Social Responsibility of Business', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch6.pdf' },
    { id: 'biz-7', name: 'Unit 7: Formation of a Company', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch7.pdf' },
    { id: 'biz-8', name: 'Unit 8: Sources of Business Finance', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch8.pdf' },
    { id: 'biz-9', name: 'Unit 9: Small Business & Entrepreneurship', subjectId: 'biz', pdfUrl: 'placeholder://biz-ch9.pdf' },
  ],
};

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
