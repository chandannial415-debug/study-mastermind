import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { supabase } from '@/src/data/supabase';

export default function NotesScreen({ route }: any) {
  const { chapterName, subjectName } = route.params;
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStorageFiles() {
      setLoading(true);
      
      // Supabase Storage की 'mcqs' बकेट से फोल्डर/फाइल्स की लिस्ट मंगा रहे हैं
      const folderPath = `${subjectName.toLowerCase()}/${chapterName.toLowerCase()}`;
      
      const { data, error } = await supabase.storage
        .from('mcqs')
        .list(folderPath, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) {
        console.log("Storage Error:", error.message);
      } else {
        setFiles(data || []);
      }
      setLoading(false);
    }

    fetchStorageFiles();
  }, [chapterName, subjectName]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {files.length > 0 ? (
        files.map((file, index) => (
          <View key={index} style={{ padding: 15, marginBottom: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{file.name}</Text>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No PDF files found in this folder!</Text>
      )}
    </ScrollView>
  );
}
