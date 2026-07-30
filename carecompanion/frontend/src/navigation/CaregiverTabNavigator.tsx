import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { LAYOUT, SPACING } from '../constants/spacing';
import { TYPOGRAPHY } from '../constants/typography';
import { DashboardScreen } from '../screens/caregiver/DashboardScreen';
import { PatientDetailsScreen } from '../screens/caregiver/PatientDetailsScreen';
import { AlertsScreen } from '../screens/caregiver/AlertsScreen';
import { SettingsScreen } from '../screens/caregiver/SettingsScreen';

type CaregiverTab = 'DASHBOARD' | 'DETAILS' | 'ALERTS' | 'SETTINGS';

export const CaregiverTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CaregiverTab>('DASHBOARD');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('usr_101');

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
        return <PatientDetailsScreen patientId={selectedPatientId} onBack={() => setActiveTab('DASHBOARD')} />;
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
});
