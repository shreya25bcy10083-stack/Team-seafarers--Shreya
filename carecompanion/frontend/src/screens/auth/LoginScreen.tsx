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
  selectedRole: UserRole;
  onNavigateRegister?: () => void;
  onNavigateBack?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ selectedRole, onNavigateRegister, onNavigateBack }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (emailStr: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

  const roleLabel = selectedRole === 'PATIENT' ? 'Patient' : 'Caregiver';

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Login Screen">
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in as a {roleLabel} to access your healthcare companion.</Text>

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

      {onNavigateBack && (
        <TouchableOpacity style={styles.backWrapper} onPress={onNavigateBack}>
          <Text style={styles.backText}>← Back to Role Selection</Text>
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
  backWrapper: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  backText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
