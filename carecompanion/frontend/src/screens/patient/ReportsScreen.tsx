import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { ReportCard } from '../../components/cards/ReportCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useReports } from '../../hooks/useReports';
import { MedicalReport } from '../../types/Report';
import { ReportService } from '../../services/report.service';

export const ReportsScreen: React.FC = () => {
  const { reports, isLoading, error, refetch } = useReports();
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (event: any) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const res = await ReportService.uploadReportFile(file);
    setIsUploading(false);

    if (res.success) {
      if (res.data) {
        setSelectedReport(res.data);
      }
      refetch();
    } else {
      setUploadError(res.message || 'Failed to analyze medical report.');
    }
  };

  const triggerUpload = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <View style={styles.container} accessibilityLabel="Medical Reports Assistant Screen">
      {/* Hidden file input for web upload */}
      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef as any}
          style={{ display: 'none' }}
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Medical Reports</Text>
        <Text style={styles.subtitle}>Upload lab results or prescriptions (PDF/Image) for real AI-simplified explanations.</Text>

        {uploadError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{uploadError}</Text>
          </View>
        )}

        <View style={styles.uploadBtnWrapper}>
          <PrimaryButton
            title="📷 Select Medical Report (PDF/Image)"
            onPress={triggerUpload}
            isLoading={isUploading}
            variant="blue"
          />
        </View>

        {isLoading ? (
          <LoadingSpinner message="Retrieving your uploaded reports..." />
        ) : error ? (
          <ErrorView message={error} onRetry={refetch} />
        ) : reports.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No Medical Reports Uploaded"
            description="Upload your blood tests, doctor notes, or prescriptions to receive real AI breakdowns."
            actionLabel="Upload Report"
            onAction={triggerUpload}
          />
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} onPress={() => setSelectedReport(report)} />
          ))
        )}
      </ScrollView>

      {/* Detailed Analysis Modal */}
      {selectedReport && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedReport(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>📄 {selectedReport.title}</Text>

                <View style={styles.sectionBox}>
                  <Text style={styles.sectionHeader}>📋 Summary</Text>
                  <Text style={styles.bodyText}>{selectedReport.summary}</Text>
                </View>

                {selectedReport.keyFindings && selectedReport.keyFindings.length > 0 && (
                  <View style={styles.sectionBox}>
                    <Text style={styles.sectionHeader}>🔍 Key Findings</Text>
                    {selectedReport.keyFindings.map((finding, idx) => (
                      <Text key={idx} style={styles.bulletItem}>
                        • {finding}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.sectionBox}>
                  <Text style={styles.sectionHeader}>💡 Simple Explanation</Text>
                  <Text style={styles.bodyText}>{selectedReport.simplifiedExplanation}</Text>
                </View>

                {selectedReport.doctorNotes && (
                  <View style={styles.sectionBox}>
                    <Text style={styles.sectionHeader}>🩺 Questions for Doctor</Text>
                    <Text style={styles.bodyText}>{selectedReport.doctorNotes}</Text>
                  </View>
                )}

                <View style={styles.disclaimerBox}>
                  <Text style={styles.disclaimerText}>
                    ⚠️ Disclaimer: This information is educational and should not replace advice from a qualified healthcare professional.
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReport(null)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  errorBanner: {
    backgroundColor: COLORS.error.light,
    borderColor: COLORS.error.main,
    borderWidth: 1,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
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
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionBox: {
    backgroundColor: COLORS.neutral.background,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary.dark,
    marginBottom: SPACING.xs,
  },
  bodyText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
    lineHeight: 20,
  },
  bulletItem: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
    marginBottom: 4,
  },
  disclaimerBox: {
    backgroundColor: COLORS.warning.light,
    borderColor: COLORS.warning.main,
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  disclaimerText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.warning.dark,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  closeBtn: {
    backgroundColor: COLORS.primary.main,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  closeBtnText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
});
