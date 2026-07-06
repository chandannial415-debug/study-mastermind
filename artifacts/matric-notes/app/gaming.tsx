import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/src/context/AppContext';
import { useAppRouter } from '@/src/navigation';
import { SUBJECTS, CATEGORIES, getCategoryById } from '@/src/data/curriculum';
import { getQuizSubjectIds } from '@/src/data/quizData';
import ProgressDashboard from '@/src/components/ProgressDashboard';
import { BRAND_NAVY, COLOR_SUCCESS, COLOR_AMBER, spacing, radius } from '@/src/styles';

// ── Quiz mode metadata ────────────────────────────────────────────────────────
type QuizMode = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  comingSoon: boolean;
};

const QUIZ_MODES: QuizMode[] = [
  {
    id: 'mcq',
    label: 'MCQ Challenge',
    icon: 'checkmark-circle-outline',
    color: '#1565C0',
    description: 'Multiple choice questions — up to 10 per round, auto-advances on correct answers.',
    comingSoon: false,
  },
  {
    id: 'flashcard',
    label: 'Flashcard Drill',
    icon: 'layers-outline',
    color: '#6A1B9A',
    description: 'Flip-card revision for fast concept recall.',
    comingSoon: true,
  },
  {
    id: 'fill',
    label: 'Fill in the Blank',
    icon: 'create-outline',
    color: '#2E7D32',
    description: 'Complete key sentences from your notes.',
    comingSoon: true,
  },
  {
    id: 'match',
    label: 'Match the Pair',
    icon: 'git-compare-outline',
    color: '#E65100',
    description: 'Match terms to definitions in under 60 seconds.',
    comingSoon: true,
  },
];

// Subjects that have quiz questions in the local bank
const QUIZ_SUBJECT_IDS = new Set(getQuizSubjectIds());

// Subjects eligible for quiz (have questions in the bank)
const QUIZ_SUBJECTS = SUBJECTS.filter((s) => QUIZ_SUBJECT_IDS.has(s.id));

// ── Offline wall ──────────────────────────────────────────────────────────────
function OfflineWall() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={offlineStyles.wall}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <View style={offlineStyles.iconCircle}>
          <Ionicons name="wifi-outline" size={52} color="#FFFFFF" />
        </View>
      </Animated.View>

      <Text style={offlineStyles.title}>Internet Required</Text>
      <Text style={offlineStyles.body}>
        Gaming Mode needs an active internet connection to load questions, verify
        scores, and sync your progress. Connect to Wi-Fi or mobile data to play.
      </Text>

      <View style={offlineStyles.tipRow}>
        <Ionicons name="bulb-outline" size={16} color={COLOR_AMBER} />
        <Text style={offlineStyles.tipText}>
          Downloaded chapter notes are still available offline in the Notes section.
        </Text>
      </View>
    </View>
  );
}

const offlineStyles = StyleSheet.create({
  wall: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.xl,
  },
  iconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(230,81,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#FFFFFF', textAlign: 'center' },
  body: {
    fontSize: 14.5, fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22,
  },
  tipRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: radius.lg,
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
  },
  tipText: {
    flex: 1, fontSize: 12.5, fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.80)', lineHeight: 18,
  },
});

// ── Subject chip — tappable, navigates to quiz ────────────────────────────────
function SubjectChip({
  subject,
  onPress,
  selectedModeId,
}: {
  subject: (typeof QUIZ_SUBJECTS)[0];
  onPress: () => void;
  selectedModeId: string;
}) {
  const colors   = useColors();
  const category = getCategoryById(subject.categoryId);
  const color    = category?.color ?? '#1565C0';

  const isActive = selectedModeId === 'mcq'; // chips only active when MCQ selected

  return (
    <Pressable
      onPress={onPress}
      disabled={!isActive}
      style={({ pressed }) => [
        chipStyles.chip,
        {
          backgroundColor: isActive
            ? (pressed ? color + '25' : color + '12')
            : colors.muted,
          borderColor: isActive ? color + '50' : colors.border,
          opacity: !isActive ? 0.55 : 1,
        },
      ]}
    >
      <Ionicons
        name={subject.iconName as keyof typeof Ionicons.glyphMap}
        size={14}
        color={isActive ? color : colors.mutedForeground}
      />
      <Text
        style={[chipStyles.label, { color: isActive ? color : colors.mutedForeground }]}
        numberOfLines={1}
      >
        {subject.name}
      </Text>
      {isActive && (
        <Ionicons name="chevron-forward" size={12} color={color + 'AA'} />
      )}
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: radius.full, borderWidth: 1,
  },
  label: { fontSize: 12, fontFamily: 'Inter_500Medium', maxWidth: 130 },
});

