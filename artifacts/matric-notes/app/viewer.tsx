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
import { useApp } from '@/src/context/AppContext';

export default function ViewerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chapterId, chapterName, subjectName } = useLocalSearchParams<{
    chapterId: string;
    chapterName: string;
    subjectName: string;
  }>();
  const { isOnline } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerSuper} numberOfLines={1}>
              {subjectName}
            </Text>
            <Text style={styles.headerTitle} numberOfLines={2}>
              {chapterName}
            </Text>
          </View>
        </View>

        {/* Offline badge */}
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
        {/* PDF Viewer Placeholder */}
        <View style={[styles.viewerBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Toolbar */}
          <View style={[styles.viewerToolbar, { borderBottomColor: colors.border }]}>
            <View style={styles.toolbarLeft}>
              <Ionicons name="document-text" size={18} color="#1565C0" />
              <Text style={[styles.toolbarTitle, { color: colors.cardForeground }]}>
                PDF Viewer
              </Text>
            </View>
            <View style={styles.toolbarRight}>
              <Pressable style={styles.toolbarBtn} hitSlop={8}>
                <Ionicons name="remove" size={18} color={colors.mutedForeground} />
              </Pressable>
              <Text style={[styles.toolbarPage, { color: colors.mutedForeground }]}>1 / 1</Text>
              <Pressable style={styles.toolbarBtn} hitSlop={8}>
                <Ionicons name="add" size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>

          {/* PDF content placeholder */}
          <View style={styles.pdfArea}>
            <View style={[styles.pdfPage, { backgroundColor: '#FAFAFA', borderColor: colors.border }]}>
              {/* Page header */}
              <View style={[styles.pageHeader, { backgroundColor: '#1A237E' }]}>
                <Text style={styles.pageHeaderText}>CLASS 10 — STUDY NOTES</Text>
              </View>

              {/* Chapter title on page */}
              <Text style={[styles.pageTitleText, { color: '#1A237E' }]}>
                {chapterName}
              </Text>
              <Text style={[styles.pageSubjectText, { color: '#546E7A' }]}>
                {subjectName}
              </Text>

              {/* Divider */}
              <View style={[styles.pageDivider, { backgroundColor: '#C5CAE9' }]} />

              {/* Placeholder lines */}
              {[80, 95, 70, 88, 60, 75, 92, 65].map((w, i) => (
                <View
                  key={i}
                  style={[
                    styles.textLine,
                    {
                      width: `${w}%` as any,
                      backgroundColor: i === 0 ? '#B0BEC5' : '#E0E0E0',
                    },
                  ]}
                />
              ))}

              {/* Placeholder sub-heading */}
              <View style={[styles.subHeadingLine, { backgroundColor: '#B0BEC5', width: '50%' }]} />

              {[88, 72, 90, 60, 80].map((w, i) => (
                <View
                  key={`b${i}`}
                  style={[
                    styles.textLine,
                    { width: `${w}%` as any, backgroundColor: '#E0E0E0' },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Status card */}
        <View style={[styles.statusCard, { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
          <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusTitle}>Saved for Offline Study</Text>
            <Text style={styles.statusSub}>
              This PDF is stored on your device. Open it anytime without internet.
            </Text>
          </View>
        </View>

        {/* Gaming mode card */}
        <View
          style={[
            styles.gamingCard,
            {
              backgroundColor: isOnline ? '#E3F2FD' : '#FFF3E0',
              borderColor: isOnline ? '#90CAF9' : '#FFCC80',
            },
          ]}
        >
          <Ionicons
            name={isOnline ? 'game-controller-outline' : 'game-controller-outline'}
            size={28}
            color={isOnline ? '#1565C0' : '#E65100'}
          />
          <View style={styles.gamingTextWrap}>
            <Text
              style={[
                styles.gamingTitle,
                { color: isOnline ? '#1565C0' : '#E65100' },
              ]}
            >
              {isOnline ? 'Gaming / Quiz Revision Mode' : 'Gaming Mode Unavailable'}
            </Text>
            <Text
              style={[
                styles.gamingSub,
                { color: isOnline ? '#1565C0' : '#BF360C' },
              ]}
            >
              {isOnline
                ? 'Test your knowledge with interactive quizzes for this chapter.'
                : 'Internet required for Gaming Mode. Connect to the internet to play.'}
            </Text>
          </View>
          {isOnline && (
            <Pressable
              style={({ pressed }) => [
                styles.gamingBtn,
                { backgroundColor: pressed ? '#0D47A1' : '#1565C0' },
              ]}
            >
              <Ionicons name="play" size={14} color="#FFF" />
              <Text style={styles.gamingBtnText}>Play</Text>
            </Pressable>
          )}
          {!isOnline && (
            <Ionicons name="lock-closed" size={22} color="#E65100" />
          )}
        </View>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerTextWrap: { flex: 1 },
  headerSuper: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    lineHeight: 23,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  offlineBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14 },
  viewerBox: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  viewerToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  toolbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolbarTitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  toolbarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolbarBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarPage: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  pdfArea: { padding: 14 },
  pdfPage: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  pageHeader: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  pageHeaderText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.4,
  },
  pageTitleText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  pageSubjectText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  pageDivider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  textLine: {
    height: 9,
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  subHeadingLine: {
    height: 11,
    borderRadius: 4,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  statusTextWrap: { flex: 1, gap: 3 },
  statusTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#2E7D32',
  },
  statusSub: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: '#388E3C',
    lineHeight: 18,
  },
  gamingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  gamingTextWrap: { flex: 1, gap: 3 },
  gamingTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_600SemiBold',
  },
  gamingSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  gamingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  gamingBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});
