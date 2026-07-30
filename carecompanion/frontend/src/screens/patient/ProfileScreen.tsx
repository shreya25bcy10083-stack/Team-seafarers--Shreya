import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../../components/avatar/Avatar';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import { useAuth } from '../../hooks/useAuth';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Patient Profile Screen">
      <View style={styles.header}>
        <Avatar state="HAPPY" size="lg" showLabel={false} />
        <Text style={styles.name}>{user?.name || 'Eleanor Vance'}</Text>
        <Text style={styles.roleTag}>Patient Account</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Emergency Contact Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Primary Contact:</Text>
          <Text style={styles.val}>{user?.emergencyContactName || 'Robert Vance (Son)'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.val}>{user?.emergencyContactPhone || '+1 (555) 987-6543'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Linked Caregiver</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Caregiver Name:</Text>
          <Text style={styles.val}>{user?.linkedCaregiverName || 'Robert Vance'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.val, { color: COLORS.primary.dark }]}>● Connected & Active</Text>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginTop: SPACING.sm,
  },
  roleTag: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary.main,
    backgroundColor: COLORS.secondary.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
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
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
  },
  val: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.neutral.textPrimary,
  },
  btnWrapper: {
    marginTop: SPACING.lg,
  },
});
