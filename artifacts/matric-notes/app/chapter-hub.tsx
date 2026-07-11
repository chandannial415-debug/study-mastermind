import React, { useState } from 'react';
import {
  Alert,
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
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/src/context/AppContext';
import { useAppRouter } from '@/src/navigation';
import AdModal from '@/src/components/AdModal';

type FolderDef = {
  id: 'full' | 'notebook' | 'mcq' | 'pyq' | 'gaming';
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  requiresOnline: boolean;
};

const FOLDERS: FolderDef[] = [
  {
    id: 'full',
    title: 'Full Book',
    subtitle: 'View or download the complete textbook chapter PDF',
    icon: 'book-outline',
    color: '#1565C0',
    requiresOnline: false, // gated by ad only if not yet downloaded
  },
  {
    id: 'notebook',
    title: 'Small Notebook',
    subtitle: 'Quick revision notes & summaries for this chapter',
    icon: 'reader-outline',
    color: '#6A1B9A',
    requiresOnline: false,
  },
  {
    id: 'mcq',
    title: 'MCQ',
    subtitle: 'Practice 20 objective questions for this chapter',
    icon: 'checkmark-done-circle-outline',
    color: '#2E7D32',
    requiresOnline: true,
  },
  {
    id: 'pyq',
    title: 'Previous Year Questions',
    subtitle: 'Practice real past board exam questions',
    icon: 'archive-outline',
    color: '#E65100',
    requiresOnline: false,
  },
  {
    id: 'gaming',
    title: 'Gaming Mode',
    subtitle: 'Fun, gamified quiz challenge for this chapter',
    icon: 'game-controller-outline',
    color: '#AD1457',
    requiresOnline: true,
  },
];

export default function ChapterHubScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const nav    = useAppRouter();
  const { isOnline, isDownloaded, markDownloaded } = useApp();

  const { chapterId, chapterName, subjectId, subjectName, categoryColor } =
    useLocalSearchParams<{
      chapterId:     string;
      chapterName:   string;
      subjectId:     string;
      subjectName:   string;
      categoryColor: string;
    }>();

  const accentColor = categoryColor ?? '#1565C0';
  const downloaded  = isDownloaded(chapterId ?? '');

  const [adModalVisible, setAdModalVisible] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function openViewer() {
    nav.goToViewer({
      chapterId:   chapterId ?? '',
      chapterName: chapterName ?? '',
      subjectName: subjectName ?? '',
    });
  }

  function handleFullBookPress() {
    if (downloaded) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      openViewer();
      return;
    }
    if (!isOnline) {
      Alert.alert(
        'No Internet Connection',
        'This chapter has not been downloaded yet. Please connect to the internet and download it first.',
        [{ text: 'OK' }],
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAdModalVisible(true);
  }

  function handleDownloadComplete() {
    markDownloaded(chapterId ?? '');
    setAdModalVisible(false);
    openViewer();
  }

  function handleNotebookPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nav.goToNotes({
      chapterId:   chapterId ?? '',
      chapterName: chapterName ?? '',
      subjectName: subjectName ?? '',
    });
  }

  function handlePyqPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nav.goToPyq({
      chapterId:     chapterId ?? '',
      chapterName:   chapterName ?? '',
      subjectName:   subjectName ?? '',
      categoryColor: accentColor,
    });
  }

  function handleMcqPress() {
    if (!isOnline) {
      Alert.alert('Internet Required', 'MCQ practice needs an active internet connection.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.goToQuiz({
      subjectId:     subjectId ?? '',
      subjectName:   subjectName ?? '',
      categoryColor: accentColor,
      chapterId:     chapterId ?? '',
      chapterName:   chapterName ?? '',
      mode:          'mcq',
    });
  }

  function handleGamingPress() {
    if (!isOnline) {
      Alert.alert('Internet Required', 'Gaming Mode needs an active internet connection.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.goToQuiz({
      subjectId:     subjectId ?? '',
      subjectName:   subjectName ?? '',
      categoryColor: accentColor,
      chapterId:     chapterId ?? '',
      chapterName:   chapterName ?? '',
      mode:          'gaming',
    });
  }

  function handleFolderPress(folder: FolderDef) {
    switch (folder.id) {
      case 'full':     return handleFullBookPress();
      case 'notebook': return handleNotebookPress();
      case 'mcq':      return handleMcqPress();
      case 'pyq':      return handlePyqPress();
      case 'gaming':   return handleGamingPress();
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: accentColor }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => nav.goBack()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerSuper} numberOfLines={1}>{subjectName}</Text>
            <Text style={styles.headerTitle} numberOfLines={2}>{chapterName}</Text>
          </View>
        </View>

        {downloaded && (
          <View style={styles.downloadedBadge}>
            <Ionicons name="checkmark-circle" size={13} color="#A5D6A7" />
            <Text style={styles.downloadedBadgeText}>Downloaded — offline ready</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          CHOOSE HOW YOU WANT TO STUDY
        </Text>

        {FOLDERS.map((folder) => {
          const locked = folder.requiresOnline && !isOnline;
          return (
            <Pressable
              key={folder.id}
              onPress={() => handleFolderPress(folder)}
              style={({ pressed }) => [
                styles.folderCard,
                {
                  backgroundColor: colors.card,
                  borderColor: pressed ? folder.color : colors.border,
                  opacity: locked ? 0.6 : 1,
                },
              ]}
              android_ripple={{ color: folder.color + '18' }}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${folder.color}18` }]}>
                <Ionicons name={folder.icon} size={26} color={folder.color} />
              </View>

              <View style={styles.folderText}>
                <View style={styles.folderTitleRow}>
                  <Text style={[styles.folderTitle, { color: colors.foreground }]}>
                    {folder.title}
                  </Text>
                  {folder.id === 'full' && downloaded && (
                    <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
                      <Text style={[styles.badgeText, { color: '#2E7D32' }]}>Ready</Text>
                    </View>
                  )}
                  {locked && (
                    <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
                      <Text style={[styles.badgeText, { color: '#E65100' }]}>Needs Internet</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.folderSubtitle, { color: colors.mutedForeground }]}>
                  {folder.subtitle}
                </Text>
              </View>

              <Ionicons
                name={locked ? 'lock-closed-outline' : 'chevron-forward'}
                size={20}
                color={locked ? '#E65100' : colors.mutedForeground}
              />
            </Pressable>
          );
        })}

        <View style={[styles.hintBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="bulb-outline" size={18} color="#FFA000" />
          <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
            Full Book requires a short ad to unlock offline download. Small Notebook and
            Previous Year Questions work offline. MCQ and Gaming Mode need internet.
          </Text>
        </View>
      </ScrollView>

      <AdModal
        visible={adModalVisible}
        chapterName={chapterName ?? ''}
        onClose={() => setAdModalVisible(false)}
        onDownloadComplete={handleDownloadComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 18, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  headerTextWrap: { flex: 1 },
  headerSuper: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.65)', marginBottom: 3 },
  headerTitle: { fontSize: 19, fontFamily: 'Inter_700Bold', color: '#FFFFFF', lineHeight: 25 },
  downloadedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20,
  },
  downloadedBadgeText: { fontSize: 11.5, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.9)' },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 18 },
  sectionLabel: {
    fontSize: 10.5, fontFamily: 'Inter_600SemiBold', letterSpacing: 1.1,
    marginHorizontal: 18, marginBottom: 12,
  },

  folderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 16, marginBottom: 12,
    padding: 14, borderRadius: 14, borderWidth: 1.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  iconWrap: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  folderText: { flex: 1, gap: 3 },
  folderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  folderTitle: { fontSize: 15.5, fontFamily: 'Inter_600SemiBold' },
  folderSubtitle: { fontSize: 12.5, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  badge: { borderRadius: 20, paddingVertical: 2, paddingHorizontal: 8 },
  badgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },

  hintBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginHorizontal: 16, marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 1,
  },
  hintText: { flex: 1, fontSize: 12.5, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
