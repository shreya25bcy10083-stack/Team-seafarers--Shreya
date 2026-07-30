import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/User';

interface RoleSelectionScreenProps {
  onSelectRole?: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  const { login } = useAuth();

  const handleChooseRole = async (role: UserRole) => {
    if (onSelectRole) {
      onSelectRole(role);
    } else {
      await login(role === 'PATIENT' ? 'eleanor@example.com' : 'caregiver@example.com', role);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Role Selection Screen">
      <Text style={styles.headerTitle}>Welcome to CareCompanion</Text>
      <Text style={styles.subTitle}>Please choose how you will be using the application.</Text>

      <TouchableOpacity
        style={[styles.roleCard, { borderColor: COLORS.primary.main }]}
        onPress={() => handleChooseRole('PATIENT')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="I am a Patient. Choose to access personalized health guidance and medication tracking."
      >
        <Text style={styles.roleIcon}>👵🏽</Text>
        <Text style={styles.roleTitle}>I am a Patient</Text>
        <Text style={styles.roleDesc}>
          Get friendly medication reminders, wellness check-ins, medical report guidance, and instant AI voice assistance.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleCard, { borderColor: COLORS.secondary.main }]}
        onPress={() => handleChooseRole('CAREGIVER')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="I am a Caregiver. Choose to monitor linked patients and receive emergency alerts."
      >
        <Text style={styles.roleIcon}>🧑🏽‍⚕️</Text>
        <Text style={styles.roleTitle}>I am a Caregiver</Text>
        <Text style={styles.roleDesc}>
          Monitor your loved ones’ daily health logs, receive instant alerts for missed medications, and review medical summaries.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    backgroundColor: COLORS.neutral.background,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subTitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  roleCard: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  roleTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.xs,
  },
  roleDesc: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.body,
  },
});
