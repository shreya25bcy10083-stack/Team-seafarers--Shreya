import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface ReminderCardProps {
  time: string;
  title: string;
  subtitle: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  time,
  title,
  subtitle,
  onAction,
  actionLabel = 'Acknowledge',
}) => {
  return (
    <View style={styles.card} accessibilityLabel={`Reminder at ${time}: ${title}, ${subtitle}`}>
      <View style={styles.timeBadge}>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {onAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction} accessibilityRole="button" accessibilityLabel={actionLabel}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.warning.light,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.warning.main,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBadge: {
    backgroundColor: COLORS.warning.main,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: LAYOUT.borderRadiusSm,
    marginRight: SPACING.md,
  },
  timeText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.caption,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: SPACING.sm + 2,
    height: LAYOUT.minTouchTarget,
    borderRadius: LAYOUT.borderRadiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  actionText: {
    color: COLORS.warning.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.caption,
  },
});
