import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { RootNavigator } from './src/navigation/RootNavigator';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CareCompanion UI Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorHeader}>⚠️ Something went wrong</Text>
          <Text style={styles.errorMsg}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (typeof localStorage !== 'undefined') {
                localStorage.clear();
              }
              window.location.reload();
            }}
          >
            <Text style={styles.retryText}>Clear Session & Reload</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleEl = document.getElementById('web-scroll-override');
      if (!styleEl) {
        const style = document.createElement('style');
        style.id = 'web-scroll-override';
        style.innerHTML = `
          html, body, #root {
            height: 100% !important;
            width: 100% !important;
            overflow-y: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #F8FAFC !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <RootNavigator />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : 400,
  },
  errorHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 12,
  },
  errorMsg: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
