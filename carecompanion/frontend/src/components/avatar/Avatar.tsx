import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export type AvatarState = 'IDLE' | 'GREETING' | 'SMILING' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'HAPPY' | 'CONCERNED' | 'REMINDER' | 'EMERGENCY';

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
        <Text style={{ fontSize: dim * 0.48 }}>{getExpressionEmoji()}</Text>
      </View>
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
  },
  stateLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.neutral.textSecondary,
  },
});
