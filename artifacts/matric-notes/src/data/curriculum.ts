// 1. Supabase का कनेक्शन इम्पोर्ट करें
import { supabase } from './supabase'; 

export type Chapter = {
  id: number;
  title: string;
  subject: string;
  pdf_url: string;
  is_premium: boolean;
};

// 2. Supabase से डेटा लाने वाला नया फंक्शन
export async function getChaptersBySubject(subjectName: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('subject', subjectName); 

  if (error) {
    console.error("Supabase से डेटा लाने में गलती हुई:", error);
    return []; // अगर कोई गलती हो, तो खाली लिस्ट भेजें
  }

  return data as Chapter[];
}
