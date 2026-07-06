import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp, TOTAL_CHAPTERS } from '@/src/context/AppContext';

// ── Circular progress ring (lightweight, no external library) ────────────────
function ProgressRing({
  pct,
  size,
  stroke,
  color,
  label,
  sublabel,
}: {
  pct: number;
  size: number;
  stroke: number;
  color: string;
  label: string;
  sublabel: string;
}) {
  const animPct = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animPct, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const radius   = (size - stroke) / 2;
  const circumf  = 2 * Math.PI * radius;

  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      {/* SVG-less ring using a rotated arc trick with two View clips */}
      <View
        style={{
          width:  size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: color + '28',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Filled arc approximation with a tinted overlay */}
        <Animated.View
          style={{
            position: 'absolute',
            top:  0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: color,
            borderTopColor: animPct.interpolate({
              inputRange: [0, 25, 50, 75, 100],
              outputRange: [
                'transparent',
                color,
                color,
                color,
                color,
              ],
            }),
            borderRightColor: animPct.interpolate({
              inputRange: [0, 25, 50, 75, 100],
              outputRange: [
                'transparent',
                'transparent',
                color,
                color,
                color,
              ],
            }),
            borderBottomColor: animPct.interpolate({
              inputRange: [0, 25, 50, 75, 100],
              outputRange: [
                'transparent',
                'transparent',
                'transparent',
                color,
                color,
              ],
            }),
            borderLeftColor: color + '28',
          }}
        />
        <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color }}>
          {Math.round(pct)}%
        </Text>
      </View>
      <Text style={{ fontSize: 12.5, fontFamily: 'Inter_600SemiBold', color, textAlign: 'center' }}>
        {label}
      </Text>
      <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: '#888', textAlign: 'center', maxWidth: 90 }}>
        {sublabel}
      </Text>
    </View>
  );
}

