import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/src/context/AppContext';
import { useAppRouter } from '@/src/navigation';
import { fetchQuizQuestions } from '@/src/data/quizData';
import type { QuizQuestion } from '@/src/data/quizData';
import { BRAND_NAVY } from '@/src/styles';

// ── Config ────────────────────────────────────────────────────────────────────
const MAX_QUESTIONS     = 10;
const AUTO_ADVANCE_MS   = 1500;

// Deterministic particle geometry (no Math.random)
const PARTICLE_ANGLES    = [0, 45, 90, 135, 180, 225, 270, 315];
const PARTICLE_DISTANCES = [88, 76, 90, 72, 82, 78, 86, 68];
const PARTICLE_COLORS    = ['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#FF69B4','#A78BFA'];

type AnswerState = 'idle' | 'correct' | 'wrong';

// ── Particle celebration ──────────────────────────────────────────────────────
function CelebrationParticles({ visible }: { visible: boolean }) {
  const anims = useRef(
    PARTICLE_ANGLES.map(() => ({
      tx: new Animated.Value(0),
      ty: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    if (visible) {
      const animations = anims.map((a, i) => {
        const rad = (PARTICLE_ANGLES[i] * Math.PI) / 180;
        const d   = PARTICLE_DISTANCES[i];
        return Animated.parallel([
          Animated.timing(a.tx,      { toValue: Math.cos(rad) * d, duration: 550, useNativeDriver: true }),
          Animated.timing(a.ty,      { toValue: Math.sin(rad) * d, duration: 550, useNativeDriver: true }),
          Animated.spring(a.scale,   { toValue: 1, useNativeDriver: true, damping: 6 }),
          Animated.sequence([
            Animated.timing(a.opacity, { toValue: 1, duration: 80,  useNativeDriver: true }),
            Animated.timing(a.opacity, { toValue: 0, duration: 420, delay: 130, useNativeDriver: true }),
          ]),
        ]);
      });
      Animated.parallel(animations).start();
    } else {
      anims.forEach((a) => {
        a.tx.setValue(0); a.ty.setValue(0);
        a.opacity.setValue(0); a.scale.setValue(0);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {anims.map((a, i) => (
        <Animated.View
          key={i}
          style={{
            position:  'absolute',
            top: '47%', left: '48%',
            width: 11, height: 11,
            borderRadius: 6,
            backgroundColor: PARTICLE_COLORS[i],
            transform: [{ translateX: a.tx }, { translateY: a.ty }, { scale: a.scale }],
            opacity: a.opacity,
          }}
        />
      ))}
    </View>
  );
}

// ── Checkmark overlay ─────────────────────────────────────────────────────────
function CorrectOverlay({ visible }: { visible: boolean }) {
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, useNativeDriver: true, damping: 7, stiffness: 180 }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[overlayStyles.wrap, { opacity }]}
    >
      <Animated.View style={[overlayStyles.circle, { transform: [{ scale }] }]}>
        <Ionicons name="checkmark" size={42} color="#FFFFFF" />
      </Animated.View>
    </Animated.View>
  );
}

const overlayStyles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46,125,50,0.15)',
    zIndex: 10,
    pointerEvents: 'none',
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
});

