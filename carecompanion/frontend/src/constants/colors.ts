export const COLORS = {
  // Primary - Healthcare Green (Success, Medication Completed, Healthy Status)
  primary: {
    main: '#10B981',
    dark: '#059669',
    light: '#E6F4EA',
    contrastText: '#FFFFFF',
  },
  // Secondary - Sky Blue (Information, AI Companion, Navigation)
  secondary: {
    main: '#3B82F6',
    dark: '#2563EB',
    light: '#EFF6FF',
    contrastText: '#FFFFFF',
  },
  // Accent - Soft Purple (AI Avatar, Assistant Actions)
  accent: {
    main: '#8B5CF6',
    dark: '#7C3AED',
    light: '#F5F3FF',
    contrastText: '#FFFFFF',
  },
  // Warning - Amber (Reminders, Pending Tasks)
  warning: {
    main: '#F59E0B',
    dark: '#D97706',
    light: '#FEF3C7',
    contrastText: '#1F2937',
  },
  // Error / Danger - Red (SOS, Critical Alerts, Errors)
  error: {
    main: '#EF4444',
    dark: '#DC2626',
    light: '#FEE2E2',
    contrastText: '#FFFFFF',
  },
  // Neutrals
  neutral: {
    white: '#FFFFFF',
    background: '#F9FAFB',
    card: '#FFFFFF',
    border: '#E5E7EB',
    divider: '#F3F4F6',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    iconDefault: '#4B5563',
    darkBackground: '#111827',
  },
} as const;

export type ColorToken = typeof COLORS;