// ── Quiz mode card ────────────────────────────────────────────────────────────
function QuizModeCard({
  mode, selected, onPress,
}: {
  mode: QuizMode;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        cardStyles.card,
        {
          backgroundColor: selected ? mode.color + '12' : colors.card,
          borderColor:     selected ? mode.color       : colors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
      onPress={onPress}
    >
      {/* Left accent bar */}
      <View style={[cardStyles.accent, { backgroundColor: mode.color }]} />

      {/* Icon */}
      <View style={[cardStyles.iconWrap, { backgroundColor: `${mode.color}18` }]}>
        <Ionicons name={mode.icon} size={26} color={mode.color} />
      </View>

      {/* Text */}
      <View style={cardStyles.textWrap}>
        <View style={cardStyles.labelRow}>
          <Text style={[cardStyles.title, { color: colors.foreground }]}>{mode.label}</Text>
          {mode.comingSoon ? (
            <View style={cardStyles.soonBadge}>
              <Text style={cardStyles.soonText}>Soon</Text>
            </View>
          ) : (
            <View style={[cardStyles.liveBadge, { backgroundColor: `${COLOR_SUCCESS}1A` }]}>
              <View style={[cardStyles.liveDot, { backgroundColor: COLOR_SUCCESS }]} />
              <Text style={[cardStyles.liveText, { color: COLOR_SUCCESS }]}>Live</Text>
            </View>
          )}
          {selected && !mode.comingSoon && (
            <View style={[cardStyles.selectedBadge, { backgroundColor: mode.color }]}>
              <Text style={cardStyles.selectedText}>Selected</Text>
            </View>
          )}
        </View>
        <Text style={[cardStyles.desc, { color: colors.mutedForeground }]}>{mode.description}</Text>
        {selected && !mode.comingSoon && (
          <Text style={[cardStyles.hint, { color: mode.color }]}>
            ↓ Tap a subject below to start your quiz
          </Text>
        )}
      </View>

      <Ionicons
        name={mode.comingSoon ? 'lock-closed-outline' : (selected ? 'chevron-down' : 'chevron-forward')}
        size={18}
        color={mode.comingSoon ? colors.border : colors.mutedForeground}
      />
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
    borderRadius: radius.lg, borderWidth: 1.5,
    overflow: 'hidden', paddingVertical: spacing.lg,
    paddingRight: spacing.lg, paddingLeft: 0,
  },
  accent:       { width: 4, alignSelf: 'stretch', borderRadius: 2, marginRight: spacing.sm },
  iconWrap:     { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  textWrap:     { flex: 1, gap: 3 },
  labelRow:     { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  title:        { fontSize: 15.5, fontFamily: 'Inter_600SemiBold' },
  desc:         { fontSize: 12.5, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  hint:         { fontSize: 11.5, fontFamily: 'Inter_500Medium', marginTop: 2 },
  soonBadge:    { backgroundColor: '#FFF8E1', borderRadius: radius.full, paddingVertical: 2, paddingHorizontal: 8 },
  soonText:     { fontSize: 10.5, fontFamily: 'Inter_600SemiBold', color: '#E65100' },
  liveBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.full, paddingVertical: 2, paddingHorizontal: 8 },
  liveDot:      { width: 6, height: 6, borderRadius: 3 },
  liveText:     { fontSize: 10.5, fontFamily: 'Inter_600SemiBold' },
  selectedBadge:{ borderRadius: radius.full, paddingVertical: 2, paddingHorizontal: 8 },
  selectedText: { fontSize: 10.5, fontFamily: 'Inter_600SemiBold', color: '#FFF' },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GamingScreen() {
  const colors   = useColors();
  const insets   = useSafeAreaInsets();
  const { isOnline, downloadedChapters } = useApp();
  const nav      = useAppRouter();

  const [selectedMode, setSelectedMode] = useState<string>('mcq');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function handleModePress(mode: QuizMode) {
    if (mode.comingSoon) return;
    setSelectedMode((prev) => prev === mode.id ? '' : mode.id);
  }

  function handleSubjectPress(subject: (typeof QUIZ_SUBJECTS)[0]) {
    if (selectedMode !== 'mcq') return;
    const category = getCategoryById(subject.categoryId);
    nav.goToQuiz({
      subjectId:     subject.id,
      subjectName:   subject.name,
      categoryColor: category?.color,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: isOnline ? colors.background : BRAND_NAVY }]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.headerSuper}>STUDY MINDSET</Text>
            <Text style={styles.headerTitle}>Gaming Mode</Text>
          </View>

          <View
            style={[
              styles.connBadge,
              { backgroundColor: isOnline ? 'rgba(46,125,50,0.55)' : 'rgba(230,81,0,0.55)' },
            ]}
          >
            <Ionicons
              name={isOnline ? 'wifi-outline' : 'cloud-offline-outline'}
              size={14}
              color="#FFFFFF"
            />
            <Text style={styles.connText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>

        {isOnline && (
          <View style={styles.statsRow}>
            <View style={[styles.statChip, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Ionicons name="trophy-outline" size={13} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statText}>{downloadedChapters.size} chapters ready</Text>
            </View>
            <View style={[styles.statChip, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Ionicons name="book-outline" size={13} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statText}>{QUIZ_SUBJECTS.length} quiz subjects</Text>
            </View>
          </View>
        )}
      </View>

      {/* ── Body ── */}
      {isOnline ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Quiz modes */}
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            CHOOSE A QUIZ MODE
          </Text>

          {QUIZ_MODES.map((mode) => (
            <QuizModeCard
              key={mode.id}
              mode={mode}
              selected={selectedMode === mode.id}
              onPress={() => handleModePress(mode)}
            />
          ))}

          {/* Subject selector */}
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: spacing.xl }]}>
            {selectedMode === 'mcq'
              ? 'TAP A SUBJECT TO START QUIZ'
              : 'AVAILABLE SUBJECTS'}
          </Text>

          <View style={styles.chipGrid}>
            {QUIZ_SUBJECTS.map((s) => (
              <SubjectChip
                key={s.id}
                subject={s}
                selectedModeId={selectedMode}
                onPress={() => handleSubjectPress(s)}
              />
            ))}
          </View>

          {/* Progress Dashboard */}
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: spacing.xl }]}>
            YOUR BOARD EXAM PREDICTION
          </Text>

          <View style={{ marginHorizontal: spacing.lg }}>
            <ProgressDashboard />
          </View>

          {/* Coming soon banner */}
          <View
            style={[styles.comingSoonBanner, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.csBannerIcon, { backgroundColor: `${COLOR_AMBER}20` }]}>
              <Ionicons name="construct-outline" size={22} color={COLOR_AMBER} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.csBannerTitle, { color: colors.foreground }]}>
                Flashcard, Fill-in-Blank & Match — Coming Next
              </Text>
              <Text style={[styles.csBannerBody, { color: colors.mutedForeground }]}>
                More quiz modes, leaderboards, and subject-wise analytics are being built.
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <OfflineWall />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: BRAND_NAVY,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerSuper: {
    fontSize: 10.5, fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.55)', letterSpacing: 1.3,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  connBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: radius.full,
  },
  connText: { fontSize: 11.5, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: radius.full,
  },
  statText: { fontSize: 11.5, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.88)' },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: spacing.xl },

  sectionLabel: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2, marginHorizontal: spacing.lg, marginBottom: spacing.md,
  },

  chipGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    paddingHorizontal: spacing.lg, marginBottom: spacing.lg,
  },

  comingSoonBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    marginHorizontal: spacing.lg, marginTop: spacing.xl,
    padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1,
  },
  csBannerIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  csBannerTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  csBannerBody: { fontSize: 12.5, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
