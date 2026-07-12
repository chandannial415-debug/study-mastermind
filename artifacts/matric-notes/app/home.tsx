import React, { useState } from 'react';
import {
  Alert,
  Linking,
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
import { useApp } from '@/src/context/AppContext';
import { useAppRouter } from '@/src/navigation';
import { QUIZ_BANK_SIZE } from '@/src/context/AppContext';

// ── Dark theme palette ────────────────────────────────────────────────────────
const BG           = '#0A0A12';
const CARD         = '#13131F';
const CARD_BORDER  = 'rgba(255,255,255,0.08)';
const ACCENT       = '#6366F1';
const ACCENT_DIM   = 'rgba(99,102,241,0.18)';
const TEXT1        = '#FFFFFF';
const TEXT2        = 'rgba(255,255,255,0.50)';
const TAB_BAR_BG   = '#0E0E1B';
const TAB_BAR_H    = 62;
const WA_GREEN     = '#25D366';

type ActiveTab = 'study' | 'ranks' | 'profile';

// ── Score colour helper ───────────────────────────────────────────────────────
function scoreColor(pct: number) {
  if (pct >= 70) return '#4ADE80';
  if (pct >= 45) return '#FBBF24';
  return '#F87171';
}

// ── Class folder data ─────────────────────────────────────────────────────────
const CLASSES = [
  { key: '9th',   label: '9th Class',    icon: 'school-outline' as const,         active: false },
  { key: '10th',  label: '10th Class',   icon: 'book-outline' as const,           active: true  },
  { key: '+21st', label: '+2 1st Year',  icon: 'library-outline' as const,        active: false },
  { key: '+22nd', label: '+2 2nd Year',  icon: 'ribbon-outline' as const,         active: false },
];

// ═════════════════════════════════════════════════════════════════════════════
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('study');
  const insets = useSafeAreaInsets();
  const nav    = useAppRouter();
  const {
    isOnline,
    boardPredictionPct,
    uniqueQsAnswered,
    questionRevisions,
    quizStats,
    downloadedChapters,
    revisedCount,
    resetQuizStats,
  } = useApp();

  const topPad = Platform.OS === 'web' ? 50 : insets.top;
  const botPad = Platform.OS === 'web' ? 20 : insets.bottom;

  const accuracyPct = quizStats.attempted > 0
    ? Math.round((quizStats.correct / quizStats.attempted) * 100)
    : 0;

  // ── WhatsApp share ──────────────────────────────────────────────────────────
  const handleWhatsAppShare = () => {
    const msg =
      `🎓 My Board Exam Prediction: *${boardPredictionPct}%*\n` +
      `📚 MCQs Solved: ${uniqueQsAnswered.size}/${QUIZ_BANK_SIZE}\n` +
      `🔄 Revisions Done: ${revisedCount}\n` +
      `🎯 Quiz Accuracy: ${accuracyPct}%\n\n` +
      `Studying hard with Matric Notes! 📖✨`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`).catch(() =>
      Alert.alert('WhatsApp not found', 'Please install WhatsApp to share.'),
    );
  };

  // ── Class folder press ──────────────────────────────────────────────────────
  const handleClassPress = (key: string) => {
    if (key === '10th') {
      nav.goToSubjects({
        categoryId:    'regular',
        categoryName:  'Class 10 — Regular Courses',
        categoryColor: ACCENT,
      });
    } else {
      const label = CLASSES.find((c) => c.key === key)?.label ?? key;
      Alert.alert('Coming Soon 🚀', `${label} content is being prepared. Stay tuned!`);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Fixed Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View>
          <Text style={styles.appName}>Matric Notes</Text>
          <Text style={styles.appSub}>BSE Odisha · Class 10</Text>
        </View>
        <View style={[styles.onlineBadge, { backgroundColor: isOnline ? '#14532D' : '#431407' }]}>
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#4ADE80' : '#F87171' }]} />
          <Text style={[styles.onlineText, { color: isOnline ? '#4ADE80' : '#F87171' }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_H + botPad + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'study'   && (
          <StudyTab
            boardPredictionPct={boardPredictionPct}
            uniqueQsAnswered={uniqueQsAnswered.size}
            revisedCount={revisedCount}
            accuracyPct={accuracyPct}
            onWhatsAppShare={handleWhatsAppShare}
            onClassPress={handleClassPress}
            onGaming={() => nav.goToGaming()}
            isOnline={isOnline}
          />
        )}
        {activeTab === 'ranks'   && <RanksTab />}
        {activeTab === 'profile' && (
          <ProfileTab
            boardPredictionPct={boardPredictionPct}
            uniqueQsAnswered={uniqueQsAnswered.size}
            revisedCount={revisedCount}
            accuracyPct={accuracyPct}
            downloaded={downloadedChapters.size}
            attempted={quizStats.attempted}
            onReset={() =>
              Alert.alert(
                'Reset Stats',
                'This will clear all your quiz progress and revision history. Continue?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', style: 'destructive', onPress: resetQuizStats },
                ],
              )
            }
          />
        )}
      </ScrollView>

      {/* ── Bottom Tab Bar ── */}
      <View style={[styles.tabBar, { paddingBottom: botPad || 8 }]}>
        {([
          { key: 'study',   icon: 'book',    iconOut: 'book-outline',    label: 'Study'   },
          { key: 'ranks',   icon: 'trophy',  iconOut: 'trophy-outline',  label: 'Ranks'   },
          { key: 'profile', icon: 'person',  iconOut: 'person-outline',  label: 'Profile' },
        ] as const).map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key as ActiveTab)}
            >
              {active && <View style={styles.tabActiveBar} />}
              <Ionicons
                name={active ? tab.icon : tab.iconOut}
                size={22}
                color={active ? ACCENT : TEXT2}
              />
              <Text style={[styles.tabLabel, { color: active ? ACCENT : TEXT2 }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STUDY TAB
// ═══════════════════════════════════════════════════════════════════════════════
function StudyTab({
  boardPredictionPct,
  uniqueQsAnswered,
  revisedCount,
  accuracyPct,
  onWhatsAppShare,
  onClassPress,
  onGaming,
  isOnline,
}: {
  boardPredictionPct: number;
  uniqueQsAnswered: number;
  revisedCount: number;
  accuracyPct: number;
  onWhatsAppShare: () => void;
  onClassPress: (key: string) => void;
  onGaming: () => void;
  isOnline: boolean;
}) {
  const color = scoreColor(boardPredictionPct);
  const fillPct = `${boardPredictionPct}%`;

  return (
    <>
      {/* ── Board Exam Prediction Card ── */}
      <View style={pred.card}>
        {/* Glow layer */}
        <View style={pred.glowLayer} />

        {/* Header row */}
        <View style={pred.headerRow}>
          <View style={pred.iconWrap}>
            <Ionicons name="shield-checkmark" size={18} color={ACCENT} />
          </View>
          <Text style={pred.title}>Board Exam Prediction</Text>
          <Text style={pred.formula}>Study 40% · Rev 35% · Acc 25%</Text>
        </View>

        {/* Score */}
        <View style={pred.scoreRow}>
          <Text style={[pred.scoreNum, { color }]}>{boardPredictionPct}</Text>
          <Text style={[pred.scorePct, { color }]}>%</Text>
          <View style={pred.scoreMeta}>
            <Text style={pred.scoreLabel}>Predicted</Text>
            <Text style={pred.scoreLabel}>Board Score</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={pred.barTrack}>
          <View style={[pred.barFill, { width: fillPct as any, backgroundColor: color }]} />
        </View>
        <View style={pred.barLabels}>
          <Text style={pred.barLabelText}>0%</Text>
          <Text style={pred.barLabelText}>100%</Text>
        </View>

        {/* 3 stats */}
        <View style={pred.statsRow}>
          <View style={pred.statChip}>
            <Ionicons name="checkmark-circle-outline" size={15} color={ACCENT} />
            <Text style={pred.statVal}>{uniqueQsAnswered}/{QUIZ_BANK_SIZE}</Text>
            <Text style={pred.statLbl}>MCQs Solved</Text>
          </View>
          <View style={pred.statDivider} />
          <View style={pred.statChip}>
            <Ionicons name="refresh-circle-outline" size={15} color="#A78BFA" />
            <Text style={pred.statVal}>{revisedCount}</Text>
            <Text style={pred.statLbl}>Revisions</Text>
          </View>
          <View style={pred.statDivider} />
          <View style={pred.statChip}>
            <Ionicons name="analytics-outline" size={15} color="#34D399" />
            <Text style={pred.statVal}>{accuracyPct}%</Text>
            <Text style={pred.statLbl}>Accuracy</Text>
          </View>
        </View>

        {/* WhatsApp share */}
        <Pressable
          style={({ pressed }) => [pred.waBtn, { opacity: pressed ? 0.8 : 1 }]}
          onPress={onWhatsAppShare}
        >
          <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
          <Text style={pred.waBtnText}>Share on WhatsApp</Text>
        </Pressable>
      </View>

      {/* ── Section label ── */}
      <Text style={sty.sectionLabel}>SELECT YOUR CLASS</Text>

      {/* ── Class folders grid ── */}
      <View style={sty.classGrid}>
        {CLASSES.map((cls) => (
          <Pressable
            key={cls.key}
            style={({ pressed }) => [
              sty.classCard,
              cls.active
                ? [sty.classCardActive, { opacity: pressed ? 0.82 : 1 }]
                : [sty.classCardLocked, { opacity: pressed ? 0.7 : 1 }],
            ]}
            onPress={() => onClassPress(cls.key)}
          >
            {/* Folder tab accent */}
            {cls.active && <View style={sty.folderTab} />}

            <View style={[sty.classIconWrap, { backgroundColor: cls.active ? ACCENT_DIM : 'rgba(255,255,255,0.05)' }]}>
              <Ionicons
                name={cls.icon}
                size={26}
                color={cls.active ? ACCENT : 'rgba(255,255,255,0.3)'}
              />
            </View>

            <Text style={[sty.classLabel, { color: cls.active ? TEXT1 : 'rgba(255,255,255,0.35)' }]}>
              {cls.label}
            </Text>

            {cls.active ? (
              <View style={sty.activeBadge}>
                <View style={sty.activeDot} />
                <Text style={sty.activeBadgeText}>Available</Text>
              </View>
            ) : (
              <View style={sty.lockedBadge}>
                <Ionicons name="lock-closed" size={10} color="rgba(255,255,255,0.3)" />
                <Text style={sty.lockedBadgeText}>Soon</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* ── Gaming Mode card ── */}
      <Text style={[sty.sectionLabel, { marginTop: 24 }]}>QUIZ MODE</Text>

      <Pressable
        style={({ pressed }) => [sty.gamingCard, { opacity: pressed ? 0.88 : 1 }]}
        onPress={onGaming}
      >
        <View style={sty.gamingCircle1} />
        <View style={sty.gamingCircle2} />
        <View style={sty.gamingIconWrap}>
          <Ionicons name="game-controller-outline" size={28} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={sty.gamingTitle}>Quiz Revision Mode</Text>
            {!isOnline && (
              <View style={sty.offlinePill}>
                <Ionicons name="cloud-offline-outline" size={10} color="#F97316" />
                <Text style={sty.offlinePillText}>Offline</Text>
              </View>
            )}
          </View>
          <Text style={sty.gamingSubtitle}>
            {isOnline
              ? 'MCQs across all 18 subjects — earn revisions'
              : 'Connect to the internet to play'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.55)" />
      </Pressable>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RANKS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function RanksTab() {
  return (
    <View style={rank.container}>
      <View style={rank.iconCircle}>
        <Ionicons name="trophy" size={52} color="#FBBF24" />
      </View>
      <Text style={rank.heading}>Leaderboard</Text>
      <Text style={rank.sub}>Coming Soon</Text>
      <Text style={rank.desc}>
        Compare your Board Exam Prediction score with classmates across Odisha.
        Compete, revise more and climb to the top!
      </Text>

      {/* placeholder rank rows */}
      {[1, 2, 3].map((n) => (
        <View key={n} style={rank.placeholderRow}>
          <View style={rank.rankNumWrap}>
            <Text style={rank.rankNum}>#{n}</Text>
          </View>
          <View style={rank.rankBar} />
          <View style={rank.rankPct} />
        </View>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ProfileTab({
  boardPredictionPct,
  uniqueQsAnswered,
  revisedCount,
  accuracyPct,
  downloaded,
  attempted,
  onReset,
}: {
  boardPredictionPct: number;
  uniqueQsAnswered: number;
  revisedCount: number;
  accuracyPct: number;
  downloaded: number;
  attempted: number;
  onReset: () => void;
}) {
  const color = scoreColor(boardPredictionPct);

  return (
    <View style={prof.container}>
      {/* Avatar */}
      <View style={prof.avatarCircle}>
        <Text style={prof.avatarText}>S</Text>
      </View>
      <Text style={prof.name}>Student</Text>
      <Text style={prof.sub}>BSE Odisha · Class 10</Text>

      {/* Big prediction badge */}
      <View style={[prof.predBadge, { borderColor: color + '55' }]}>
        <Text style={[prof.predNum, { color }]}>{boardPredictionPct}%</Text>
        <Text style={prof.predLabel}>Board Prediction</Text>
      </View>

      {/* Stats grid */}
      <View style={prof.grid}>
        {[
          { icon: 'checkmark-circle-outline', color: ACCENT,     val: `${uniqueQsAnswered}/${QUIZ_BANK_SIZE}`, lbl: 'MCQs Solved' },
          { icon: 'refresh-circle-outline',   color: '#A78BFA',  val: `${revisedCount}`,   lbl: 'Revisions'   },
          { icon: 'analytics-outline',        color: '#34D399',  val: `${accuracyPct}%`,   lbl: 'Accuracy'    },
          { icon: 'document-text-outline',    color: '#F59E0B',  val: `${attempted}`,      lbl: 'Qs Attempted' },
        ].map((s) => (
          <View key={s.lbl} style={prof.statBox}>
            <Ionicons name={s.icon as any} size={22} color={s.color} />
            <Text style={prof.statVal}>{s.val}</Text>
            <Text style={prof.statLbl}>{s.lbl}</Text>
          </View>
        ))}
      </View>

      {/* Reset button */}
      <Pressable
        style={({ pressed }) => [prof.resetBtn, { opacity: pressed ? 0.7 : 1 }]}
        onPress={onReset}
      >
        <Ionicons name="trash-outline" size={16} color="#F87171" />
        <Text style={prof.resetText}>Reset All Stats</Text>
      </Pressable>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: BG },
  header:      {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: 20,
    paddingBottom:    14,
    backgroundColor:  BG,
    borderBottomWidth: 1,
    borderBottomColor: CARD_BORDER,
  },
  appName:     { fontSize: 20, fontFamily: 'Inter_700Bold', color: TEXT1 },
  appSub:      { fontSize: 12, fontFamily: 'Inter_400Regular', color: TEXT2, marginTop: 1 },
  onlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20,
  },
  onlineDot:   { width: 7, height: 7, borderRadius: 4 },
  onlineText:  { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 18 },

  tabBar: {
    flexDirection:    'row',
    backgroundColor:  TAB_BAR_BG,
    borderTopWidth:   1,
    borderTopColor:   CARD_BORDER,
    paddingTop:       4,
  },
  tabItem:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 6, paddingBottom: 2, gap: 3, position: 'relative' },
  tabActiveBar:  { position: 'absolute', top: 0, width: 28, height: 2.5, borderRadius: 2, backgroundColor: ACCENT },
  tabLabel:      { fontSize: 11, fontFamily: 'Inter_500Medium' },
});

// ── Prediction card styles ─────────────────────────────────────────────────────
const pred = StyleSheet.create({
  card: {
    backgroundColor: '#111128',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.35)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    gap: 12,
  },
  glowLayer: {
    position:   'absolute',
    top: -40, right: -40,
    width: 140, height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(99,102,241,0.12)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  iconWrap:  {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: ACCENT_DIM, alignItems: 'center', justifyContent: 'center',
  },
  title:   { fontSize: 15, fontFamily: 'Inter_700Bold', color: TEXT1, flex: 1 },
  formula: { fontSize: 10.5, fontFamily: 'Inter_400Regular', color: TEXT2 },

  scoreRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  scoreNum:  { fontSize: 60, fontFamily: 'Inter_700Bold', lineHeight: 68 },
  scorePct:  { fontSize: 28, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  scoreMeta: { marginLeft: 10, marginBottom: 8, gap: 0 },
  scoreLabel:{ fontSize: 12, fontFamily: 'Inter_500Medium', color: TEXT2, lineHeight: 17 },

  barTrack:  { height: 7, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' },
  barFill:   { height: '100%', borderRadius: 4 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabelText: { fontSize: 10, fontFamily: 'Inter_400Regular', color: TEXT2 },

  statsRow:  { flexDirection: 'row', alignItems: 'center' },
  statChip:  { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.07)' },
  statVal:   { fontSize: 16, fontFamily: 'Inter_700Bold', color: TEXT1 },
  statLbl:   { fontSize: 10.5, fontFamily: 'Inter_400Regular', color: TEXT2, textAlign: 'center' },

  waBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: WA_GREEN, borderRadius: 12,
    paddingVertical: 11, paddingHorizontal: 20,
  },
  waBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});

// ── Shared study-tab styles ────────────────────────────────────────────────────
const sty = StyleSheet.create({
  sectionLabel: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold', color: TEXT2,
    letterSpacing: 1.4, marginBottom: 12, marginLeft: 2,
  },
  classGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4,
  },
  classCard: {
    width: '47.5%', borderRadius: 16, padding: 16, gap: 10,
    borderWidth: 1, position: 'relative', overflow: 'hidden',
  },
  classCardActive: {
    backgroundColor: '#14143A', borderColor: 'rgba(99,102,241,0.55)',
  },
  classCardLocked: {
    backgroundColor: '#0F0F1A', borderColor: 'rgba(255,255,255,0.07)',
  },
  folderTab: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 3, backgroundColor: ACCENT, borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  classIconWrap: {
    width: 46, height: 46, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  classLabel: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(99,102,241,0.18)', borderRadius: 20,
    paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start',
  },
  activeDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  activeBadgeText:{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: ACCENT },
  lockedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20,
    paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start',
  },
  lockedBadgeText:{ fontSize: 11, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.3)' },

  gamingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#4A1D96', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 16,
    overflow: 'hidden', position: 'relative', marginBottom: 8,
  },
  gamingCircle1: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.06)', right: -24, top: -28,
  },
  gamingCircle2: {
    position: 'absolute', width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.04)', right: 50, bottom: -28,
  },
  gamingIconWrap: {
    width: 46, height: 46, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center',
  },
  gamingTitle:   { fontSize: 15, fontFamily: 'Inter_700Bold',    color: '#FFFFFF' },
  gamingSubtitle:{ fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.65)', lineHeight: 17 },
  offlinePill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#431407', borderRadius: 999,
    paddingVertical: 2, paddingHorizontal: 6,
  },
  offlinePillText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#F97316' },
});

// ── Ranks tab styles ───────────────────────────────────────────────────────────
const rank = StyleSheet.create({
  container:      { alignItems: 'center', paddingTop: 24, gap: 10 },
  iconCircle:     {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(251,191,36,0.1)', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  heading:        { fontSize: 22, fontFamily: 'Inter_700Bold', color: TEXT1 },
  sub:            { fontSize: 13, fontFamily: 'Inter_500Medium', color: TEXT2 },
  desc:           {
    fontSize: 13.5, fontFamily: 'Inter_400Regular', color: TEXT2,
    textAlign: 'center', lineHeight: 20, paddingHorizontal: 12, marginBottom: 8,
  },
  placeholderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    width: '100%', paddingHorizontal: 4,
  },
  rankNumWrap:    {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center',
  },
  rankNum:        { fontSize: 13, fontFamily: 'Inter_700Bold', color: TEXT2 },
  rankBar:        {
    flex: 1, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.05)',
  },
  rankPct:        {
    width: 38, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.05)',
  },
});

// ── Profile tab styles ─────────────────────────────────────────────────────────
const prof = StyleSheet.create({
  container:   { alignItems: 'center', paddingTop: 16, gap: 12 },
  avatarCircle:{
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: ACCENT_DIM, borderWidth: 2, borderColor: ACCENT,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:  { fontSize: 32, fontFamily: 'Inter_700Bold', color: ACCENT },
  name:        { fontSize: 20, fontFamily: 'Inter_700Bold', color: TEXT1 },
  sub:         { fontSize: 12, fontFamily: 'Inter_400Regular', color: TEXT2, marginTop: -4 },

  predBadge:   {
    alignItems: 'center', paddingVertical: 16, paddingHorizontal: 40,
    borderRadius: 16, borderWidth: 1.5, backgroundColor: CARD,
  },
  predNum:     { fontSize: 48, fontFamily: 'Inter_700Bold' },
  predLabel:   { fontSize: 12, fontFamily: 'Inter_500Medium', color: TEXT2 },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    width: '100%', marginTop: 4,
  },
  statBox:     {
    width: '47%', backgroundColor: CARD, borderRadius: 14, borderWidth: 1,
    borderColor: CARD_BORDER, padding: 14, alignItems: 'center', gap: 4,
  },
  statVal:     { fontSize: 20, fontFamily: 'Inter_700Bold', color: TEXT1 },
  statLbl:     { fontSize: 11, fontFamily: 'Inter_400Regular', color: TEXT2, textAlign: 'center' },

  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20, marginTop: 4,
  },
  resetText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#F87171' },
});
