import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Avatar } from '../../components/avatar/Avatar';
import { MedicationCard } from '../../components/cards/MedicationCard';
import { HealthCard } from '../../components/cards/HealthCard';
import { SOSButton } from '../../components/buttons/SOSButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { useMedication } from '../../hooks/useMedication';
import { useWellness } from '../../hooks/useWellness';

interface HomeScreenProps {
  onNavigateMedication?: () => void;
  onNavigateWellness?: () => void;
  onNavigateChat?: () => void;
  onNavigateSOS?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateMedication,
  onNavigateWellness,
  onNavigateChat,
  onNavigateSOS,
}) => {
  const { user } = useAuth();
  const { medications, isLoading, error, refetch, updateStatus } = useMedication(user?.id);
  const { latestLog } = useWellness();

  const pendingMeds = medications.filter((m) => m.status === 'PENDING');
  const takenCount = medications.filter((m) => m.status === 'TAKEN').length;

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'GREAT':
        return '😄';
      case 'GOOD':
        return '😊';
      case 'OKAY':
        return '😐';
      case 'LOW':
        return '😔';
      case 'BAD':
        return '😣';
      default:
        return '☀️';
    }
  };

  const wellnessValue = latestLog ? latestLog.mood : 'Not Checked In';
  const wellnessSubtitle = latestLog
    ? `Pain: ${latestLog.painLevel}/10 • ${latestLog.sleepHours}h Sleep`
    : 'Tap to Check In Today';
  const wellnessIcon = getMoodIcon(latestLog?.mood);

  return (
    <View style={styles.screenContainer} accessibilityLabel="Patient Home Dashboard">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Avatar Greeting Section */}
        <View style={styles.headerCard}>
          <TouchableOpacity onPress={onNavigateChat} activeOpacity={0.9} accessibilityLabel="Open AI Voice Assistant">
            <Avatar state="SMILING" size="lg" showLabel={false} />
          </TouchableOpacity>
          <Text style={styles.greetingTitle}>Good Morning, {user?.name || 'there'}!</Text>
          <Text style={styles.greetingSub}>
            I am here to guide you today. You have {pendingMeds.length} medication reminder(s) upcoming.
          </Text>
        </View>

        {/* Quick Health Summary Cards */}
        <Text style={styles.sectionTitle}>Daily Summary</Text>
        <View style={styles.gridRow}>
          <View style={styles.gridCol}>
            <HealthCard
              title="Medication Status"
              value={`${takenCount} / ${medications.length}`}
              subtitle="Pills Taken Today"
              icon="💊"
              accentColor={COLORS.primary.main}
            />
          </View>
          <View style={styles.gridCol}>
            <TouchableOpacity onPress={onNavigateWellness} activeOpacity={0.8}>
              <HealthCard
                title="Wellness Status"
                value={wellnessValue}
                subtitle={wellnessSubtitle}
                icon={wellnessIcon}
                accentColor={COLORS.secondary.main}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Medication Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          {onNavigateMedication && (
            <TouchableOpacity onPress={onNavigateMedication}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <LoadingSpinner message="Checking today's schedule..." />
        ) : error ? (
          <ErrorView message={error} onRetry={refetch} />
        ) : pendingMeds.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="All Done for Now!"
            description="You have completed all scheduled medications for today."
          />
        ) : (
          pendingMeds.map((med) => (
            <MedicationCard
              key={med.id}
              item={med}
              onTake={() => updateStatus(med.id, 'TAKEN')}
              onSkip={() => updateStatus(med.id, 'SKIPPED')}
            />
          ))
        )}
      </ScrollView>

      {/* Floating SOS Trigger Button */}
      <View style={styles.sosFloatingContainer}>
        <SOSButton onPress={onNavigateSOS || (() => {})} size={64} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.huge + 40,
  },
  headerCard: {
    backgroundColor: COLORS.accent.light,
    borderRadius: LAYOUT.borderRadiusLg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accent.main,
  },
  greetingTitle: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  greetingSub: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginBottom: SPACING.sm,
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  gridCol: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary.main,
  },
  sosFloatingContainer: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
  },
});
