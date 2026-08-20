// 2. Supabase से डेटा लाने वाला अपडेटेड फंक्शन
export async function getChaptersBySubject(
  subjectName: string, 
  chapterName: string, 
  fileType: string
): Promise<Chapter[]> {
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('subject', subjectName)      // विषय
    .eq('chapter_name', chapterName) // नया कॉलम: चैप्टर का नाम
    .eq('file_type', fileType);      // नया कॉलम: 'Small Notebook' या जो भी है

  if (error) {
    console.error("Supabase से डेटा लाने में गलती हुई:", error);
    return []; 
  }

  return data as Chapter[];
}
