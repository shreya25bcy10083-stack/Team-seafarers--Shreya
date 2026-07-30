import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { MedicationCard } from '../../components/cards/MedicationCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyState } from '../../components/common/EmptyState';
import { useMedication } from '../../hooks/useMedication';

export const MedicationScreen: React.FC = () => {
  const { medications, isLoading, error, refetch, updateStatus } = useMedication();

  return (
    <View style={styles.container} accessibilityLabel="Medication Schedule Screen">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Medication Schedule</Text>
        <Text style={styles.subtitle}>Track and log your daily prescribed medicines set by your caregiver.</Text>

        {isLoading ? (
          <LoadingSpinner message="Fetching your medication schedule..." />
        ) : error ? (
          <ErrorView message={error} onRetry={refetch} />
        ) : medications.length === 0 ? (
          <EmptyState
            icon="💊"
            title="No Medications Scheduled"
            description="Your caregiver has not added any medications to your schedule yet."
          />
        ) : (
          medications.map((med) => (
            <MedicationCard
              key={med.id}
              item={med}
              onTake={() => updateStatus(med.id, 'TAKEN')}
              onSkip={() => updateStatus(med.id, 'SKIPPED')}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  screenTitle: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.md,
  },
});
