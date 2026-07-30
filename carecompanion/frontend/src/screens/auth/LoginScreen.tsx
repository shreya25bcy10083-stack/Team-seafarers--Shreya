import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { InputField } from '../../components/inputs/InputField';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/User';

interface LoginScreenProps {
  onNavigateRegister?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleLogin = async () => {
    setErrorMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMessage('Invalid email format. (e.g. user@gmail.com)');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const result = await login(trimmedEmail, password, selectedRole);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Login failed. Invalid credentials.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Login Screen">
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to access your healthcare companion.</Text>

      <View style={styles.roleToggle}>
        <TouchableOpacity
          style={[styles.roleTab, selectedRole === 'PATIENT' && styles.roleTabActive]}
          onPress={() => setSelectedRole('PATIENT')}
          accessibilityRole="button"
          accessibilityLabel="Select Patient Role"
        >
          <Text style={[styles.roleTabText, selectedRole === 'PATIENT' && styles.roleTabTextActive]}>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleTab, selectedRole === 'CAREGIVER' && styles.roleTabActive]}
          onPress={() => setSelectedRole('CAREGIVER')}
          accessibilityRole="button"
          accessibilityLabel="Select Caregiver Role"
        >
          <Text style={[styles.roleTabText, selectedRole === 'CAREGIVER' && styles.roleTabTextActive]}>Caregiver</Text>
        </TouchableOpacity>
      </View>

      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <InputField
        label="Email Address"
        placeholder="e.g. eleanor@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errorMessage) setErrorMessage(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errorMessage) setErrorMessage(null);
        }}
        secureTextEntry
      />

      <View style={styles.btnWrapper}>
        <PrimaryButton title="Sign In" onPress={handleLogin} isLoading={isLoading} />
      </View>

      {onNavigateRegister && (
        <TouchableOpacity style={styles.linkWrapper} onPress={onNavigateRegister}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    backgroundColor: COLORS.neutral.background,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  roleTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleTabActive: {
    backgroundColor: COLORS.neutral.white,
  },
  roleTabText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral.textSecondary,
  },
  roleTabTextActive: {
    color: COLORS.primary.main,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  errorBanner: {
    backgroundColor: COLORS.semantic.errorBg || '#FEE2E2',
    borderWidth: 1,
    borderColor: COLORS.semantic.error || '#EF4444',
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.semantic.error || '#DC2626',
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
  },
  btnWrapper: {
    marginTop: SPACING.md,
  },
  linkWrapper: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary.main,
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
