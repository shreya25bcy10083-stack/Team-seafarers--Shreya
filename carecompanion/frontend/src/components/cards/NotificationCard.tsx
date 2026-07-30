import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppNotification } from '../../types/Notification';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface NotificationCardProps {
  notification: AppNotification;
  onPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
  const getTypeColor = () => {
    switch (notification.type) {
      case 'EMERGENCY':
        return COLORS.error.main;
      case 'REMINDER':
        return COLORS.warning.main;
      case 'MEDICATION':
        return COLORS.primary.main;
      default:
        return COLORS.secondary.main;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !notification.isRead && styles.unreadCard,
        { borderLeftColor: getTypeColor() },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Notification: ${notification.title}, ${notification.message}`}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.time}>{notification.timestamp}</Text>
      </View>
      <Text style={styles.message}>{notification.message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderLeftWidth: 6,
  },
  unreadCard: {
    backgroundColor: COLORS.secondary.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  time: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textMuted,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.caption,
  },
});
