import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { HealthCard } from '../../components/cards/HealthCard';
import { MedicationCard } from '../../components/cards/MedicationCard';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import { useMedication } from '../../hooks/useMedication';

interface PatientDetailsScreenProps {
  patientId?: string;
  onBack?: () => void;
}

export const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({ patientId = 'usr_101', onBack }) => {
  const { medications } = useMedication(patientId);

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Patient Detail View Screen">
      <Text style={styles.name}>Eleanor Vance</Text>
      <Text style={styles.subtitle}>Detailed Health Logs & Schedule</Text>

      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <HealthCard title="Mood" value="Good" subtitle="Check-in 08:30 AM" icon="😊" />
        </View>
        <View style={styles.gridCol}>
          <HealthCard title="Pain Scale" value="2 / 10" subtitle="Mild discomfort" icon="🩺" accentColor={COLORS.warning.main} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Prescribed Medication Status</Text>
      {medications.map((m) => (
        <MedicationCard key={m.id} item={m} />
      ))}

      {onBack && (
        <View style={styles.backWrapper}>
          <SecondaryButton title="← Back to Dashboard" onPress={onBack} />
        </View>
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
  name: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.lg,
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  gridCol: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginVertical: SPACING.md,
  },
  backWrapper: {
    marginTop: SPACING.xl,
  },
});
