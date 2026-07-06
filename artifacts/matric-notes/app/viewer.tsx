import React from 'react';
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
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/src/context/AppContext';
import { useAppRouter } from '@/src/navigation';
import { getPdfViewUrl, hasPdf } from '@/src/data/pdfUrls';

export default function ViewerScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const nav     = useAppRouter();
  const { isOnline } = useApp();

  const { chapterId, chapterName, subjectName } = useLocalSearchParams<{
    chapterId:   string;
    chapterName: string;
    subjectName: string;
  }>();

  const topPad   = Platform.OS === 'web' ? 67 : insets.top;
  const botPad   = Platform.OS === 'web' ? 34 : insets.bottom;

  // ── Dynamic PDF URL from Google Drive ─────────────────────────────────────
  const pdfUrl      = getPdfViewUrl(chapterId ?? '');
  const pdfReady    = hasPdf(chapterId ?? '');

  async function handleOpenPdf() {
    if (!pdfUrl) {
      Alert.alert(
        'PDF Coming Soon',
        'This chapter\'s PDF is being uploaded to our servers. Check back soon!',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert('Cannot Open Link', 'Please ensure you have a browser installed on your device.');
      }
    } catch {
      Alert.alert('Error', 'Could not open the PDF link. Please try again later.');
    }
  }

  function handlePlayQuiz() {
    if (!isOnline) return;
    nav.goToGaming();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
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

        {/* Status badge */}
        <View style={[styles.offlineBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Ionicons name="checkmark-circle" size={14} color="#A5D6A7" />
          <Text style={styles.offlineBadgeText}>Downloaded — Available Offline</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PDF Viewer Panel ── */}
        <View style={[styles.viewerBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Toolbar */}
          <View style={[styles.viewerToolbar, { borderBottomColor: colors.border }]}>
            <View style={styles.toolbarLeft}>
              <Ionicons name="document-text" size={18} color="#1565C0" />
              <Text style={[styles.toolbarTitle, { color: colors.cardForeground }]}>Chapter Notes</Text>
            </View>
            {pdfReady ? (
              <View style={[styles.pdfReadyBadge, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="cloud-done-outline" size={13} color="#2E7D32" />
                <Text style={[styles.pdfReadyText, { color: '#2E7D32' }]}>PDF Ready</Text>
              </View>
            ) : (
              <View style={[styles.pdfReadyBadge, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="time-outline" size={13} color="#E65100" />
                <Text style={[styles.pdfReadyText, { color: '#E65100' }]}>Uploading Soon</Text>
              </View>
            )}
          </View>

          {/* PDF Page preview */}
          <View style={styles.pdfArea}>
            <View style={[styles.pdfPage, { backgroundColor: '#FAFAFA', borderColor: colors.border }]}>
              <View style={[styles.pageHeader, { backgroundColor: '#1A237E' }]}>
                <Text style={styles.pageHeaderText}>CLASS 10 — STUDY MINDSET — BSE ODISHA</Text>
              </View>

              <Text style={[styles.pageTitleText, { color: '#1A237E' }]}>{chapterName}</Text>
              <Text style={[styles.pageSubjectText, { color: '#546E7A' }]}>{subjectName}</Text>

              <View style={[styles.pageDivider, { backgroundColor: '#C5CAE9' }]} />

              {/* Content lines placeholder */}
              {[80, 95, 70, 88, 60, 75, 92, 65].map((w, i) => (
                <View key={i} style={[styles.textLine, { width: `${w}%` as any, backgroundColor: i === 0 ? '#B0BEC5' : '#E0E0E0' }]} />
              ))}
              <View style={[styles.subHeadingLine, { backgroundColor: '#B0BEC5', width: '52%' }]} />
              {[88, 72, 90, 60, 80, 76, 93].map((w, i) => (
                <View key={`b${i}`} style={[styles.textLine, { width: `${w}%` as any, backgroundColor: '#E0E0E0' }]} />
              ))}
            </View>
          </View>

          {/* Open PDF button */}
          <Pressable
            style={({ pressed }) => [
              styles.openPdfBtn,
              {
                backgroundColor: pressed
                  ? (pdfReady ? '#1B5E20' : '#37474F')
                  : (pdfReady ? '#2E7D32' : '#546E7A'),
                margin: 14, marginTop: 4,
              },
            ]}
            onPress={handleOpenPdf}
          >
            <Ionicons name={pdfReady ? 'open-outline' : 'cloud-upload-outline'} size={18} color="#FFF" />
            <Text style={styles.openPdfBtnText}>
              {pdfReady ? 'Open Full PDF in Browser' : 'PDF Coming Soon — Tap to Check'}
            </Text>
            {pdfReady && <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />}
          </Pressable>
        </View>

        {/* ── Offline status card ── */}
        <View style={[styles.statusCard, { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
          <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusTitle}>Saved for Offline Study</Text>
            <Text style={styles.statusSub}>
              This chapter is stored on your device. Open it anytime without internet.
            </Text>
          </View>
        </View>

        {/* ── Drive URL info ── */}
        {!pdfReady && (
          <View style={[styles.driveInfoCard, { backgroundColor: '#E3F2FD', borderColor: '#90CAF9' }]}>
            <Ionicons name="information-circle-outline" size={20} color="#1565C0" />
            <Text style={[styles.driveInfoText, { color: '#0D47A1' }]}>
              The full PDF for this chapter will be uploaded to Google Drive shortly. Tap the button above when it's ready to open directly in your browser.
            </Text>
          </View>
        )}

        {/* ── Gaming Mode card ── */}
        <Pressable
          style={({ pressed }) => [
            styles.gamingCard,
            {
              backgroundColor: isOnline
                ? (pressed ? '#BBDEFB' : '#E3F2FD')
                : '#FFF3E0',
              borderColor: isOnline ? '#90CAF9' : '#FFCC80',
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          onPress={handlePlayQuiz}
          disabled={!isOnline}
        >
          <Ionicons
            name="game-controller-outline"
            size={28}
            color={isOnline ? '#1565C0' : '#E65100'}
          />
          <View style={styles.gamingTextWrap}>
            <Text style={[styles.gamingTitle, { color: isOnline ? '#1565C0' : '#E65100' }]}>
              {isOnline ? 'Quiz Revision Mode' : 'Quiz Mode Unavailable'}
            </Text>
            <Text style={[styles.gamingSub, { color: isOnline ? '#1565C0' : '#BF360C' }]}>
              {isOnline
                ? 'Test your knowledge with interactive MCQ quizzes for this subject.'
                : 'Internet required for Gaming Mode. Connect to play.'}
            </Text>
          </View>
          {isOnline ? (
            <View style={styles.playBtn}>
              <Ionicons name="play" size={14} color="#FFF" />
              <Text style={styles.playBtnText}>Play</Text>
            </View>
          ) : (
            <Ionicons name="lock-closed" size={22} color="#E65100" />
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  headerTextWrap: { flex: 1 },
  headerSuper: {
    fontSize: 12, fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.6)', marginBottom: 3,
  },
  headerTitle: {
    fontSize: 17, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF', lineHeight: 23,
  },
  offlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20,
  },
  offlineBadgeText: {
    fontSize: 12, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.9)',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14 },

  viewerBox: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  viewerToolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1,
  },
  toolbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolbarTitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  pdfReadyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8,
  },
  pdfReadyText: { fontSize: 11.5, fontFamily: 'Inter_600SemiBold' },

  pdfArea: { padding: 14 },
  pdfPage: {
    borderRadius: 10, borderWidth: 1, overflow: 'hidden', paddingBottom: 20,
  },
  pageHeader: {
    paddingVertical: 10, paddingHorizontal: 16,
    alignItems: 'center', marginBottom: 16,
  },
  pageHeaderText: {
    fontSize: 9, fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.85)', letterSpacing: 1.2,
  },
  pageTitleText: {
    fontSize: 15, fontFamily: 'Inter_700Bold', textAlign: 'center',
    paddingHorizontal: 16, lineHeight: 22,
  },
  pageSubjectText: {
    fontSize: 11.5, fontFamily: 'Inter_400Regular', textAlign: 'center',
    marginTop: 4, marginBottom: 12,
  },
  pageDivider: { height: 1, marginHorizontal: 16, marginBottom: 12 },
  textLine: { height: 9, borderRadius: 4, marginHorizontal: 16, marginBottom: 7 },
  subHeadingLine: { height: 11, borderRadius: 4, marginHorizontal: 16, marginTop: 10, marginBottom: 8 },

  openPdfBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 10,
  },
  openPdfBtnText: {
    color: '#FFF', fontSize: 13.5, fontFamily: 'Inter_600SemiBold', flex: 1, textAlign: 'center',
  },

  statusCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, borderRadius: 12, borderWidth: 1.5,
  },
  statusTextWrap: { flex: 1, gap: 3 },
  statusTitle: { fontSize: 14.5, fontFamily: 'Inter_600SemiBold', color: '#2E7D32' },
  statusSub:   { fontSize: 12.5, fontFamily: 'Inter_400Regular', color: '#388E3C', lineHeight: 18 },

  driveInfoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 12, borderRadius: 12, borderWidth: 1,
  },
  driveInfoText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19 },

  gamingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, borderWidth: 1.5,
  },
  gamingTextWrap: { flex: 1, gap: 3 },
  gamingTitle:    { fontSize: 14.5, fontFamily: 'Inter_600SemiBold' },
  gamingSub:      { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 17 },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#1565C0', paddingVertical: 7, paddingHorizontal: 14, borderRadius: 8,
  },
  playBtnText: { color: '#FFF', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
