import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { NotificationCard } from '../../components/cards/NotificationCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationsScreen: React.FC = () => {
  const { notifications, isLoading, markAsRead } = useNotifications();

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Notifications Feed Screen">
      <Text style={styles.title}>Notifications & Alerts</Text>
      <Text style={styles.subtitle}>Stay informed on reminders and caregiver updates.</Text>

      {isLoading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No Notifications" description="You have no unread reminders or alerts at this moment." />
      ) : (
        notifications.map((item) => (
          <NotificationCard key={item.id} notification={item} onPress={() => markAsRead(item.id)} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.neutral.background,
    flexGrow: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.lg,
  },
});
