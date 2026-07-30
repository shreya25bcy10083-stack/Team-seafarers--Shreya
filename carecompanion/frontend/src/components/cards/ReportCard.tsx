import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MedicalReport } from '../../types/Report';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface ReportCardProps {
  report: MedicalReport;
  onPress?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Medical report ${report.title}, uploaded on ${report.uploadDate}`}
    >
      <View style={styles.topRow}>
        <Text style={styles.categoryBadge}>{report.category.replace('_', ' ')}</Text>
        <Text style={styles.date}>{report.uploadDate}</Text>
      </View>
      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.summary} numberOfLines={2}>
        {report.simplifiedExplanation}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.viewLink}>View AI Breakdown →</Text>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    fontSize: TYPOGRAPHY.fontSize.small,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary.main,
    backgroundColor: COLORS.secondary.light,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: 6,
  },
  date: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textMuted,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginVertical: SPACING.xs,
  },
  summary: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.body,
  },
  footer: {
    marginTop: SPACING.sm,
    alignItems: 'flex-end',
  },
  viewLink: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary.main,
  },
});
