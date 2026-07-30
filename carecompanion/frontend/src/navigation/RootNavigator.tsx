import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { PatientTabNavigator } from './PatientTabNavigator';
import { CaregiverTabNavigator } from './CaregiverTabNavigator';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { COLORS } from '../constants/colors';

export const RootNavigator: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'ROLE' | 'LOGIN'>('ROLE');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingSpinner message="Initializing CareCompanion..." />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.background} />
        {authView === 'ROLE' ? (
          <RoleSelectionScreen onSelectRole={() => setAuthView('LOGIN')} />
        ) : (
          <LoginScreen onNavigateRegister={() => setAuthView('ROLE')} />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.white} />
      {user.role === 'PATIENT' ? <PatientTabNavigator /> : <CaregiverTabNavigator />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
  },
});
