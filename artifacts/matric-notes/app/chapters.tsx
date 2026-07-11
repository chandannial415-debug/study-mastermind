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
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/src/context/AppContext';
import { useAppRouter } from '@/src/navigation';
import { getChaptersBySubject } from '@/src/data/curriculum';
import type { Chapter } from '@/src/data/curriculum';
import ChapterRow from '@/src/components/ChapterRow';

export default function ChaptersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const nav    = useAppRouter();
  const { subjectId, subjectName, categoryColor } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
    categoryColor: string;
  }>();
  const { isOnline, isDownloaded } = useApp();

  const chapters = getChaptersBySubject(subjectId ?? '');
  const accentColor = categoryColor ?? '#1565C0';
  const downloadedCount = chapters.filter((ch) => isDownloaded(ch.id)).length;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function handleChapterPress(chapter: Chapter) {
    // Every chapter opens its 5-folder hub (Full Book, Small Notebook,
    // MCQ, Previous Year Questions, Gaming Mode). Download/ad-gating for
    // the PDF now lives inside the Full Book folder on that screen.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nav.goToChapterHub({
      chapterId:     chapter.id,
      chapterName:   chapter.name,
      subjectId:     subjectId ?? '',
      subjectName:   subjectName ?? '',
      categoryColor: accentColor,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 10, backgroundColor: accentColor },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerSuper}>CHAPTERS</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {subjectName ?? 'Chapters'}
            </Text>
          </View>
        </View>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          <View style={[styles.statPill, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="folder-outline" size={13} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statPillText}>{chapters.length} Chapters</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="cloud-done-outline" size={13} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statPillText}>{downloadedCount} Downloaded</Text>
          </View>
          {/* Online/Offline indicator */}
          <View
            style={[
              styles.statPill,
              {
                backgroundColor: isOnline
                  ? 'rgba(46,125,50,0.55)'
                  : 'rgba(230,81,0,0.55)',
              },
            ]}
          >
            <Ionicons
              name={isOnline ? 'wifi-outline' : 'cloud-offline-outline'}
              size={13}
              color="#FFFFFF"
            />
            <Text style={styles.statPillText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
      </View>

      {/* Offline banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#BF360C" />
          <Text style={styles.offlineBannerText}>
            Offline — only downloaded chapters can be opened
          </Text>
        </View>
      )}

      {/* Chapter list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          TAP A CHAPTER TO OPEN ITS FOLDERS
        </Text>

        {chapters.map((chapter) => (
          <ChapterRow
            key={chapter.id}
            chapter={chapter}
            isDownloaded={isDownloaded(chapter.id)}
            onPress={() => handleChapterPress(chapter)}
          />
        ))}

        {/* Download hint */}
        <View style={[styles.hintBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="bulb-outline" size={18} color="#FFA000" />
          <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
            Tap any chapter to open its Full Book, Small Notebook, MCQ, Previous Year
            Questions, and Gaming Mode folders.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 16,
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
  headerTextWrap: { flex: 1 },
  headerSuper: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  statsBar: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statPillText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCC80',
  },
  offlineBannerText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#BF360C',
    flex: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16 },
  sectionLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.1,
    marginHorizontal: 18,
    marginBottom: 10,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  hintText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
});
