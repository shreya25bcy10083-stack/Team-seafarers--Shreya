import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { PatientCard } from '../../components/cards/PatientCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyState } from '../../components/common/EmptyState';
import { usePatient } from '../../hooks/usePatient';
import { useAuth } from '../../hooks/useAuth';

interface DashboardScreenProps {
  onSelectPatient?: (patientId: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onSelectPatient }) => {
  const { user } = useAuth();
  const { patients, isLoading, error, refetch } = usePatient();

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Caregiver Overview Dashboard">
      <Text style={styles.headerTitle}>Caregiver Portal</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name || 'Caregiver'}. Monitoring linked patients.</Text>

      <View style={styles.statsBanner}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{patients.length}</Text>
          <Text style={styles.statLabel}>Linked Patients</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: COLORS.primary.dark }]}>100%</Text>
          <Text style={styles.statLabel}>Med Adherence</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Linked Patient Overview</Text>

      {isLoading ? (
        <LoadingSpinner message="Loading patient health summary..." />
      ) : error ? (
        <ErrorView message={error} onRetry={refetch} />
      ) : patients.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No Patients Linked"
          description="Send an invite link or code to connect your family member's CareCompanion app."
        />
      ) : (
        patients.map((p) => (
          <PatientCard key={p.id} patient={p} onPress={() => onSelectPatient && onSelectPatient(p.id)} />
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
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.lg,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary.light,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.secondary.main,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary.dark,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.neutral.border,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.md,
  },
});
