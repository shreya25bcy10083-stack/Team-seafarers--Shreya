import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../../components/avatar/Avatar';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { WellnessService } from '../../services/wellness.service';
import { MoodLevel, EnergyLevel } from '../../types/Wellness';
import { useAuth } from '../../hooks/useAuth';

export const WellnessScreen: React.FC = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodLevel>('GOOD');
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('HIGH');
  const [sleepHours, setSleepHours] = useState(8);
  const [painLevel, setPainLevel] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const moods: { level: MoodLevel; label: string; icon: string }[] = [
    { level: 'GREAT', label: 'Great', icon: '😄' },
    { level: 'GOOD', label: 'Good', icon: '😊' },
    { level: 'OKAY', label: 'Okay', icon: '😐' },
    { level: 'LOW', label: 'Low', icon: '😔' },
    { level: 'BAD', label: 'Unwell', icon: '😣' },
  ];

  const energies: { level: EnergyLevel; label: string }[] = [
    { level: 'HIGH', label: 'High Energy ⚡' },
    { level: 'MODERATE', label: 'Moderate 🔋' },
    { level: 'LOW', label: 'Feeling Tired 🪫' },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await WellnessService.submitCheckIn({
      mood: selectedMood,
      energy: selectedEnergy,
      painLevel,
      sleepHours,
      notes: notes.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(res.message || 'Failed to record check-in.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Daily Wellness Check-In Screen">
      <View style={styles.headerBox}>
        <Avatar state={isSubmitted ? 'HAPPY' : 'LISTENING'} size="lg" />
        <Text style={styles.title}>Daily Wellness Check-in</Text>
        <Text style={styles.subtitle}>How are you feeling overall today, {user?.name || 'there'}?</Text>
      </View>

      {isSubmitted ? (
        <View style={styles.thankYouCard}>
          <Text style={styles.thankYouIcon}>🌟</Text>
          <Text style={styles.thankYouTitle}>Check-in Recorded!</Text>
          <Text style={styles.thankYouText}>
            Thank you for checking in, {user?.name || 'User'}. Your caregiver and health summary have been updated with your latest status.
          </Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLine}>• Mood: <Text style={styles.boldText}>{selectedMood}</Text></Text>
            <Text style={styles.summaryLine}>• Energy: <Text style={styles.boldText}>{selectedEnergy}</Text></Text>
            <Text style={styles.summaryLine}>• Pain Level: <Text style={styles.boldText}>{painLevel}/10</Text></Text>
            <Text style={styles.summaryLine}>• Sleep: <Text style={styles.boldText}>{sleepHours} Hours</Text></Text>
            {notes ? <Text style={styles.summaryLine}>• Notes: <Text style={styles.boldText}>"{notes}"</Text></Text> : null}
          </View>
          <TouchableOpacity style={styles.resetBtn} onPress={() => setIsSubmitted(false)}>
            <Text style={styles.resetBtnText}>Submit Another Update</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formCard}>
          {errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={styles.label}>Select Your Mood</Text>
          <View style={styles.moodRow}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.level}
                style={[styles.moodItem, selectedMood === m.level && styles.moodItemActive]}
                onPress={() => setSelectedMood(m.level)}
              >
                <Text style={styles.moodIcon}>{m.icon}</Text>
                <Text style={[styles.moodLabel, selectedMood === m.level && styles.moodLabelActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Energy Level</Text>
          <View style={styles.energyRow}>
            {energies.map((e) => (
              <TouchableOpacity
                key={e.level}
                style={[styles.energyPill, selectedEnergy === e.level && styles.energyPillActive]}
                onPress={() => setSelectedEnergy(e.level)}
              >
                <Text style={[styles.energyPillText, selectedEnergy === e.level && styles.energyPillTextActive]}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Sleep Duration (Hours)</Text>
          <View style={styles.sleepRow}>
            {[4, 5, 6, 7, 8, 9, 10].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.sleepPill, sleepHours === val && styles.sleepPillActive]}
                onPress={() => setSleepHours(val)}
              >
                <Text style={[styles.sleepPillText, sleepHours === val && styles.sleepPillTextActive]}>{val}h</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Pain / Discomfort Level (0 - 10)</Text>
          <View style={styles.painSelector}>
            {[0, 2, 4, 6, 8, 10].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.painPill, painLevel === val && styles.painPillActive]}
                onPress={() => setPainLevel(val)}
              >
                <Text style={[styles.painPillText, painLevel === val && styles.painPillTextActive]}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g., Felt a light headache in the morning after breakfast..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <View style={styles.btnWrapper}>
            <PrimaryButton title="Submit Daily Check-in" onPress={handleSubmit} isLoading={isSubmitting} />
          </View>
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
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
  },
  formCard: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
  },
  errorBox: {
    backgroundColor: COLORS.error.light,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  moodItem: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    flex: 1,
    marginHorizontal: 2,
  },
  moodItemActive: {
    borderColor: COLORS.primary.main,
    backgroundColor: COLORS.primary.light,
  },
  moodIcon: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textSecondary,
    marginTop: 4,
  },
  moodLabelActive: {
    color: COLORS.primary.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  energyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  energyPill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    marginHorizontal: 2,
  },
  energyPillActive: {
    backgroundColor: COLORS.secondary.light,
    borderColor: COLORS.secondary.main,
  },
  energyPillText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral.textSecondary,
  },
  energyPillTextActive: {
    color: COLORS.secondary.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  sleepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sleepPill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
  },
  sleepPillActive: {
    backgroundColor: COLORS.accent.light,
    borderColor: COLORS.accent.main,
  },
  sleepPillText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
  },
  sleepPillTextActive: {
    color: COLORS.accent.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  painSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  painPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  painPillActive: {
    backgroundColor: COLORS.error.main,
    borderColor: COLORS.error.dark,
  },
  painPillText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  painPillTextActive: {
    color: COLORS.neutral.white,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.body,
    backgroundColor: COLORS.neutral.white,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
  },
  btnWrapper: {
    marginTop: SPACING.md,
  },
  thankYouCard: {
    backgroundColor: COLORS.primary.light,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary.main,
  },
  thankYouIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  thankYouTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary.dark,
    marginBottom: SPACING.xs,
  },
  thankYouText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  summaryBox: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.md,
    borderRadius: 8,
    width: '100%',
    marginBottom: SPACING.md,
  },
  summaryLine: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textPrimary,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  resetBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  resetBtnText: {
    color: COLORS.primary.main,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
