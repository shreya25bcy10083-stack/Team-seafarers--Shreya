import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { InputField } from '../../components/inputs/InputField';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../types/User';

interface RegisterScreenProps {
  selectedRole: UserRole;
  onNavigateLogin?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ selectedRole, onNavigateLogin }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleRegister = async () => {
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

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

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const regResult = await AuthService.register(trimmedName, trimmedEmail, password, selectedRole);
      if (regResult.success && regResult.data) {
        // Registration auto-logs in via AuthService.register
        const loginResult = await login(trimmedEmail, password, selectedRole);
        if (!loginResult.success) {
          setErrorMessage(loginResult.message || 'Registration succeeded but login failed. Please sign in manually.');
        }
      } else {
        setErrorMessage(regResult.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabel = selectedRole === 'PATIENT' ? 'Patient' : 'Caregiver';

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Register Screen">
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up as a {roleLabel} to get started.</Text>

      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <InputField
        label="Full Name"
        placeholder="e.g. Eleanor Vance"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errorMessage) setErrorMessage(null);
        }}
        autoCapitalize="words"
      />

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
        placeholder="At least 6 characters"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errorMessage) setErrorMessage(null);
        }}
        secureTextEntry
      />

      <InputField
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errorMessage) setErrorMessage(null);
        }}
        secureTextEntry
      />

      <View style={styles.btnWrapper}>
        <PrimaryButton title="Create Account" onPress={handleRegister} isLoading={isLoading} />
      </View>

      {onNavigateLogin && (
        <TouchableOpacity style={styles.linkWrapper} onPress={onNavigateLogin}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
  errorBanner: {
    backgroundColor: COLORS.error.light,
    borderWidth: 1,
    borderColor: COLORS.error.main,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error.dark,
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
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.secondary.main,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
