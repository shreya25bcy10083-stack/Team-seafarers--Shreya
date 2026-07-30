import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { PatientTabNavigator } from './PatientTabNavigator';
import { CaregiverTabNavigator } from './CaregiverTabNavigator';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { COLORS } from '../constants/colors';
import { UserRole } from '../types/User';

import { Avatar } from '../components/avatar/Avatar';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

export const RootNavigator: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [authView, setAuthView] = useState<'ROLE' | 'LOGIN' | 'REGISTER'>('ROLE');
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Initializing CareCompanion..." />
      </View>
    );
  }

  if (showSplash && (!isAuthenticated || !user)) {
    return (
      <View style={styles.splashContainer} accessibilityLabel="Splash Screen">
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary.light} />
        <Avatar state="GREETING" size="lg" showLabel={false} />
        <Text style={styles.splashTitle}>CareCompanion</Text>
        <Text style={styles.splashSubtitle}>Empathetic Healthcare Companion for Seniors & Caregivers</Text>
        <View style={styles.splashBtnWrapper}>
          <PrimaryButton
            title="Get Started →"
            onPress={() => setShowSplash(false)}
            variant="blue"
          />
        </View>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.background} />
        {authView === 'ROLE' && (
          <RoleSelectionScreen
            onSelectRole={(role) => {
              setSelectedRole(role);
              setAuthView('LOGIN');
            }}
          />
        )}
        {authView === 'LOGIN' && (
          <LoginScreen
            selectedRole={selectedRole}
            onNavigateRegister={() => setAuthView('REGISTER')}
            onNavigateBack={() => setAuthView('ROLE')}
          />
        )}
        {authView === 'REGISTER' && (
          <RegisterScreen
            selectedRole={selectedRole}
            onNavigateLogin={() => setAuthView('LOGIN')}
          />
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
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.primary.light,
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : undefined,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    marginTop: 20,
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 16,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 320,
  },
  splashBtnWrapper: {
    width: '100%',
    maxWidth: 280,
  },
});
