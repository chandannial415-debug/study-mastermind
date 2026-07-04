import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/src/context/AppContext';
import CategoryCard from '@/src/components/CategoryCard';
import { CATEGORIES } from '@/src/data/curriculum';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isOnline, downloadedChapters } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerGreeting}>Welcome, Student</Text>
            <Text style={styles.headerTitle}>Matric Notes</Text>
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
              style={[
                styles.statusText,
                { color: isOnline ? '#2E7D32' : '#E65100' },
              ]}
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
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="document-text-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>16</Text>
            <Text style={styles.statLabel}>Subjects</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          SELECT A CATEGORY
        </Text>

        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onPress={() =>
              router.push({
                pathname: '/subjects',
                params: { categoryId: cat.id, categoryName: cat.name },
              })
            }
          />
        ))}

        {/* Info box */}
        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Download chapters once to study completely offline. Watch a short ad to unlock each PDF.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 20,
    paddingBottom: 22,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 18,
    marginTop: 8,
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
