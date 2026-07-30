import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

export type StatusType = 'TAKEN' | 'PENDING' | 'SKIPPED' | 'MISSED' | 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'TAKEN':
      case 'HEALTHY':
        return { bg: COLORS.primary.light, text: COLORS.primary.dark, defaultLabel: 'Taken' };
      case 'PENDING':
        return { bg: COLORS.warning.light, text: COLORS.warning.dark, defaultLabel: 'Pending' };
      case 'NEEDS_ATTENTION':
      case 'SKIPPED':
        return { bg: COLORS.warning.light, text: COLORS.warning.dark, defaultLabel: 'Attention' };
      case 'MISSED':
      case 'CRITICAL':
        return { bg: COLORS.error.light, text: COLORS.error.dark, defaultLabel: 'Missed' };
      default:
        return { bg: COLORS.neutral.border, text: COLORS.neutral.textSecondary, defaultLabel: status };
    }
  };

  const badge = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: badge.bg }]} accessibilityLabel={`Status: ${label || badge.defaultLabel}`}>
      <Text style={[styles.text, { color: badge.text }]}>{label || badge.defaultLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.small,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
