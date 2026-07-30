import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, LAYOUT } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { NotificationCard } from '../../components/cards/NotificationCard';
import { useNotifications } from '../../hooks/useNotifications';
import { playEmergencySiren, stopEmergencySiren } from '../../utils/emergencySoundHelper';

export const AlertsScreen: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();
  const [activeSOSAlert, setActiveSOSAlert] = useState<any | null>(null);

  useEffect(() => {
    // Check if any unread notification is an emergency or SOS alert
    const sosNotif = notifications.find(
      (n) => !n.isRead && ((n.type as any) === 'SOS' || n.type === 'EMERGENCY' || n.title.includes('SOS') || n.title.includes('Emergency'))
    );

    if (sosNotif) {
      setActiveSOSAlert(sosNotif);
      playEmergencySiren();
    } else {
      stopEmergencySiren();
    }

    return () => {
      stopEmergencySiren();
    };
  }, [notifications]);

  const handleAcknowledgeSOS = () => {
    if (activeSOSAlert) {
      markAsRead(activeSOSAlert.id);
      setActiveSOSAlert(null);
    }
    stopEmergencySiren();
  };

  return (
    <View style={styles.container} accessibilityLabel="Caregiver Emergency Alerts Screen">
      {/* High-Priority Emergency Siren Modal */}
      <Modal visible={!!activeSOSAlert} transparent animationType="slide" onRequestClose={handleAcknowledgeSOS}>
        <View style={styles.emergencyOverlay}>
          <View style={styles.emergencyCard}>
            <Text style={styles.sirenIcon}>🚨</Text>
            <Text style={styles.emergencyTitle}>EMERGENCY SOS ALERT</Text>
            <Text style={styles.emergencySub}>
              {activeSOSAlert?.message || 'A patient has triggered an emergency help alert!'}
            </Text>
            <Text style={styles.timestampText}>Received: {activeSOSAlert?.timestamp || 'Just now'}</Text>

            <TouchableOpacity style={styles.ackBtn} onPress={handleAcknowledgeSOS} activeOpacity={0.8}>
              <Text style={styles.ackBtnText}>✓ Acknowledge & Mute Siren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={styles.title}>Critical Patient Alerts</Text>
        <Text style={styles.subtitle}>Real-time emergency events and missed medication notifications.</Text>

        {notifications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No emergency alerts or pending notifications.</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <NotificationCard key={item.id} notification={item} onPress={() => markAsRead(item.id)} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
  },
  scrollArea: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.body,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.lg,
  },
  emptyBox: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.xl,
    borderRadius: LAYOUT.borderRadiusCard,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  emptyText: {
    color: COLORS.neutral.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
  emergencyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(225, 29, 72, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emergencyCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: LAYOUT.borderRadiusLg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.error.main,
    elevation: 12,
  },
  sirenIcon: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  emergencyTitle: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error.main,
    textAlign: 'center',
  },
  emergencySub: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    color: COLORS.neutral.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  timestampText: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.lg,
  },
  ackBtn: {
    backgroundColor: COLORS.error.main,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: LAYOUT.borderRadiusSm,
    width: '100%',
    alignItems: 'center',
  },
  ackBtnText: {
    color: COLORS.neutral.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.h3,
  },
});