// ── Option button ─────────────────────────────────────────────────────────────
function OptionButton({
  label, index, optionText, answerState, selectedIndex, correctIndex,
  onPress, disabled,
}: {
  label: string;
  index: number;
  optionText: string;
  answerState: AnswerState;
  selectedIndex: number | null;
  correctIndex: number;
  onPress: () => void;
  disabled: boolean;
}) {
  const colors  = useColors();
  const shakeX  = useRef(new Animated.Value(0)).current;

  const isSelected = selectedIndex === index;
  const isCorrect  = index === correctIndex;

  // Determine visual state
  let bg        = colors.card;
  let border    = colors.border;
  let textColor = colors.foreground;
  let iconName: keyof typeof Ionicons.glyphMap = 'radio-button-off-outline';
  let iconColor = colors.mutedForeground;

  if (answerState !== 'idle') {
    if (isCorrect) {
      bg = '#E8F5E9'; border = '#66BB6A'; textColor = '#1B5E20';
      iconName = 'checkmark-circle'; iconColor = '#2E7D32';
    } else if (isSelected && answerState === 'wrong') {
      bg = '#FFEBEE'; border = '#EF9A9A'; textColor = '#B71C1C';
      iconName = 'close-circle'; iconColor = '#C62828';
    }
  }

  // Shake wrong selection
  useEffect(() => {
    if (isSelected && answerState === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeX, { toValue:  8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue:  6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue:  0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [answerState]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
      <Pressable
        style={[optStyles.btn, { backgroundColor: bg, borderColor: border }]}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ color: '#1565C020', borderless: false }}
      >
        {/* Letter badge */}
        <View style={[optStyles.labelBadge, { backgroundColor: border + '40' }]}>
          <Text style={[optStyles.labelText, { color: textColor }]}>{label}</Text>
        </View>

        <Text style={[optStyles.optionText, { color: textColor }]} numberOfLines={3}>
          {optionText}
        </Text>

        <Ionicons name={iconName} size={20} color={iconColor} />
      </Pressable>
    </Animated.View>
  );
}

const optStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  labelBadge: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  labelText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  optionText: { flex: 1, fontSize: 14.5, fontFamily: 'Inter_500Medium', lineHeight: 20 },
});

