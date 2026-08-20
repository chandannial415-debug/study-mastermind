import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '@/src/data/supabase'; // पक्का कर लें कि ये रास्ता सही है

export default function NotesScreen({ route }: any) {
  const { chapterId, chapterName, subjectName } = route.params;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('subject', subjectName)
        .eq('chapter_name', chapterName)
        .eq('file_type', 'Small Notebook')
        .single();

      if (error) {
        console.log("Supabase Error:", error.message);
      } else {
        setNote(data);
      }
      setLoading(false);
    }
    fetchNotes();
  }, [chapterId, chapterName, subjectName]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {note && note.points ? (
        JSON.parse(note.points).map((point: string, index: number) => (
          <Text key={index} style={{ fontSize: 18, marginBottom: 10 }}>
            • {point}
          </Text>
        ))
      ) : (
        <Text>Notes Coming Soon</Text>
      )}
    </ScrollView>
  );
}
