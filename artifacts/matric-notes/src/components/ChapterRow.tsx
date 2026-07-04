import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Chapter } from '@/src/data/curriculum';

type Props = {
  chapter: Chapter;
  isDownloaded: boolean;
  onPress: () => void;
};

export default function ChapterRow({ chapter, isDownloaded, onPress }: Props) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.muted : colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      android_ripple={{ color: colors.primary + '18', borderless: false }}
    >
      {/* Folder Icon */}
      <View style={styles.folderWrap}>
        <Ionicons
          name={isDownloaded ? 'folder-open' : 'folder'}
          size={32}
          color={isDownloaded ? '#2E7D32' : '#FFA000'}
        />
      </View>

      {/* Chapter name */}
      <View style={styles.nameWrap}>
        <Text
          style={[styles.chapterName, { color: colors.cardForeground }]}
          numberOfLines={2}
        >
          {chapter.name}
        </Text>
        {isDownloaded && (
          <View style={styles.offlineBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#2E7D32" />
            <Text style={styles.offlineBadgeText}>Available Offline</Text>
          </View>
        )}
      </View>

      {/* Download / Open button */}
      <Pressable
        style={({ pressed }) => [
          styles.actionBtn,
          {
            backgroundColor: isDownloaded
              ? (pressed ? '#1B5E20' : '#2E7D32')
              : (pressed ? '#0D47A1' : '#1565C0'),
          },
        ]}
        onPress={onPress}
        hitSlop={8}
      >
        <Ionicons
          name={isDownloaded ? 'book-outline' : 'cloud-download-outline'}
          size={16}
          color="#FFFFFF"
        />
        <Text style={styles.actionBtnText}>
          {isDownloaded ? 'Open' : 'Download'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  folderWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nameWrap: {
    flex: 1,
    marginRight: 8,
    gap: 4,
  },
  chapterName: {
    fontSize: 14.5,
    fontFamily: 'Inter_500Medium',
    lineHeight: 20,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  offlineBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#2E7D32',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 90,
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});
