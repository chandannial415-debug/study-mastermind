/**
 * Study Mindset — Typography Scale
 * Paired font sizes and line heights for consistent text hierarchy.
 * Fonts loaded: Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold
 */

export const fontFamily = {
  regular:  'Inter_400Regular',
  medium:   'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold:     'Inter_700Bold',
} as const;

export const fontSize = {
  /** Tiny labels, badges */    xs:   11,
  /** Captions, tags */         sm:   12.5,
  /** Body, descriptions */     md:   14,
  /** Sub-headings */           lg:   16,
  /** Section headers */        xl:   18,
  /** Screen titles */          xxl:  22,
  /** Hero / splash */          hero: 28,
} as const;

export const lineHeight = {
  tight:  1.25,
  normal: 1.45,
  loose:  1.65,
} as const;

/** Pre-composed text style objects */
export const textStyles = {
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
    letterSpacing: 1.2,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.45,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.6,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
  },
  subheading: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
  },
} as const;
