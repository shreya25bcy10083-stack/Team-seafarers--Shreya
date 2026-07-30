import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export type AvatarState = 'IDLE' | 'SMILING' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'HAPPY' | 'CONCERNED' | 'EMERGENCY';

interface AvatarProps {
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ state = 'IDLE', size = 'md', showLabel = true }) => {
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
      case 'SPEAKING':
      case 'LISTENING':
        return COLORS.secondary.main;
      case 'THINKING':
        return COLORS.accent.main;
      default:
        return COLORS.primary.main;
    }
  };

  return (
    <View style={styles.container} accessibilityLabel={`AI Companion Avatar state ${state.toLowerCase()}`} accessibilityRole="image">
      <View
        style={[
          styles.avatarCircle,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            borderColor: getBorderColor(),
          },
        ]}
      >
        <Text style={{ fontSize: dim * 0.5 }}>{getExpressionEmoji()}</Text>
      </View>
      {showLabel && (
        <Text style={styles.stateLabel}>
          {state === 'THINKING' ? 'Thinking...' : state === 'SPEAKING' ? 'Speaking' : state === 'LISTENING' ? 'Listening...' : 'CareCompanion'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    backgroundColor: COLORS.accent.light,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  stateLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral.textSecondary,
  },
});
