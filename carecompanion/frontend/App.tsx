import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { RootNavigator } from './src/navigation/RootNavigator';

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
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <RootNavigator />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
