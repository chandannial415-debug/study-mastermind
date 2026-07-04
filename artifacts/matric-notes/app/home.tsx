import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/src/context/AppContext';
import { useAppRouter } from '@/src/navigation';
import CategoryCard from '@/src/components/CategoryCard';
import { CATEGORIES, SUBJECTS, getTotalChapterCount } from '@/src/data/curriculum';
import { spacing, radius, BRAND_NAVY } from '@/src/styles';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isOnline, downloadedChapters } = useApp();
  const nav = useAppRouter();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const totalChapters = getTotalChapterCount();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerGreeting}>Welcome, Student</Text>
            <Text style={styles.headerTitle}>Study Mindset</Text>
          </View>

          {/* Online/Offline badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isOnline ? '#E8F5E9' : '#FFF3E0' },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? '#2E7D32' : '#E65100' },
              ]}
            />
            <Text
              style={[styles.statusText, { color: isOnline ? '#2E7D32' : '#E65100' }]}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="folder-open-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{downloadedChapters.size}</Text>
            <Text style={styles.statLabel}>Downloaded</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="book-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{SUBJECTS.length}</Text>
            <Text style={styles.statLabel}>Subjects</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="document-text-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{totalChapters}</Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Category cards ── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          SELECT A CATEGORY
        </Text>

        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onPress={() =>
              nav.goToSubjects({
                categoryId:    cat.id,
                categoryName:  cat.name,
                categoryColor: cat.color,
              })
            }
          />
        ))}

        {/* ── Gaming Mode card ── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 24 }]}>
          GAMING MODE
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.gamingCard,
            {
              opacity:          pressed ? 0.88 : 1,
              shadowColor:      '#6A1B9A',
              shadowOffset:     { width: 0, height: 4 },
              shadowOpacity:    pressed ? 0 : 0.22,
              shadowRadius:     12,
              elevation:        pressed ? 0 : 5,
            },
          ]}
          onPress={() => nav.goToGaming()}
        >
          {/* Decorative circles */}
          <View style={styles.gamingCircle1} />
          <View style={styles.gamingCircle2} />

          {/* Left icon */}
          <View style={styles.gamingIconWrap}>
            <Ionicons name="game-controller-outline" size={32} color="#FFFFFF" />
          </View>

          {/* Text */}
          <View style={styles.gamingTextWrap}>
            <View style={styles.gamingLabelRow}>
              <Text style={styles.gamingTitle}>Quiz Revision Mode</Text>
              {!isOnline && (
                <View style={styles.offlinePill}>
                  <Ionicons name="cloud-offline-outline" size={11} color="#E65100" />
                  <Text style={styles.offlinePillText}>Offline</Text>
                </View>
              )}
            </View>
            <Text style={styles.gamingSubtitle}>
              {isOnline
                ? 'MCQs, flashcards & match-the-pair across all 18 subjects'
                : 'Connect to the internet to play'}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>

        {/* ── Info box ── */}
        <View
          style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Download chapters once to study completely offline. Watch a short ad to unlock each PDF — BSE Odisha Class 10 syllabus only.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: BRAND_NAVY,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerGreeting: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 3,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 20 },

  sectionLabel: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginBottom: 14,
  },

  // Gaming card
  gamingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 18,
    backgroundColor: '#6A1B9A',
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  gamingCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
    right: -30,
    top: -30,
  },
  gamingCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    right: 40,
    bottom: -30,
  },
  gamingIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamingTextWrap: { flex: 1, gap: 4 },
  gamingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  gamingTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  gamingSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF3E0',
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  offlinePillText: {
    fontSize: 10.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#E65100',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 18,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
  },
});
