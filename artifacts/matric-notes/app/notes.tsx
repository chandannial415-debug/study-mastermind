import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAppRouter } from '@/src/navigation';
import { supabase } from '@/src/data/supabase';

export default function NotesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const nav    = useAppRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { chapterId, chapterName, subjectName } = useLocalSearchParams<{
    chapterId:   string;
    chapterName: string;
    subjectName: string;
  }>();

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('content') // सुनिश्चित करें कि आपके टेबल में 'content' नाम का कॉलम है
        .eq('subject_name', subjectName)
        .eq('chapter_name', chapterName)
        .eq('file_type', 'Small Notebook')
        .single();

      if (data) {
        setNote(data);
      }
      setLoading(false);
    }
    fetchNotes();
  }, [chapterId, chapterName, subjectName]);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerSuper} numberOfLines={1}>{subjectName}</Text>
            <Text style={styles.headerTitle} numberOfLines={2}>{chapterName}</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Ionicons name="reader-outline" size={13} color="#FFFFFF" />
          <Text style={styles.badgeText}>Small Notebook</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 50 }} />
        ) : note ? (
          <View style={[styles.notebook, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.notebookMargin} />
            <View style={styles.notebookContent}>
              {note.content?.map((point: string, i: number) => (
                <View key={i} style={styles.pointRow}>
                  <View style={styles.bullet} />
                  <Text style={[styles.pointText, { color: colors.cardForeground }]}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="reader-outline" size={40} color="#6A1B9A" />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Notes Coming Soon</Text>
            <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
              Short revision notes for this chapter are being prepared.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#6A1B9A', paddingHorizontal: 18, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  headerTextWrap: { flex: 1 },
  headerSuper: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.65)', marginBottom: 3 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF', lineHeight: 24 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  badgeText: { fontSize: 11.5, fontFamily: 'Inter_500Medium', color: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  notebook: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  notebookMargin: { width: 10, backgroundColor: '#EF9A9A' },
  notebookContent: { flex: 1, padding: 18, gap: 14 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6A1B9A', marginTop: 6 },
  pointText: { flex: 1, fontSize: 14.5, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  emptyBox: { alignItems: 'center', gap: 10, padding: 32, borderRadius: 16, borderWidth: 1, marginTop: 20 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  emptyBody: { fontSize: 13.5, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
});
