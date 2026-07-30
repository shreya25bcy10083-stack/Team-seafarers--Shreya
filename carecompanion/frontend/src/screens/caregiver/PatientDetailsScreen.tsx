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
  const [syncedReports, setSyncedReports] = useState<any[]>([]);
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
    fetchSyncedReports();
  }, [patientId]);

  const fetchWellnessHistory = async () => {
    const res = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.CAREGIVER.WELLNESS);
    if (res.success && Array.isArray(res.data)) {
      setWellnessLogs(res.data);
    }
  };

  const fetchSyncedReports = async () => {
    const res = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.CAREGIVER.DASHBOARD);
    if (res.success && res.data?.medical_reports) {
      setSyncedReports(res.data.medical_reports);
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
            subtitle="Patient self-reported"
            icon="🩺"
          />
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <HealthCard
            title="Sleep Duration"
            value={latestWellness?.sleep_hours ? `${latestWellness.sleep_hours} hrs` : 'N/A'}
            subtitle="Nightly sleep duration"
            icon="💤"
          />
        </View>
        <View style={styles.gridCol}>
          <HealthCard
            title="Energy Level"
            value={latestWellness?.energy_level || 'N/A'}
            subtitle="Daily energy level"
            icon="⚡"
          />
        </View>
      </View>

      {/* Medication Schedule Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Prescribed Medication Schedule</Text>
        <SecondaryButton title="+ Add Medication" onPress={() => setShowAddModal(true)} />
      </View>

      {medications.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No medications prescribed for this patient yet.</Text>
        </View>
      ) : (
        medications.map((item) => <MedicationCard key={item.id} item={item} />)
      )}

      {/* Caregiver Synced Medical Reports Section */}
      <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>📋 Synced Medical Reports & AI Analysis</Text>
      {syncedReports.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No medical reports uploaded by patient yet.</Text>
        </View>
      ) : (
        syncedReports.map((report) => {
          let summaryObj: any = null;
          try {
            summaryObj = JSON.parse(report.ai_summary);
          } catch (e) {
            summaryObj = { summary: report.ai_summary };
          }
          const statusBadge = summaryObj?.health_status_label || '🟡 Needs Attention';

          return (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>📄 {report.report_name}</Text>
                <View style={styles.statusBadgeBox}>
                  <Text style={styles.statusBadgeText}>{statusBadge}</Text>
                </View>
              </View>
              <Text style={styles.reportDate}>Uploaded: {report.uploaded_at?.split('T')[0] || 'Recently'}</Text>
              <Text style={styles.reportSummaryText}>{summaryObj?.summary || report.ai_summary}</Text>
            </View>
          );
        })
      )}

      {/* Modal: Add Medication */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule Medication for Patient</Text>

            {formError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            )}

            <Text style={styles.label}>Medicine Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Lisinopril, Metformin"
              value={medName}
              onChangeText={setMedName}
            />

            <Text style={styles.label}>Dosage *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10mg, 1 tablet"
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={styles.label}>Frequency</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Daily, Twice daily"
              value={frequency}
              onChangeText={setFrequency}
            />

            <Text style={styles.label}>Reminder Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 08:00, 20:00"
              value={reminderTime}
              onChangeText={setReminderTime}
            />

            <Text style={styles.label}>Instructions (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Take with food in morning"
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalActions}>
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
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  gridCol: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  emptyBox: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.lg,
    borderRadius: LAYOUT.borderRadiusCard,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.neutral.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
  reportCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  statusBadgeBox: {
    backgroundColor: COLORS.warning.light,
    borderColor: COLORS.warning.main,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.warning.dark,
  },
  reportDate: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  reportSummaryText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: LAYOUT.borderRadiusLg,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.md,
  },
  errorBanner: {
    backgroundColor: COLORS.error.light,
    borderColor: COLORS.error.main,
    borderWidth: 1,
    padding: SPACING.sm,
    borderRadius: 6,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.error.dark,
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.neutral.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.neutral.background,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  cancelBtnText: {
    color: COLORS.neutral.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});