// ── Results screen ────────────────────────────────────────────────────────────
function ResultsScreen({
  correct, total, subjectName, onPlayAgain, onBack,
}: {
  correct: number; total: number; subjectName: string;
  onPlayAgain: () => void; onBack: () => void;
}) {
  const colors  = useColors();
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
  const scaleAn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAn, { toValue: 1, useNativeDriver: true, damping: 7 }).start();
  }, []);

  const emoji   = pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : pct >= 40 ? '📚' : '🔥';
  const msg     = pct >= 80 ? 'Outstanding performance!' :
                  pct >= 60 ? 'Great work! Keep it up!' :
                  pct >= 40 ? 'Good effort — practice more!' : 'Keep going — you\'ll improve!';

  return (
    <ScrollView
      contentContainerStyle={[resStyles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[resStyles.card, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: scaleAn }] }]}>
        <Text style={resStyles.emoji}>{emoji}</Text>
        <Text style={[resStyles.title, { color: colors.foreground }]}>Quiz Complete!</Text>
        <Text style={[resStyles.subject, { color: colors.mutedForeground }]}>{subjectName}</Text>

        {/* Score circle */}
        <View style={[resStyles.scoreCircle, { borderColor: pct >= 60 ? '#2E7D32' : '#FFA000' }]}>
          <Text style={[resStyles.scoreNum, { color: pct >= 60 ? '#2E7D32' : '#FFA000' }]}>{pct}%</Text>
          <Text style={[resStyles.scoreSub, { color: colors.mutedForeground }]}>{correct}/{total} correct</Text>
        </View>

        <Text style={[resStyles.msg, { color: colors.foreground }]}>{msg}</Text>

        <Pressable
          style={({ pressed }) => [resStyles.primaryBtn, { backgroundColor: pressed ? '#1B5E20' : '#2E7D32' }]}
          onPress={onPlayAgain}
        >
          <Ionicons name="refresh-outline" size={18} color="#FFF" />
          <Text style={resStyles.primaryBtnText}>Play Again</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [resStyles.secondaryBtn, { backgroundColor: pressed ? colors.muted : colors.background, borderColor: colors.border }]}
          onPress={onBack}
        >
          <Ionicons name="arrow-back-outline" size={18} color={colors.foreground} />
          <Text style={[resStyles.secondaryBtnText, { color: colors.foreground }]}>Back to Gaming</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const resStyles = StyleSheet.create({
  container:  { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card:       { width: '100%', borderRadius: 24, borderWidth: 1, alignItems: 'center', padding: 28, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 14, elevation: 5 },
  emoji:      { fontSize: 52 },
  title:      { fontSize: 26, fontFamily: 'Inter_700Bold' },
  subject:    { fontSize: 14, fontFamily: 'Inter_400Regular' },
  scoreCircle:{ width: 120, height: 120, borderRadius: 60, borderWidth: 5, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  scoreNum:   { fontSize: 30, fontFamily: 'Inter_700Bold' },
  scoreSub:   { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  msg:        { fontSize: 15, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 22 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14, width: '100%', justifyContent: 'center', marginTop: 4 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  secondaryBtn:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14, borderWidth: 1, width: '100%', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});

// ── Main quiz screen ──────────────────────────────────────────────────────────
export default function QuizScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const nav     = useAppRouter();
  const { recordQuizAnswer } = useApp();

  const { subjectId, subjectName, categoryColor } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
    categoryColor?: string;
  }>();

  const accentColor = categoryColor ?? BRAND_NAVY;

  // ── State ─────────────────────────────────────────────────────────────────
  const [questions,     setQuestions]     = useState<QuizQuestion[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [qIndex,        setQIndex]        = useState(0);
  const [selectedIdx,   setSelectedIdx]   = useState<number | null>(null);
  const [answerState,   setAnswerState]   = useState<AnswerState>('idle');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [finished,      setFinished]      = useState(false);
  const [celebrating,   setCelebrating]   = useState(false);
  const autoAdvanceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load questions ────────────────────────────────────────────────────────
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setFinished(false);
    setQIndex(0);
    setSelectedIdx(null);
    setAnswerState('idle');
    setSessionCorrect(0);
    setCelebrating(false);

    const all = await fetchQuizQuestions(subjectId ?? '');
    // Proper Fisher-Yates shuffle for unbiased randomisation
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestions(shuffled.slice(0, MAX_QUESTIONS));
    setLoading(false);
  }, [subjectId]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // Cleanup auto-advance on unmount
  useEffect(() => () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); }, []);

  // ── Current question ──────────────────────────────────────────────────────
  const currentQ = questions[qIndex] ?? null;

  // ── Advance to next question ──────────────────────────────────────────────
  function advance() {
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null; }
    setCelebrating(false);
    setSelectedIdx(null);
    setAnswerState('idle');
    if (qIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQIndex((i) => i + 1);
    }
  }

  // ── Handle answer tap ─────────────────────────────────────────────────────
  function handleAnswer(idx: number) {
    if (answerState !== 'idle' || !currentQ) return;

    const correct = idx === currentQ.correctIndex;
    setSelectedIdx(idx);

    if (correct) {
      setAnswerState('correct');
      setSessionCorrect((c) => c + 1);
      setCelebrating(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      recordQuizAnswer(currentQ.id, true);
      // Auto-advance after 1.5 s
      autoAdvanceRef.current = setTimeout(() => { advance(); }, AUTO_ADVANCE_MS);
    } else {
      setAnswerState('wrong');
      setCelebrating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      recordQuizAnswer(currentQ.id, false);
      // Next button must be tapped manually
    }
  }

  // ── Skip (always available) ───────────────────────────────────────────────
  function handleSkipOrNext() {
    if (answerState === 'correct') return; // auto-advancing, ignore tap
    advance();
  }

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.loadingWrap, { backgroundColor: colors.background }]}>
        <StatusBar style="light" />
        <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: accentColor }]}>
          <Pressable onPress={() => nav.goBack()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Loading Quiz…</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <Ionicons name="hourglass-outline" size={44} color={accentColor} />
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.mutedForeground }}>
            Preparing questions for {subjectName}…
          </Text>
        </View>
      </View>
    );
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (finished) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: accentColor }]}>
          <Pressable onPress={() => nav.goBack()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Quiz Results</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{sessionCorrect}/{questions.length}</Text>
          </View>
        </View>
        <ResultsScreen
          correct={sessionCorrect}
          total={questions.length}
          subjectName={subjectName ?? ''}
          onPlayAgain={loadQuestions}
          onBack={() => nav.goBack()}
        />
      </View>
    );
  }

  if (!currentQ) return null;

  const optionLabels = ['A', 'B', 'C', 'D'];
  const progressPct  = ((qIndex + 1) / questions.length) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: accentColor }]}>
        <Pressable onPress={() => nav.goBack()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerSuper} numberOfLines={1}>{subjectName}</Text>
          <Text style={styles.headerTitle}>Quiz Mode</Text>
        </View>

        {/* Running score */}
        <View style={styles.scoreBadge}>
          <Ionicons name="star" size={11} color="#FFD700" />
          <Text style={styles.scoreBadgeText}>{sessionCorrect} pts</Text>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: accentColor }]} />
      </View>
      <View style={[styles.qCountRow, { backgroundColor: colors.muted }]}>
        <Text style={[styles.qCountText, { color: colors.mutedForeground }]}>
          Question {qIndex + 1} of {questions.length}
        </Text>
        {answerState === 'correct' && (
          <Text style={styles.autoAdvanceText}>Next question in 1.5s…</Text>
        )}
      </View>

      {/* ── Body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Question card */}
        <View style={[styles.questionCard, { backgroundColor: accentColor }]}>
          {/* Decorative circle */}
          <View style={styles.qDecorCircle} />
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {currentQ.options.map((opt, i) => (
            <OptionButton
              key={i}
              label={optionLabels[i]}
              index={i}
              optionText={opt}
              answerState={answerState}
              selectedIndex={selectedIdx}
              correctIndex={currentQ.correctIndex}
              onPress={() => handleAnswer(i)}
              disabled={answerState !== 'idle'}
            />
          ))}
        </View>

        {/* Explanation (shown after answering) */}
        {answerState !== 'idle' && currentQ.explanation && (
          <View style={[styles.explanationBox, { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
            <Ionicons name="bulb-outline" size={16} color="#2E7D32" />
            <Text style={styles.explanationText}>{currentQ.explanation}</Text>
          </View>
        )}

        {/* Next / Skip button */}
        <Pressable
          style={({ pressed }) => [
            styles.nextBtn,
            {
              backgroundColor:
                answerState === 'correct' ? '#2E7D32' :
                answerState === 'wrong'   ? accentColor :
                colors.muted,
              opacity: answerState === 'correct' ? 0.7 : pressed ? 0.88 : 1,
            },
          ]}
          onPress={handleSkipOrNext}
          disabled={answerState === 'correct'}
        >
          <Text
            style={[
              styles.nextBtnText,
              { color: answerState !== 'idle' ? '#FFF' : colors.mutedForeground },
            ]}
          >
            {answerState === 'idle'    ? 'Skip →' :
             answerState === 'wrong'   ? 'Next Question →' :
             'Moving to next…'}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Celebration overlay */}
      <CorrectOverlay visible={celebrating} />
      <CelebrationParticles visible={celebrating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  loadingWrap:  { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1 },
  headerSuper: {
    fontSize: 11, fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5,
  },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#FFF' },
  scoreBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10,
  },
  scoreBadgeText: { fontSize: 12.5, fontFamily: 'Inter_700Bold', color: '#FFF' },

  progressBar:   { height: 4 },
  progressFill:  { height: '100%' },
  qCountRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 7,
  },
  qCountText:     { fontSize: 12, fontFamily: 'Inter_500Medium' },
  autoAdvanceText:{ fontSize: 12, fontFamily: 'Inter_400Regular', color: '#2E7D32' },

  scroll:        { flex: 1 },
  scrollContent: { padding: 16, gap: 0 },

  questionCard: {
    borderRadius: 18, padding: 22, marginBottom: 18,
    minHeight: 100, justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 5,
    overflow: 'hidden', position: 'relative',
  },
  qDecorCircle: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)', right: -20, top: -20,
  },
  questionText: {
    fontSize: 17, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF',
    lineHeight: 26, zIndex: 1,
  },

  optionsSection: { marginBottom: 4 },

  explanationBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 14,
  },
  explanationText: {
    flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular',
    color: '#2E7D32', lineHeight: 19,
  },

  nextBtn: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 14, marginTop: 4,
  },
  nextBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
