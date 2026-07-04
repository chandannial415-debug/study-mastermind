import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Category } from '@/src/data/curriculum';

type Props = {
  category: Category;
  onPress: () => void;
};

export default function CategoryCard({ category, onPress }: Props) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: category.color + '33',
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.977 : 1 }],
          shadowColor: category.color,
        },
      ]}
      onPress={onPress}
      android_ripple={{ color: category.color + '22', borderless: false }}
    >
      {/* Left color accent bar */}
      <View style={[styles.accentBar, { backgroundColor: category.color }]} />

      {/* Icon circle */}
      <View style={[styles.iconWrap, { backgroundColor: category.lightBg }]}>
        <Ionicons name={category.iconName as any} size={28} color={category.color} />
      </View>

      {/* Text content */}
      <View style={styles.textWrap}>
        <Text style={[styles.name, { color: colors.cardForeground }]} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]} numberOfLines={2}>
          {category.subtitle}
        </Text>
      </View>

      {/* Right arrow */}
      <Ionicons name="chevron-forward" size={20} color={category.color} style={styles.arrow} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    marginHorizontal: 18,
    marginBottom: 14,
    paddingVertical: 18,
    paddingRight: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 14,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  arrow: {
    marginLeft: 6,
  },
});
