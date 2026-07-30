import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { ReportCard } from '../../components/cards/ReportCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useReports } from '../../hooks/useReports';
import { MedicalReport } from '../../types/Report';
import { ConfirmationDialog } from '../../components/dialogs/ConfirmationDialog';

export const ReportsScreen: React.FC = () => {
  const { reports, isLoading, error, refetch, uploadReport } = useReports();
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulatedUpload = async () => {
    setIsUploading(true);
    await uploadReport('Routine Blood Work & Glucose Test', 'LAB_TEST', 'mock_doc.pdf');
    setIsUploading(false);
  };

  return (
    <View style={styles.container} accessibilityLabel="Medical Reports Assistant Screen">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Medical Reports</Text>
        <Text style={styles.subtitle}>Upload lab results or prescriptions for clear, AI-simplified explanations.</Text>

        <View style={styles.uploadBtnWrapper}>
          <PrimaryButton
            title="📷 Upload Medical Report"
            onPress={handleSimulatedUpload}
            isLoading={isUploading}
            variant="blue"
          />
        </View>

        {isLoading ? (
          <LoadingSpinner message="Retrieving report summaries..." />
        ) : error ? (
          <ErrorView message={error} onRetry={refetch} />
        ) : reports.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No Reports Uploaded"
            description="Upload your blood tests, doctor notes, or prescriptions to receive simple breakdowns."
            actionLabel="Upload Report"
            onAction={handleSimulatedUpload}
          />
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} onPress={() => setSelectedReport(report)} />
          ))
        )}
      </ScrollView>

      {selectedReport && (
        <ConfirmationDialog
          visible={!!selectedReport}
          title={selectedReport.title}
          message={`AI Explanation:\n\n${selectedReport.simplifiedExplanation}\n\nKey Findings:\n• ${selectedReport.keyFindings.join('\n• ')}`}
          confirmLabel="Got It"
          cancelLabel="Close"
          onConfirm={() => setSelectedReport(null)}
          onCancel={() => setSelectedReport(null)}
        />
      )}
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
  uploadBtnWrapper: {
    marginBottom: SPACING.lg,
  },
});
