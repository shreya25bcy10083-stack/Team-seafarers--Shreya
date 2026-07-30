import { useState, useEffect, useRef } from 'react';
import { MedicationItem } from '../types/Medication';

export const useMedicationReminder = (
  medications: MedicationItem[],
  updateStatus: (id: string, status: MedicationItem['status']) => Promise<void>
) => {
  const [activeAlarmMedication, setActiveAlarmMedication] = useState<MedicationItem | null>(null);
  const snoozedIds = useRef<Record<string, number>>({});

  useEffect(() => {
    const checkReminders = () => {
      if (activeAlarmMedication) return; // Alarm already active

      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const nowTimestamp = Date.now();

      const dueMed = medications.find((med) => {
        if (med.status !== 'PENDING') return false;

        // Check if snoozed within last 15 minutes
        const lastSnoozed = snoozedIds.current[med.id];
        if (lastSnoozed && nowTimestamp - lastSnoozed < 15 * 60 * 1000) {
          return false;
        }

        const medTime = med.time || med.schedules?.[0]?.time;
        if (!medTime) return false;

        // Clean time string (e.g., "08:00 AM" -> "08:00")
        let cleanedTime = medTime.trim();
        if (cleanedTime.includes(' ')) {
          const parts = cleanedTime.split(' ');
          const timeParts = parts[0].split(':');
          let hours = parseInt(timeParts[0], 10);
          const minutes = timeParts[1] || '00';
          const period = parts[1].toUpperCase();

          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;

          cleanedTime = `${String(hours).padStart(2, '0')}:${minutes}`;
        }

        return cleanedTime === currentHHMM;
      });

      if (dueMed) {
        setActiveAlarmMedication(dueMed);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [medications, activeAlarmMedication]);

  const handleTakeAlarm = async () => {
    if (activeAlarmMedication) {
      const id = activeAlarmMedication.id;
      setActiveAlarmMedication(null);
      await updateStatus(id, 'TAKEN');
    }
  };

  const handleSnoozeAlarm = () => {
    if (activeAlarmMedication) {
      snoozedIds.current[activeAlarmMedication.id] = Date.now();
      setActiveAlarmMedication(null);
    }
  };

  const handleSkipAlarm = async () => {
    if (activeAlarmMedication) {
      const id = activeAlarmMedication.id;
      setActiveAlarmMedication(null);
      await updateStatus(id, 'SKIPPED');
    }
  };

  return {
    activeAlarmMedication,
    triggerTestAlarm: (med: MedicationItem) => setActiveAlarmMedication(med),
    handleTakeAlarm,
    handleSnoozeAlarm,
    handleSkipAlarm,
  };
};
