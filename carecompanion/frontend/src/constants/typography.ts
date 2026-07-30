export const TYPOGRAPHY = {
  fontFamily: {
    primary: 'System', // Fallback to System font as per spec
  },
  fontSize: {
    display: 32,
    h1: 28,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    display: 40,
    h1: 36,
    h2: 32,
    h3: 28,
    body: 24,
    caption: 20,
    small: 16,
  },
} as const;
