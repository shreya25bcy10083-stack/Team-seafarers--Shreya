import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../../components/avatar/Avatar';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { WellnessService } from '../../services/wellness.service';
import { MoodLevel } from '../../types/Wellness';

export const WellnessScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodLevel>('GOOD');
  const [painLevel, setPainLevel] = useState(2);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moods: { level: MoodLevel; label: string; icon: string }[] = [
    { level: 'GREAT', label: 'Great', icon: '😄' },
    { level: 'GOOD', label: 'Good', icon: '😊' },
    { level: 'OKAY', label: 'Okay', icon: '😐' },
    { level: 'LOW', label: 'Low', icon: '😔' },
    { level: 'BAD', label: 'Unwell', icon: '😣' },
  ];

  const handleSubmit = async () => {
    await WellnessService.submitCheckIn({
      mood: selectedMood,
      energy: 'HIGH',
      painLevel,
      sleepHours: 8,
    });
    setIsSubmitted(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Daily Wellness Check-In Screen">
      <View style={styles.headerBox}>
        <Avatar state={isSubmitted ? 'HAPPY' : 'LISTENING'} size="lg" />
        <Text style={styles.title}>Daily Wellness Check-in</Text>
        <Text style={styles.subtitle}>How are you feeling overall today?</Text>
      </View>

      {isSubmitted ? (
        <View style={styles.thankYouCard}>
          <Text style={styles.thankYouIcon}>🌟</Text>
          <Text style={styles.thankYouTitle}>Check-in Recorded!</Text>
          <Text style={styles.thankYouText}>
            Thank you for checking in, Eleanor. Your caregiver and AI companion have updated your health journal.
          </Text>
        </View>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.label}>Select Your Mood</Text>
          <View style={styles.moodRow}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.level}
                style={[styles.moodItem, selectedMood === m.level && styles.moodItemActive]}
                onPress={() => setSelectedMood(m.level)}
                accessibilityRole="button"
                accessibilityLabel={`Select mood ${m.label}`}
              >
                <Text style={styles.moodIcon}>{m.icon}</Text>
                <Text style={[styles.moodLabel, selectedMood === m.level && styles.moodLabelActive]}>{m.label}</Text>
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
                accessibilityRole="button"
                accessibilityLabel={`Set pain level to ${val}`}
              >
                <Text style={[styles.painPillText, painLevel === val && styles.painPillTextActive]}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.btnWrapper}>
            <PrimaryButton title="Submit Daily Check-in" onPress={handleSubmit} />
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
  label: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.md,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
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
  painSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  painPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  painPillActive: {
    backgroundColor: COLORS.secondary.main,
    borderColor: COLORS.secondary.dark,
  },
  painPillText: {
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  painPillTextActive: {
    color: COLORS.neutral.white,
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
  },
});
