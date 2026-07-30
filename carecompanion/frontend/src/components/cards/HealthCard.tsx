import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { LAYOUT, SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface HealthCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  accentColor?: string;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  title,
  value,
  subtitle,
  icon = '💚',
  accentColor = COLORS.primary.main,
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]} accessibilityLabel={`${title}: ${value}`}>
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textGroup}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: LAYOUT.borderRadiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral.textSecondary,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.neutral.textMuted,
    marginTop: 2,
  },
});
