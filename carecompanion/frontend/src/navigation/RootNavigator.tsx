import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
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
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'CAREGIVER'>('PATIENT');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Initializing CareCompanion..." />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.background} />
        {authView === 'ROLE' ? (
          <RoleSelectionScreen
            onSelectRole={(role) => {
              setSelectedRole(role);
              setAuthView('LOGIN');
            }}
          />
        ) : (
          <LoginScreen onNavigateRegister={() => setAuthView('ROLE')} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.white} />
      {user.role === 'PATIENT' ? <PatientTabNavigator /> : <CaregiverTabNavigator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : undefined,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : undefined,
  },
});
