import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { LAYOUT, SPACING } from '../constants/spacing';
import { TYPOGRAPHY } from '../constants/typography';
import { HomeScreen } from '../screens/patient/HomeScreen';
import { MedicationScreen } from '../screens/patient/MedicationScreen';
import { ChatScreen } from '../screens/patient/ChatScreen';
import { ReportsScreen } from '../screens/patient/ReportsScreen';
import { ProfileScreen } from '../screens/patient/ProfileScreen';
import { SOSScreen } from '../screens/patient/SOSScreen';
import { WellnessScreen } from '../screens/patient/WellnessScreen';

type PatientTab = 'HOME' | 'MEDICATION' | 'CHAT' | 'REPORTS' | 'PROFILE' | 'SOS' | 'WELLNESS';

export const PatientTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PatientTab>('HOME');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <HomeScreen
            onNavigateMedication={() => setActiveTab('MEDICATION')}
            onNavigateWellness={() => setActiveTab('WELLNESS')}
            onNavigateChat={() => setActiveTab('CHAT')}
            onNavigateSOS={() => setActiveTab('SOS')}
          />
        );
      case 'MEDICATION':
        return <MedicationScreen />;
      case 'CHAT':
        return <ChatScreen />;
      case 'REPORTS':
        return <ReportsScreen />;
      case 'PROFILE':
        return <ProfileScreen />;
      case 'SOS':
        return <SOSScreen onBack={() => setActiveTab('HOME')} />;
      case 'WELLNESS':
        return <WellnessScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const tabs: { key: PatientTab; label: string; icon: string }[] = [
    { key: 'HOME', label: 'Home', icon: '🏠' },
    { key: 'MEDICATION', label: 'Meds', icon: '💊' },
    { key: 'CHAT', label: 'AI Chat', icon: '🤖' },
    { key: 'REPORTS', label: 'Reports', icon: '📋' },
    { key: 'PROFILE', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.screenArea}>{renderActiveScreen()}</View>

      {/* Accessible Bottom Tab Bar */}
      {activeTab !== 'SOS' && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
  },
  screenArea: {
    flex: 1,
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
    borderTopColor: COLORS.primary.main,
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
    color: COLORS.primary.dark,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
