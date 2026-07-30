import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface SOSButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  size?: number;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onPress, onLongPress, size = 64 }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS Button. Tap or hold for urgent assistance."
    >
      <View style={styles.innerRing}>
        <Text style={[styles.text, { fontSize: size > 70 ? 20 : 16 }]}>SOS</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.error.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.error.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: COLORS.neutral.white,
  },
  innerRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 1.2,
  },
});
