import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';

export type AvatarState = 'IDLE' | 'GREETING' | 'SMILING' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'HAPPY' | 'CONCERNED' | 'REMINDER' | 'EMERGENCY';

interface AvatarProps {
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ state = 'IDLE', size = 'md', showLabel = true }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0.8)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animation
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    // Pulse animation for active states
    let pulseLoop: Animated.CompositeAnimation | null = null;
    if (['SPEAKING', 'LISTENING', 'THINKING', 'EMERGENCY', 'REMINDER'].includes(state)) {
      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: state === 'EMERGENCY' ? 300 : 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: state === 'EMERGENCY' ? 300 : 700,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
    } else {
      pulseAnim.setValue(1);
    }

    // Sound wave loop for speaking
    let waveLoop: Animated.CompositeAnimation | null = null;
    if (state === 'SPEAKING') {
      waveLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0.85,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      waveLoop.start();
    }

    // Eye blinking loop
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.1, duration: 100, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }, 4000);

    return () => {
      floatLoop.stop();
      if (pulseLoop) pulseLoop.stop();
      if (waveLoop) waveLoop.stop();
      clearInterval(blinkInterval);
    };
  }, [state]);

  const getDimension = () => {
    switch (size) {
      case 'sm':
        return 52;
      case 'lg':
        return 100;
      default:
        return 76;
    }
  };

  const dim = getDimension();

  const getBorderColor = () => {
    switch (state) {
      case 'EMERGENCY':
        return COLORS.error.main;
      case 'REMINDER':
      case 'CONCERNED':
        return COLORS.warning.main;
      case 'SPEAKING':
      case 'LISTENING':
        return COLORS.secondary.main || '#0EA5E9';
      case 'THINKING':
        return COLORS.accent.main || '#8B5CF6';
      default:
        return COLORS.primary.main || '#3B82F6';
    }
  };

  const getLabelText = () => {
    switch (state) {
      case 'GREETING':
        return 'Hello!';
      case 'THINKING':
        return 'Analyzing...';
      case 'SPEAKING':
        return 'Speaking...';
      case 'LISTENING':
        return 'Listening...';
      case 'REMINDER':
        return 'Medication Time!';
      case 'CONCERNED':
        return 'Checking in';
      case 'EMERGENCY':
        return 'SOS Alert!';
      default:
        return 'Care Companion AI';
    }
  };

  return (
    <View style={styles.container} accessibilityLabel={`Illustrated Healthcare Assistant AI Avatar state ${state.toLowerCase()}`}>
      <Animated.View
        style={[
          styles.avatarFrame,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            borderColor: getBorderColor(),
            transform: [{ translateY: floatAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        {/* Illustrated Healthcare Assistant Vector Avatar */}
        <View style={[styles.avatarIllustration, { width: dim - 6, height: dim - 6, borderRadius: (dim - 6) / 2 }]}>
          {/* Hair Background */}
          <View style={[styles.hairBack, { width: dim * 0.7, height: dim * 0.45, borderRadius: dim * 0.35 }]} />

          {/* Clinician Head & Face */}
          <View style={[styles.head, { width: dim * 0.52, height: dim * 0.52, borderRadius: (dim * 0.52) / 2 }]}>
            {/* Eyes */}
            <Animated.View style={[styles.eyesRow, { opacity: blinkAnim }]}>
              {state === 'HAPPY' || state === 'GREETING' || state === 'SMILING' ? (
                <>
                  <Text style={styles.eyeArc}>^</Text>
                  <Text style={styles.eyeArc}>^</Text>
                </>
              ) : (
                <>
                  <View style={styles.eyePupil} />
                  <View style={styles.eyePupil} />
                </>
              )}
            </Animated.View>

            {/* Mouth */}
            {state === 'SPEAKING' ? (
              <View style={styles.speakingMouth} />
            ) : state === 'THINKING' ? (
              <View style={styles.thinkingMouth} />
            ) : state === 'CONCERNED' ? (
              <View style={styles.concernedMouth} />
            ) : (
              <View style={styles.smilingMouth} />
            )}
          </View>

          {/* Medical Scrubs & White Coat */}
          <View style={[styles.scrubsBody, { width: dim * 0.75, height: dim * 0.35 }]}>
            {/* V-Neck Scrubs */}
            <View style={styles.scrubsVNeck} />
            {/* Stethoscope around neck */}
            <View style={styles.stethoscopeLoop} />
            {/* Red Cross Medical Badge */}
            <View style={styles.medicalBadge}>
              <Text style={styles.badgeCross}>+</Text>
            </View>
          </View>

          {/* Floating State Overlay Indicators */}
          {state === 'GREETING' && <Text style={styles.stateOverlayBadge}>👋</Text>}
          {state === 'THINKING' && <Text style={styles.stateOverlayBadge}>🤔</Text>}
          {state === 'LISTENING' && <Text style={styles.stateOverlayBadge}>🎧</Text>}
          {state === 'REMINDER' && <Text style={styles.stateOverlayBadge}>⏰</Text>}
          {state === 'EMERGENCY' && <Text style={styles.stateOverlayBadge}>🚨</Text>}
        </View>

        {/* Sound Wave Ripple for Speaking State */}
        {state === 'SPEAKING' && (
          <Animated.View
            style={[
              styles.soundWaveRing,
              {
                width: dim + 12,
                height: dim + 12,
                borderRadius: (dim + 12) / 2,
                borderColor: COLORS.secondary.main,
                transform: [{ scale: waveAnim }],
              },
            ]}
          />
        )}
      </Animated.View>

      {showLabel && <Text style={styles.stateLabel}>{getLabelText()}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFrame: {
    backgroundColor: COLORS.neutral.white,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  avatarIllustration: {
    backgroundColor: '#E0F2FE', // Light Healthcare Blue Background
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  hairBack: {
    position: 'absolute',
    top: 2,
    backgroundColor: '#1E293B', // Dark Hair
  },
  head: {
    backgroundColor: '#FDE047', // Soft warm tone
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -4,
  },
  eyePupil: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0F172A',
  },
  eyeArc: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: -2,
  },
  smilingMouth: {
    width: 8,
    height: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
    borderRadius: 4,
    marginTop: 4,
  },
  speakingMouth: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
    marginTop: 3,
  },
  thinkingMouth: {
    width: 6,
    height: 2,
    backgroundColor: '#0F172A',
    marginTop: 4,
  },
  concernedMouth: {
    width: 8,
    height: 4,
    borderTopWidth: 2,
    borderTopColor: '#0F172A',
    borderRadius: 4,
    marginTop: 4,
  },
  scrubsBody: {
    backgroundColor: '#0284C7', // Clinical Medical Scrubs Blue
    position: 'absolute',
    bottom: -4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    zIndex: 3,
  },
  scrubsVNeck: {
    width: 14,
    height: 10,
    backgroundColor: '#FDE047', // Matches Skin Tone
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  stethoscopeLoop: {
    position: 'absolute',
    top: 2,
    width: 22,
    height: 12,
    borderWidth: 2,
    borderColor: '#334155',
    borderTopWidth: 0,
    borderRadius: 11,
  },
  medicalBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCross: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: -2,
  },
  stateOverlayBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 14,
    zIndex: 10,
  },
  soundWaveRing: {
    position: 'absolute',
    borderWidth: 2,
    opacity: 0.6,
  },
  stateLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral.textSecondary,
  },
});
