import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import { useAuth } from '../../hooks/useAuth';

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Caregiver Settings Screen">
      <Text style={styles.title}>Caregiver Settings</Text>
      <Text style={styles.subtitle}>Manage monitoring preferences and linked patient accounts.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Profile</Text>
        <Text style={styles.info}>Name: {user?.name || 'Caregiver'}</Text>
        <Text style={styles.info}>Email: {user?.email || 'caregiver@example.com'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Alert Preferences</Text>
        <Text style={styles.info}>⚡ Instant SMS for Emergency SOS: Enabled</Text>
        <Text style={styles.info}>🔔 Missed Medication Push Alert: Enabled</Text>
      </View>

      <View style={styles.btnWrapper}>
        <SecondaryButton title="Sign Out" onPress={logout} />
      </View>
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
  card: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.sm,
  },
  info: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginVertical: 4,
  },
  btnWrapper: {
    marginTop: SPACING.xl,
  },
});
