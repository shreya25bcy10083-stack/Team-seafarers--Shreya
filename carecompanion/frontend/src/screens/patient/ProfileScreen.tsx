import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../../components/avatar/Avatar';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import { useAuth } from '../../hooks/useAuth';
import { PatientService } from '../../services/patient.service';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    const res = await PatientService.generateInviteCode();
    setIsGenerating(false);

    if (res.success && res.data?.invite_code) {
      setInviteCode(res.data.invite_code);
    } else {
      setErrorMsg(res.message || 'Failed to generate invite code.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Patient Profile Screen">
      <View style={styles.header}>
        <Avatar state="HAPPY" size="lg" showLabel={false} />
        <Text style={styles.name}>{user?.name || 'Patient Account'}</Text>
        <Text style={styles.roleTag}>Patient Account</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔑 Caregiver Linking Invite Code</Text>
        <Text style={styles.cardDesc}>
          Generate an invite code to share with your family caregiver so they can link to your health dashboard.
        </Text>

        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {inviteCode ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>YOUR INVITE CODE</Text>
            <Text style={styles.codeText}>{inviteCode}</Text>
            <Text style={styles.codeHint}>Share this code with your caregiver to connect accounts.</Text>
          </View>
        ) : (
          <View style={styles.btnWrapperSmall}>
            <PrimaryButton
              title="Generate New Invite Code"
              onPress={handleGenerateCode}
              isLoading={isGenerating}
              variant="purple"
            />
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.val}>{user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.val}>{user?.role || 'PATIENT'}</Text>
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
    marginBottom: SPACING.xs,
  },
  cardDesc: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.md,
  },
  errorBox: {
    backgroundColor: COLORS.error.light,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  codeBox: {
    backgroundColor: COLORS.primary.light,
    borderColor: COLORS.primary.main,
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  codeLabel: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary.dark,
    letterSpacing: 1,
  },
  codeText: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary.dark,
    marginVertical: SPACING.xs,
    letterSpacing: 4,
  },
  codeHint: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
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
  btnWrapperSmall: {
    marginTop: SPACING.xs,
  },
  btnWrapper: {
    marginTop: SPACING.lg,
  },
});
