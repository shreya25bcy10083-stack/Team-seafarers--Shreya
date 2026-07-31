import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { COLORS } from '../constants/colors';
import { LAYOUT, SPACING } from '../constants/spacing';
import { TYPOGRAPHY } from '../constants/typography';
import { DashboardScreen } from '../screens/caregiver/DashboardScreen';
import { PatientDetailsScreen } from '../screens/caregiver/PatientDetailsScreen';
import { AlertsScreen } from '../screens/caregiver/AlertsScreen';
import { SettingsScreen } from '../screens/caregiver/SettingsScreen';
import { usePatient } from '../hooks/usePatient';
import { useNotifications } from '../hooks/useNotifications';
import { playEmergencySiren, stopEmergencySiren } from '../utils/emergencySoundHelper';

type CaregiverTab = 'DASHBOARD' | 'DETAILS' | 'ALERTS' | 'SETTINGS';

export const CaregiverTabNavigator: React.FC = () => {
  const { patients } = usePatient();
  const { notifications, markAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<CaregiverTab>('DASHBOARD');
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);
  const [activeSOSAlert, setActiveSOSAlert] = useState<any | null>(null);

  const activePatientId = selectedPatientId || (patients.length > 0 ? patients[0].id : undefined);

  useEffect(() => {
    const sosNotif = notifications.find(
      (n) => !n.isRead && ((n.type as any) === 'SOS' || n.type === 'EMERGENCY' || n.title.includes('SOS') || n.title.includes('Emergency'))
    );

    if (sosNotif) {
      setActiveSOSAlert(sosNotif);
      playEmergencySiren();
    } else {
      stopEmergencySiren();
    }

    return () => {
      stopEmergencySiren();
    };
  }, [notifications]);

  const handleAcknowledgeSOS = () => {
    if (activeSOSAlert) {
      markAsRead(activeSOSAlert.id);
      setActiveSOSAlert(null);
    }
    stopEmergencySiren();
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return (
          <DashboardScreen
            onSelectPatient={(id) => {
              setSelectedPatientId(id);
              setActiveTab('DETAILS');
            }}
          />
        );
      case 'DETAILS':
        return <PatientDetailsScreen patientId={activePatientId} onBack={() => setActiveTab('DASHBOARD')} />;
      case 'ALERTS':
        return <AlertsScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const tabs: { key: CaregiverTab; label: string; icon: string }[] = [
    { key: 'DASHBOARD', label: 'Overview', icon: '📊' },
    { key: 'DETAILS', label: 'Patient Logs', icon: '🩺' },
    { key: 'ALERTS', label: 'Alerts', icon: '🚨' },
    { key: 'SETTINGS', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      {/* High-Priority Emergency Siren Modal for Caregivers */}
      <Modal visible={!!activeSOSAlert} transparent animationType="slide" onRequestClose={handleAcknowledgeSOS}>
        <View style={styles.emergencyOverlay}>
          <View style={styles.emergencyCard}>
            <Text style={styles.sirenIcon}>🚨</Text>
            <Text style={styles.emergencyTitle}>EMERGENCY SOS ALERT</Text>
            <Text style={styles.emergencySub}>
              {activeSOSAlert?.message || 'A patient has triggered an emergency help alert!'}
            </Text>
            <Text style={styles.timestampText}>Received: {activeSOSAlert?.timestamp || 'Just now'}</Text>

            <TouchableOpacity style={styles.ackBtn} onPress={handleAcknowledgeSOS} activeOpacity={0.8}>
              <Text style={styles.ackBtnText}>✓ Acknowledge & Mute Siren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.screenArea}>{renderActiveScreen()}</View>

      <View style={styles.bottomBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityRole="tab"
              accessibilityLabel={`${tab.label} tab`}
              accessibilityState={{ selected: isActive }}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.neutral.background,
  },
  screenArea: {
    flex: 1,
    height: '100%',
  },
  bottomBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    minHeight: LAYOUT.minTouchTarget,
  },
  activeTabButton: {
    borderTopWidth: 3,
    borderTopColor: COLORS.secondary.main,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginTop: 2,
  },
  activeTabLabel: {
    color: COLORS.secondary.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  emergencyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(225, 29, 72, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emergencyCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: LAYOUT.borderRadiusLg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.error.main,
    elevation: 12,
  },
  sirenIcon: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  emergencyTitle: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error.main,
    textAlign: 'center',
  },
  emergencySub: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    color: COLORS.neutral.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  timestampText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.lg,
  },
  ackBtn: {
    backgroundColor: COLORS.error.main,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: LAYOUT.borderRadiusSm,
    width: '100%',
    alignItems: 'center',
  },
  ackBtnText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.h3,
  },
});
