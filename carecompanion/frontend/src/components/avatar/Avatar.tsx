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

  useEffect(() => {
    // Floating animation
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    // Pulse / Wave animation for SPEAKING, LISTENING, THINKING, EMERGENCY
    let pulseLoop: Animated.CompositeAnimation | null = null;
    if (state === 'SPEAKING' || state === 'LISTENING' || state === 'THINKING' || state === 'EMERGENCY' || state === 'REMINDER') {
      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
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

    // Lip sync / wave animation for speaking
    let waveLoop: Animated.CompositeAnimation | null = null;
    if (state === 'SPEAKING') {
      waveLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      waveLoop.start();
    }

    return () => {
      floatLoop.stop();
      if (pulseLoop) pulseLoop.stop();
      if (waveLoop) waveLoop.stop();
    };
  }, [state]);

  const getDimension = () => {
    switch (size) {
      case 'sm':
        return 48;
      case 'lg':
        return 96;
      default:
        return 72;
    }
  };

  const dim = getDimension();

  const getExpressionEmoji = () => {
    switch (state) {
      case 'GREETING':
        return '👋🏽';
      case 'SMILING':
      case 'HAPPY':
        return '😊';
      case 'LISTENING':
        return '👂';
      case 'THINKING':
        return '🤔';
      case 'SPEAKING':
        return '🗣️';
      case 'CONCERNED':
        return '😟';
      case 'REMINDER':
        return '⏰';
      case 'EMERGENCY':
        return '🚨';
      default:
        return '🙂';
    }
  };

  const getBorderColor = () => {
    switch (state) {
      case 'EMERGENCY':
        return COLORS.error.main;
      case 'REMINDER':
      case 'CONCERNED':
        return COLORS.warning.main;
      case 'SPEAKING':
      case 'LISTENING':
        return COLORS.secondary.main || '#10B981';
      case 'THINKING':
        return COLORS.accent.main || '#8B5CF6';
      case 'GREETING':
      case 'HAPPY':
        return COLORS.primary.main || '#3B82F6';
      default:
        return COLORS.primary.main || '#3B82F6';
    }
  };

  const getLabelText = () => {
    switch (state) {
      case 'GREETING':
        return 'Hello!';
      case 'THINKING':
        return 'Thinking...';
      case 'SPEAKING':
        return 'Speaking...';
      case 'LISTENING':
        return 'Listening...';
      case 'REMINDER':
        return 'Medication Time!';
      case 'CONCERNED':
        return 'Checking on you';
      case 'EMERGENCY':
        return 'SOS Alert!';
      default:
        return 'CareCompanion';
    }
  };

  return (
    <View style={styles.container} accessibilityLabel={`AI Companion Avatar state ${state.toLowerCase()}`} accessibilityRole="image">
      <Animated.View
        style={[
          styles.avatarCircle,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            borderColor: getBorderColor(),
            transform: [
              { translateY: floatAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <Text style={{ fontSize: dim * 0.48 }}>{getExpressionEmoji()}</Text>

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
  avatarCircle: {
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
