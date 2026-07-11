import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAppRouter } from '@/src/navigation';
import { getPyqByChapter } from '@/src/data/pyqData';
import type { PYQQuestion } from '@/src/data/pyqData';

function PyqCard({ item }: { item: PYQQuestion }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setExpanded((v) => !v);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.yearBadge}>
          <Text style={styles.yearBadgeText}>{item.year}</Text>
        </View>
        <Text style={[styles.marksText, { color: colors.mutedForeground }]}>{item.marks} marks</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.mutedForeground}
        />
      </View>

      <Text style={[styles.questionText, { color: colors.cardForeground }]}>{item.question}</Text>

      {expanded && (
        <View style={[styles.answerBox, { backgroundColor: '#FFF3E0', borderColor: '#FFCC80' }]}>
          <View style={styles.answerLabelRow}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#E65100" />
            <Text style={styles.answerLabel}>Model Answer</Text>
          </View>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function PyqScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const nav    = useAppRouter();

  const { chapterId, chapterName, subjectName, categoryColor } = useLocalSearchParams<{
    chapterId:      string;
    chapterName:    string;
    subjectName:    string;
    categoryColor?: string;
  }>();

  const accentColor = categoryColor ?? '#E65100';
  const questions    = getPyqByChapter(chapterId ?? '');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: '#E65100' }]}>
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
          <Ionicons name="archive-outline" size={13} color="#FFFFFF" />
          <Text style={styles.badgeText}>Previous Year Questions</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {questions.length > 0 ? (
          <>
            <Text style={[styles.hint, { color: colors.mutedForeground }]}>
              Tap a question to reveal the model answer
            </Text>
            {questions.map((q) => (
              <PyqCard key={q.id} item={q} />
            ))}
          </>
        ) : (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="archive-outline" size={40} color="#E65100" />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>PYQs Coming Soon</Text>
            <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
              Previous year board exam questions for this chapter are being compiled.
              Check back shortly.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 18, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  headerTextWrap: { flex: 1 },
  headerSuper: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.65)', marginBottom: 3 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF', lineHeight: 24 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20,
  },
  badgeText: { fontSize: 11.5, fontFamily: 'Inter_500Medium', color: '#FFFFFF' },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  hint: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 12, marginLeft: 4 },

  card: {
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  yearBadge: { backgroundColor: '#E65100', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 9 },
  yearBadgeText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  marksText: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },
  questionText: { fontSize: 14.5, fontFamily: 'Inter_500Medium', lineHeight: 21 },

  answerBox: { marginTop: 12, padding: 12, borderRadius: 10, borderWidth: 1 },
  answerLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  answerLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#E65100' },
  answerText: { fontSize: 13.5, fontFamily: 'Inter_400Regular', color: '#5D4037', lineHeight: 20 },

  emptyBox: { alignItems: 'center', gap: 10, padding: 32, borderRadius: 16, borderWidth: 1, marginTop: 20 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  emptyBody: { fontSize: 13.5, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
});