// ── Linear bar ───────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const animW = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animW, { toValue: pct, duration: 800, useNativeDriver: false }).start();
  }, [pct]);

  return (
    <View style={barStyles.track}>
      <Animated.View
        style={[
          barStyles.fill,
          {
            backgroundColor: color,
            width: animW.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 4 },
});

// ── Motivational message ──────────────────────────────────────────────────────
function getPredictionMessage(board: number, study: number, quiz: number): string {
  if (board >= 85) return `🎯 Outstanding! You are on track to score ${board}%+ in your Board Exams!`;
  if (board >= 70) return `🔥 Excellent progress! You are predicted to score ${board}% — above average!`;
  if (board >= 55) return `✨ Good work! Keep going — your predicted score is ${board}%. Download more chapters to rise further!`;
  if (board >= 35) return `📚 You are building your foundation! Your prediction is ${board}%. Complete more chapters & quizzes!`;
  return `🚀 Great start! Every chapter you download improves your ${board}% prediction. Let's go!`;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProgressDashboard() {
  const colors  = useColors();
  const {
    downloadedChapters, quizStats,
    studyProgressPct, quizScorePct, boardPredictionPct,
  } = useApp();

  const studyPct = Math.round(studyProgressPct);
  const quizPct  = Math.round(quizScorePct);
  const board    = boardPredictionPct;

  const APP_LINK = 'https://play.google.com/store/apps/details?id=com.studymindset.app';

  async function handleWhatsAppShare() {
    const msg =
      `Hey! 👋 I'm preparing for Board Exams on the *Study Mindset* App! 📚\n\n` +
      `📖 Syllabus completed: *${studyPct}%* (${downloadedChapters.size}/${TOTAL_CHAPTERS} chapters)\n` +
      `🎮 Quiz score: *${quizPct}%* (${quizStats.correct}/${quizStats.attempted} correct)\n` +
      `🎯 Predicted Board Exam Score: *${board}%*\n\n` +
      `Check your own score → Download *Study Mindset* now:\n${APP_LINK}`;

    try {
      await Share.share({ message: msg, title: 'Study Mindset — My Progress' });
    } catch {
      // User cancelled or platform-specific failure — silently ignore
    }
  }

  const predMsg = getPredictionMessage(board, studyPct, quizPct);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.headerIconWrap, { backgroundColor: '#1A237E18' }]}>
          <Ionicons name="analytics-outline" size={20} color="#1A237E" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Your Progress Dashboard
          </Text>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
            BSE Odisha Class 10 — Study Mindset
          </Text>
        </View>
      </View>

      {/* Ring metrics */}
      <View style={styles.ringsRow}>
        <ProgressRing
          pct={studyPct}
          size={80}
          stroke={7}
          color="#1565C0"
          label="Study"
          sublabel={`${downloadedChapters.size}/${TOTAL_CHAPTERS} chapters`}
        />
        <ProgressRing
          pct={quizPct}
          size={80}
          stroke={7}
          color="#6A1B9A"
          label="Quiz Score"
          sublabel={`${quizStats.correct}/${Math.max(quizStats.attempted, 1)} correct`}
        />
        {/* Board prediction — bigger ring */}
        <View style={{ alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: '#FFF8E1',
              borderWidth: 3,
              borderColor: board >= 70 ? '#2E7D32' : board >= 50 ? '#FFA000' : '#E65100',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#888', marginBottom: 1 }}>
              BOARD
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Inter_700Bold',
                color: board >= 70 ? '#2E7D32' : board >= 50 ? '#FFA000' : '#E65100',
              }}
            >
              {board}%
            </Text>
          </View>
          <Text style={{ fontSize: 12.5, fontFamily: 'Inter_600SemiBold', color: board >= 70 ? '#2E7D32' : '#FFA000', textAlign: 'center' }}>
            Prediction
          </Text>
          <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: '#888', textAlign: 'center', maxWidth: 90 }}>
            Study 45% + Quiz 55%
          </Text>
        </View>
      </View>

      {/* Linear bars */}
      <View style={styles.barsSection}>
        <View style={styles.barRow}>
          <View style={styles.barLabelRow}>
            <Ionicons name="book-outline" size={13} color="#1565C0" />
            <Text style={[styles.barLabel, { color: colors.foreground }]}>Study Progress</Text>
            <Text style={[styles.barPct, { color: '#1565C0' }]}>{studyPct}%</Text>
          </View>
          <ProgressBar pct={studyPct} color="#1565C0" />
        </View>

        <View style={styles.barRow}>
          <View style={styles.barLabelRow}>
            <Ionicons name="game-controller-outline" size={13} color="#6A1B9A" />
            <Text style={[styles.barLabel, { color: colors.foreground }]}>Quiz Accuracy</Text>
            <Text style={[styles.barPct, { color: '#6A1B9A' }]}>{quizPct}%</Text>
          </View>
          <ProgressBar pct={quizPct} color="#6A1B9A" />
        </View>
      </View>

      {/* Prediction message */}
      <View
        style={[
          styles.predBox,
          {
            backgroundColor: board >= 70 ? '#E8F5E9' : board >= 50 ? '#FFF8E1' : '#FBE9E7',
            borderColor:     board >= 70 ? '#A5D6A7' : board >= 50 ? '#FFE082' : '#FFAB91',
          },
        ]}
      >
        <Text
          style={[
            styles.predText,
            { color: board >= 70 ? '#2E7D32' : board >= 50 ? '#E65100' : '#BF360C' },
          ]}
        >
          {predMsg}
        </Text>
      </View>

      {/* WhatsApp Share button */}
      <TouchableOpacity
        style={styles.shareBtn}
        onPress={handleWhatsAppShare}
        activeOpacity={0.82}
      >
        <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
        <Text style={styles.shareBtnText}>Share My Progress on WhatsApp</Text>
      </TouchableOpacity>

      {/* Footnote */}
      <Text style={[styles.footnote, { color: colors.mutedForeground }]}>
        Prediction = Study Progress × 45% + Quiz Score × 55%. Download more chapters and play quizzes to improve!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15.5,
    fontFamily: 'Inter_600SemiBold',
  },
  cardSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  barsSection: { gap: 12 },
  barRow:      { gap: 6 },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  barLabel: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
  },
  barPct: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
  },
  predBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  predText: {
    fontSize: 13.5,
    fontFamily: 'Inter_500Medium',
    lineHeight: 20,
    textAlign: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 20,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 5,
  },
  shareBtnText: {
    fontSize: 14.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  footnote: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
});
