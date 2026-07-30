import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../../components/avatar/Avatar';
import { SOSButton } from '../../components/buttons/SOSButton';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../components/buttons/SecondaryButton';
import { useSOS } from '../../hooks/useSOS';

interface SOSScreenProps {
  onBack?: () => void;
}

export const SOSScreen: React.FC<SOSScreenProps> = ({ onBack }) => {
  const { activeAlert, triggerSOS, cancelSOS } = useSOS();
  const [countdown, setCountdown] = useState<number | null>(null);

  const startSOSCountdown = () => {
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      triggerSOS('usr_101');
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleAbort = () => {
    setCountdown(null);
    cancelSOS();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Emergency Assistance Screen">
      <View style={styles.header}>
        <Avatar state={activeAlert ? 'EMERGENCY' : countdown !== null ? 'CONCERNED' : 'IDLE'} size="lg" />
        <Text style={styles.title}>Emergency SOS Assistance</Text>
        <Text style={styles.subtitle}>
          Tap the button below or press and hold for 3 seconds to send an immediate alert to your emergency contact.
        </Text>
      </View>

      {activeAlert ? (
        <View style={styles.alertActiveCard}>
          <Text style={styles.alertIcon}>🚨</Text>
          <Text style={styles.alertTitle}>Emergency Alert Sent!</Text>
          <Text style={styles.alertText}>
            Your caregiver (Robert Vance) and emergency contacts have been notified with your live status. Help is on the way.
          </Text>
          <View style={styles.cancelBtnWrapper}>
            <SecondaryButton title="Cancel Emergency Alert" onPress={handleAbort} />
          </View>
        </View>
      ) : countdown !== null ? (
        <View style={styles.countdownCard}>
          <Text style={styles.countdownTitle}>Sending Alert In</Text>
          <Text style={styles.countdownNumber}>{countdown}</Text>
          <Text style={styles.countdownSub}>seconds...</Text>
          <View style={styles.cancelBtnWrapper}>
            <PrimaryButton title="CANCEL (FALSE ALARM)" onPress={handleAbort} variant="purple" />
          </View>
        </View>
      ) : (
        <View style={styles.sosActionArea}>
          <SOSButton onPress={startSOSCountdown} onLongPress={startSOSCountdown} size={120} />
          <Text style={styles.sosInstructionText}>TAP OR HOLD FOR EMERGENCY</Text>
        </View>
      )}

      {onBack && (
        <View style={styles.backBtnWrapper}>
          <SecondaryButton title="← Return to Dashboard" onPress={onBack} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.neutral.background,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  sosActionArea: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  sosInstructionText: {
    marginTop: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error.main,
    letterSpacing: 1,
  },
  countdownCard: {
    backgroundColor: COLORS.warning.light,
    borderRadius: LAYOUT.borderRadiusLg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.warning.main,
    marginVertical: SPACING.md,
  },
  countdownTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.warning.dark,
  },
  countdownNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.error.main,
    marginVertical: SPACING.sm,
  },
  countdownSub: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
  },
  alertActiveCard: {
    backgroundColor: COLORS.error.light,
    borderRadius: LAYOUT.borderRadiusLg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.error.main,
    marginVertical: SPACING.md,
  },
  alertIcon: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  alertTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error.dark,
    marginBottom: SPACING.xs,
  },
  alertText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
  },
  cancelBtnWrapper: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  backBtnWrapper: {
    marginTop: SPACING.xl,
  },
});
