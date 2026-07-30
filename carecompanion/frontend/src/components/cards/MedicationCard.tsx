import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MedicationItem } from '../../types/Medication';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { StatusBadge } from '../common/StatusBadge';

interface MedicationCardProps {
  item: MedicationItem;
  onTake?: () => void;
  onSkip?: () => void;
  onDelete?: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ item, onTake, onSkip, onDelete }) => {
  const scheduleTime = item.time || item.schedules?.[0]?.time || '08:00';
  const instructions = item.instructions || item.schedules?.[0]?.instructions || item.notes || '';

  return (
    <View style={styles.card} accessibilityLabel={`Medication ${item.name}, Dosage ${item.dosage}, Time ${scheduleTime}`}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.dosage}>{item.dosage} • {scheduleTime} ({item.frequency || 'Daily'})</Text>
        </View>
        <StatusBadge status={item.status || 'PENDING'} />
      </View>

      {instructions ? <Text style={styles.instructions}>💡 {instructions}</Text> : null}

      <View style={styles.actionsRow}>
        {item.status === 'PENDING' && onTake && (
          <TouchableOpacity style={styles.takeBtn} onPress={onTake} accessibilityRole="button">
            <Text style={styles.takeBtnText}>Take Now</Text>
          </TouchableOpacity>
        )}
        {item.status === 'PENDING' && onSkip && (
          <TouchableOpacity style={styles.skipBtn} onPress={onSkip} accessibilityRole="button">
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} accessibilityRole="button">
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  dosage: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
  },
  instructions: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.neutral.background,
    padding: SPACING.sm,
    borderRadius: LAYOUT.borderRadiusSm,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  takeBtn: {
    flex: 1,
    height: LAYOUT.minTouchTarget,
    backgroundColor: COLORS.primary.main,
    borderRadius: LAYOUT.borderRadiusSm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeBtnText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.caption,
  },
  skipBtn: {
    paddingHorizontal: SPACING.md,
    height: LAYOUT.minTouchTarget,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderRadius: LAYOUT.borderRadiusSm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtnText: {
    color: COLORS.neutral.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    fontSize: TYPOGRAPHY.fontSize.caption,
  },
  deleteBtn: {
    paddingHorizontal: SPACING.md,
    height: LAYOUT.minTouchTarget,
    backgroundColor: COLORS.error.light,
    borderWidth: 1,
    borderColor: COLORS.error.main,
    borderRadius: LAYOUT.borderRadiusSm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: COLORS.error.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.caption,
  },
});
