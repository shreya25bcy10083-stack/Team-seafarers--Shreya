import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { NotificationCard } from '../../components/cards/NotificationCard';
import { useNotifications } from '../../hooks/useNotifications';

export const AlertsScreen: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Caregiver Alerts Screen">
      <Text style={styles.title}>Critical Patient Alerts</Text>
      <Text style={styles.subtitle}>Real-time emergency events and missed medication notifications.</Text>

      {notifications.map((item) => (
        <NotificationCard key={item.id} notification={item} onPress={() => markAsRead(item.id)} />
      ))}
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
