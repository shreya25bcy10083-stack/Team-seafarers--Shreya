import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CaregiverPatientSummary } from '../../services/patient.service';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { StatusBadge } from '../common/StatusBadge';

interface PatientCardProps {
  patient: CaregiverPatientSummary;
  onPress: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Patient ${patient.name}, Age ${patient.age}, Health status ${patient.healthStatus}`}
    >
      <View style={styles.row}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{patient.name.charAt(0)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.details}>
            Age {patient.age} • Last check-in: {patient.lastCheckinTime}
          </Text>
          <Text style={styles.medsCount}>
            💊 Meds Taken: {patient.medicationsTakenCount} / {patient.totalMedicationsCount}
          </Text>
        </View>

        <StatusBadge status={patient.healthStatus} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary.main,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  details: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
  },
  medsCount: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary.dark,
    marginTop: 4,
  },
});
