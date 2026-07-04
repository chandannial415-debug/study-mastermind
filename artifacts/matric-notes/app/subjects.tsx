import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { getCategoryById, getSubjectsByCategory } from '@/src/data/curriculum';
import type { Category } from '@/src/data/curriculum';

export default function SubjectsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();

  const category = getCategoryById(categoryId ?? '') as Category | undefined;
  const subjects = getSubjectsByCategory(categoryId ?? '');
  const accentColor = category?.color ?? '#1565C0';

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: accentColor }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerSuper}>CLASS 10</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {categoryName ?? 'Subjects'}
            </Text>
          </View>
        </View>

        <View style={[styles.countBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          <Ionicons name="apps-outline" size={14} color="rgba(255,255,255,0.9)" />
          <Text style={styles.countText}>{subjects.length} Subjects</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          SELECT A SUBJECT
        </Text>

        {subjects.map((subject, index) => (
          <Pressable
            key={subject.id}
            style={({ pressed }) => [
              styles.subjectRow,
              {
                backgroundColor: pressed ? colors.muted : colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: '/chapters',
                params: {
                  subjectId: subject.id,
                  subjectName: subject.name,
                  categoryColor: accentColor,
                },
              })
            }
            android_ripple={{ color: accentColor + '22', borderless: false }}
          >
            {/* Index number */}
            <View style={[styles.indexBadge, { backgroundColor: accentColor + '18' }]}>
              <Text style={[styles.indexText, { color: accentColor }]}>
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>

            {/* Icon */}
            <View style={[styles.subjectIcon, { backgroundColor: accentColor + '15' }]}>
              <Ionicons name={subject.iconName as any} size={22} color={accentColor} />
            </View>

            {/* Text */}
            <View style={styles.subjectTextWrap}>
              <Text style={[styles.subjectName, { color: colors.cardForeground }]}>
                {subject.name}
              </Text>
              <Text style={[styles.chapterCount, { color: colors.mutedForeground }]}>
                {subject.totalChapters} chapters
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerSuper: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  countText: {
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 20 },
  sectionLabel: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    marginHorizontal: 18,
    marginBottom: 12,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  subjectIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectTextWrap: {
    flex: 1,
    gap: 2,
  },
  subjectName: {
    fontSize: 15.5,
    fontFamily: 'Inter_500Medium',
  },
  chapterCount: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
  },
});
