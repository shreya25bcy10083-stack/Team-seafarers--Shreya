import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { MedicationCard } from '../../components/cards/MedicationCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useMedication } from '../../hooks/useMedication';
import { ConfirmationDialog } from '../../components/dialogs/ConfirmationDialog';

export const MedicationScreen: React.FC = () => {
  const { medications, isLoading, error, refetch, updateStatus, addMedication } = useMedication();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <View style={styles.container} accessibilityLabel="Medication Schedule Screen">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Medication Schedule</Text>
        <Text style={styles.subtitle}>Track and log your daily prescribed medicines.</Text>

        <View style={styles.addBtnWrapper}>
          <PrimaryButton title="+ Add New Medication" onPress={() => setShowAddModal(true)} variant="purple" />
        </View>

        {isLoading ? (
          <LoadingSpinner message="Fetching your medication schedule..." />
        ) : error ? (
          <ErrorView message={error} onRetry={refetch} />
        ) : medications.length === 0 ? (
          <EmptyState
            icon="💊"
            title="No Medications Added"
            description="You currently have no prescribed medications scheduled."
            actionLabel="Add Medication"
            onAction={() => setShowAddModal(true)}
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

      <ConfirmationDialog
        visible={showAddModal}
        title="Add Medication"
        message="Would you like to log a new daily medication schedule?"
        confirmLabel="Add Lisinopril 5mg"
        cancelLabel="Close"
        onConfirm={async () => {
          await addMedication({ name: 'Lisinopril', dosage: '5mg', frequency: 'Daily' });
          setShowAddModal(false);
        }}
        onCancel={() => setShowAddModal(false)}
      />
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
  addBtnWrapper: {
    marginBottom: SPACING.lg,
  },
});
