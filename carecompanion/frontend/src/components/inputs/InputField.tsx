import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, helperText, style, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={COLORS.neutral.textMuted}
        accessibilityLabel={label}
        {...props}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    height: LAYOUT.preferredTouchTarget,
    minHeight: LAYOUT.minTouchTarget,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1.5,
    borderColor: COLORS.neutral.border,
    borderRadius: LAYOUT.borderRadiusMd,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error.main,
  },
  errorText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.error.main,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  helperText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textSecondary,
  },
});
