import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { HealthCard } from '../../components/cards/HealthCard';
import { MedicationCard } from '../../components/cards/MedicationCard';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import { useMedication } from '../../hooks/useMedication';
import { MedicationService } from '../../services/medication.service';
import { ApiClient } from '../../services/api';
import { API_CONFIG } from '../../constants/api';

interface PatientDetailsScreenProps {
  patientId?: string;
  onBack?: () => void;
}

export const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({ patientId = '1', onBack }) => {
  const { medications, refetch } = useMedication(patientId);
  const [wellnessLogs, setWellnessLogs] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for caregiver medication creation
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchWellnessHistory();
  }, [patientId]);

  const fetchWellnessHistory = async () => {
    const res = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.CAREGIVER.WELLNESS);
    if (res.success && Array.isArray(res.data)) {
      setWellnessLogs(res.data);
    }
  };

  const latestWellness = wellnessLogs[0] || null;

  const handleAddMedication = async () => {
    if (!medName.trim()) {
      setFormError('Please enter a medicine name.');
      return;
    }

    if (!dosage.trim()) {
      setFormError('Please enter a dosage (e.g. 5mg, 1 tablet).');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const res = await MedicationService.addMedication({
      name: medName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      time: reminderTime.trim(),
      instructions: notes.trim(),
      patientId: Number(patientId),
    });

    setIsSubmitting(false);

    if (res.success) {
      setShowAddModal(false);
      setMedName('');
      setDosage('');
      setNotes('');
      refetch();
    } else {
      setFormError(res.message || 'Failed to add medication.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Patient Detail View Screen">
      <Text style={styles.name}>Linked Patient Health Overview</Text>
      <Text style={styles.subtitle}>Real-Time Patient Wellness & Medication Schedule</Text>

      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <HealthCard
            title="Latest Mood"
            value={latestWellness?.mood || 'No check-in'}
            subtitle={latestWellness?.created_at ? `Date: ${latestWellness.created_at.split('T')[0]}` : 'Awaiting check-in'}
            icon="😊"
          />
        </View>
        <View style={styles.gridCol}>
          <HealthCard
            title="Pain Scale"
            value={latestWellness?.pain_level !== undefined ? `${latestWellness.pain_level} / 10` : 'N/A'}
            subtitle={latestWellness?.notes ? `Notes: ${latestWellness.notes}` : 'No notes'}
            icon="🩺"
            accentColor={COLORS.warning.main}
          />
        </View>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Prescribed Medications</Text>
        <TouchableOpacity style={styles.addMedBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addMedBtnText}>+ Add Medication</Text>
        </TouchableOpacity>
      </View>

      {medications.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No medications prescribed for this patient yet.</Text>
        </View>
      ) : (
        medications.map((m) => (
          <MedicationCard
            key={m.id}
            item={m}
            onDelete={async () => {
              await MedicationService.deleteMedication(m.id);
              refetch();
            }}
          />
        ))
      )}

      {onBack && (
        <View style={styles.backWrapper}>
          <SecondaryButton title="← Back to Dashboard" onPress={onBack} />
        </View>
      )}

      {/* Add Medication Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💊 Prescribe New Medication</Text>

            {formError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            )}

            <Text style={styles.label}>Medicine Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Metformin, Lisinopril"
              value={medName}
              onChangeText={setMedName}
            />

            <Text style={styles.label}>Dosage *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500mg, 1 tablet"
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={styles.label}>Frequency</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Once daily, Twice after meals"
              value={frequency}
              onChangeText={setFrequency}
            />

            <Text style={styles.label}>Reminder Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 08:00, 20:00"
              value={reminderTime}
              onChangeText={setReminderTime}
            />

            <Text style={styles.label}>Notes / Special Instructions (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Take with warm water after food"
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton title="Save Medication" onPress={handleAddMedication} isLoading={isSubmitting} />
            </View>
          </View>
        </View>
      </Modal>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  addMedBtn: {
    backgroundColor: COLORS.secondary.main,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  addMedBtnText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.caption,
  },
  emptyCard: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
  },
  emptyText: {
    color: COLORS.neutral.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
  backWrapper: {
    marginTop: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
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
  label: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: 4,
    marginTop: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.body,
    backgroundColor: COLORS.neutral.background,
    marginBottom: SPACING.sm,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  cancelBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  cancelBtnText: {
    color: COLORS.neutral.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
