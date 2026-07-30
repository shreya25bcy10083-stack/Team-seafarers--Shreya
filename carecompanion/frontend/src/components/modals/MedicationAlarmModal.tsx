import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../avatar/Avatar';
import { MedicationItem } from '../../types/Medication';
import { playAlarmSound, stopAlarmSound } from '../../utils/soundHelper';

interface MedicationAlarmModalProps {
  visible: boolean;
  item: MedicationItem | null;
  onTake: () => void;
  onSnooze: () => void;
  onSkip: () => void;
}

export const MedicationAlarmModal: React.FC<MedicationAlarmModalProps> = ({
  visible,
  item,
  onTake,
  onSnooze,
  onSkip,
}) => {
  useEffect(() => {
    if (visible && item) {
      playAlarmSound();
    } else {
      stopAlarmSound();
    }

    return () => {
      stopAlarmSound();
    };
  }, [visible, item]);

  if (!item) return null;

  const scheduleTime = item.time || item.schedules?.[0]?.time || 'Now';

  const handleTakeAction = () => {
    stopAlarmSound();
    onTake();
  };

  const handleSnoozeAction = () => {
    stopAlarmSound();
    onSnooze();
  };

  const handleSkipAction = () => {
    stopAlarmSound();
    onSkip();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleSnoozeAction}>
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          <View style={styles.avatarHeader}>
            <Avatar state="REMINDER" size="lg" showLabel={false} />
            <Text style={styles.alertTitle}>⏰ Medication Reminder</Text>
            <Text style={styles.alertSub}>Scheduled for {scheduleTime}</Text>
          </View>

          <View style={styles.medDetailCard}>
            <Text style={styles.medName}>{item.name}</Text>
            <Text style={styles.medDosage}>Dosage: {item.dosage}</Text>
            {item.instructions ? (
              <Text style={styles.medInstructions}>💡 {item.instructions}</Text>
            ) : null}
          </View>

          <View style={styles.btnColumn}>
            <TouchableOpacity style={styles.takeBtn} onPress={handleTakeAction} activeOpacity={0.8}>
              <Text style={styles.takeBtnText}>✓ Mark as Taken</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.snoozeBtn} onPress={handleSnoozeAction} activeOpacity={0.8}>
              <Text style={styles.snoozeBtnText}>💤 Snooze (15 Mins)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipBtn} onPress={handleSkipAction} activeOpacity={0.8}>
              <Text style={styles.skipBtnText}>Skip Medication</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  dialogCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: LAYOUT.borderRadiusLg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: COLORS.warning.main,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  alertTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginTop: SPACING.sm,
  },
  alertSub: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.warning.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginTop: 2,
  },
  medDetailCard: {
    backgroundColor: COLORS.warning.light,
    borderColor: COLORS.warning.main,
    borderWidth: 1,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  medName: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  medDosage: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.secondary.dark,
    marginTop: 4,
  },
  medInstructions: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  btnColumn: {
    gap: SPACING.sm,
  },
  takeBtn: {
    backgroundColor: COLORS.primary.main,
    paddingVertical: SPACING.md,
    borderRadius: LAYOUT.borderRadiusSm,
    alignItems: 'center',
  },
  takeBtnText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.h3,
  },
  snoozeBtn: {
    backgroundColor: COLORS.warning.light,
    borderWidth: 1,
    borderColor: COLORS.warning.main,
    paddingVertical: SPACING.md,
    borderRadius: LAYOUT.borderRadiusSm,
    alignItems: 'center',
  },
  snoozeBtnText: {
    color: COLORS.warning.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
  skipBtn: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  skipBtnText: {
    color: COLORS.neutral.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
});
