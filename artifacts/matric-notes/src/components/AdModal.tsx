import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import * as Haptics from 'expo-haptics';

type Phase = 'loading' | 'ad' | 'success';

type Props = {
  visible: boolean;
  chapterName: string;
  onClose: () => void;
  onDownloadComplete: () => void;
};

const AD_DURATION = 6; // seconds to "watch" the ad

export default function AdModal({ visible, chapterName, onClose, onDownloadComplete }: Props) {
  const colors = useColors();
  const [phase, setPhase] = useState<Phase>('loading');
  const [countdown, setCountdown] = useState(AD_DURATION);

  // Refs for all timers/animations so we can cancel on close
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const progressAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const isMountedRef = useRef(false);

  // Full cleanup — cancels all in-flight timers and animations
  function resetAll() {
    if (loadTimerRef.current) { clearTimeout(loadTimerRef.current); loadTimerRef.current = null; }
    if (countdownTimerRef.current) { clearTimeout(countdownTimerRef.current); countdownTimerRef.current = null; }
    if (pulseLoopRef.current) { pulseLoopRef.current.stop(); pulseLoopRef.current = null; }
    if (progressAnimRef.current) { progressAnimRef.current.stop(); progressAnimRef.current = null; }
    pulseAnim.setValue(1);
    progressAnim.setValue(0);
    fadeAnim.setValue(0);
  }

  // Reset & start when modal opens; full cleanup when it closes
  useEffect(() => {
    if (visible) {
      isMountedRef.current = true;
      // Reset to loading phase
      setPhase('loading');
      setCountdown(AD_DURATION);
      progressAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      // Phase 1: loading for 1.8 s
      loadTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setPhase('ad');
        // Animate progress bar over AD_DURATION seconds
        const anim = Animated.timing(progressAnim, {
          toValue: 1,
          duration: AD_DURATION * 1000,
          useNativeDriver: false,
        });
        progressAnimRef.current = anim;
        anim.start();
      }, 1800);
    } else {
      // Modal just closed — kill everything immediately
      isMountedRef.current = false;
      resetAll();
      // Hard reset state for next open
      setPhase('loading');
      setCountdown(AD_DURATION);
    }

    return () => {
      // Cleanup if component unmounts while visible
      isMountedRef.current = false;
      resetAll();
    };
  }, [visible]);

  // Countdown tick — only runs while visible and in 'ad' phase
  useEffect(() => {
    if (!visible || phase !== 'ad') return;

    if (countdown === 0) {
      setPhase('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    countdownTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setCountdown((c) => c - 1);
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [visible, phase, countdown]);

  // Pulse animation — only while visible and loading
  useEffect(() => {
    if (!visible || phase !== 'loading') return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    pulseLoopRef.current = loop;
    loop.start();

    return () => {
      loop.stop();
      pulseLoopRef.current = null;
      pulseAnim.setValue(1);
    };
  }, [visible, phase]);

  // Unified dismiss — handles both early close and post-success open
  function handleDismiss() {
    if (phase === 'success') {
      onDownloadComplete();
    }
    onClose();
    // resetAll() will be called by the visible=false useEffect
  }

  // Android back button handler — block during mandatory ad watch
  function handleRequestClose() {
    if (phase === 'ad') return; // cannot close during ad
    onClose();
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleRequestClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.card, opacity: fadeAnim },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              {phase === 'success' ? 'Download Complete!' : 'Download for Offline Study'}
            </Text>
            {phase === 'success' && (
              <Pressable onPress={handleDismiss} hitSlop={12} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>

          {/* Body */}
          <View style={styles.body}>
            {phase === 'loading' && (
              <>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Ionicons name="film-outline" size={64} color="#1565C0" />
                </Animated.View>
                <Text style={[styles.phaseTitle, { color: colors.foreground }]}>
                  Loading Ad...
                </Text>
                <Text style={[styles.phaseSubtitle, { color: colors.mutedForeground }]}>
                  Please wait while we prepare your ad
                </Text>
              </>
            )}

            {phase === 'ad' && (
              <>
                <View style={[styles.adBox, { backgroundColor: '#E3F2FD', borderColor: '#90CAF9' }]}>
                  <Ionicons name="megaphone-outline" size={40} color="#1565C0" />
                  <Text style={styles.adLabel}>ADVERTISEMENT</Text>
                  <Text style={styles.adTagline}>Study Smart. Learn More. Score Higher!</Text>
                </View>

                <Text style={[styles.phaseTitle, { color: colors.foreground, marginTop: 16 }]}>
                  Watch full ad to unlock download
                </Text>

                {/* Progress bar */}
                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: '#1565C0',
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>

                <Text style={[styles.countdown, { color: colors.mutedForeground }]}>
                  {countdown}s remaining
                </Text>
              </>
            )}

            {phase === 'success' && (
              <>
                <View style={styles.successCircle}>
                  <Ionicons name="checkmark-circle" size={72} color="#2E7D32" />
                </View>
                <Text style={[styles.phaseTitle, { color: '#2E7D32' }]}>
                  Ready for Offline Study!
                </Text>
                <Text
                  style={[styles.phaseSubtitle, { color: colors.mutedForeground }]}
                  numberOfLines={2}
                >
                  {chapterName}
                </Text>
                <Text style={[styles.phaseNote, { color: colors.mutedForeground }]}>
                  This PDF has been saved to your device. You can now study it without internet.
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.openBtn,
                    { backgroundColor: pressed ? '#1B5E20' : '#2E7D32' },
                  ]}
                  onPress={handleDismiss}
                >
                  <Ionicons name="book-outline" size={18} color="#FFF" />
                  <Text style={styles.openBtnText}>Open Now</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Chapter name pill */}
          {phase !== 'success' && (
            <View style={[styles.chapterPill, { backgroundColor: colors.muted }]}>
              <Ionicons name="document-text-outline" size={14} color={colors.mutedForeground} />
              <Text
                style={[styles.chapterPillText, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                {chapterName}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,20,50,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
    gap: 10,
    minHeight: 240,
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  phaseSubtitle: {
    fontSize: 13.5,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  phaseNote: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  adBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  adLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.4,
    color: '#1565C0',
  },
  adTagline: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#1A237E',
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  countdown: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  successCircle: {
    marginBottom: 4,
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 10,
  },
  openBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  chapterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 24,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  chapterPillText: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
});
