import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: LAYOUT.preferredTouchTarget,
    minHeight: LAYOUT.minTouchTarget,
    borderRadius: LAYOUT.borderRadiusMd,
    borderWidth: 2,
    borderColor: COLORS.secondary.main,
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  disabled: {
    borderColor: COLORS.neutral.border,
  },
  text: {
    color: COLORS.secondary.main,
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});
