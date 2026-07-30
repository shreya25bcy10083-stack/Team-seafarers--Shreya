import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface VoiceButtonProps {
  isListening: boolean;
  onPress: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ isListening, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isListening && styles.listening]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={isListening ? 'Stop listening to voice input' : 'Start speaking to CareCompanion'}
    >
      <Text style={styles.icon}>{isListening ? '🎙️' : '🎤'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary.main,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  listening: {
    backgroundColor: COLORS.error.main,
  },
  icon: {
    fontSize: 24,
  },
});
