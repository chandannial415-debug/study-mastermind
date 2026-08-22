import React, { useEffect, useRef } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const SPLASH_BG = '#1A237E';
const SPLASH_ACCENT = '#FFA000';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo pops in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      // App name fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 350,
        delay: 100,
        useNativeDriver: true,
      }),
      // Tagline fades in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Badge fades in
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <StatusBar style="light" />

      {/* Background radial glow */}
      <View style={styles.glowCircle} />

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* App icon / logo */}
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          Matric Notes
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Class 10 Syllabus & Study Material
        </Animated.Text>

        {/* Feature badges */}
        <Animated.View style={[styles.badgeRow, { opacity: badgeOpacity }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📚 Offline PDFs</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🎮 Quiz Mode</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom footer */}
      <Animated.View style={[styles.footer, { opacity: taglineOpacity }]}>
        <View style={[styles.dot, { backgroundColor: SPLASH_ACCENT }]} />
        <Text style={styles.footerText}>All Boards • Class 10</Text>
        <View style={[styles.dot, { backgroundColor: SPLASH_ACCENT }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glowCircle: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#283593',
    top: '22%',
    alignSelf: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12.5,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});
