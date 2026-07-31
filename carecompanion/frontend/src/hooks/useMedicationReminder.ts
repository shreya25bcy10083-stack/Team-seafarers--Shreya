import { useState, useEffect, useRef } from 'react';
import { MedicationItem } from '../types/Medication';

const normalizeTime = (rawTime: string): string => {
  if (!rawTime) return '';
  let str = rawTime.trim();
  let period: string | null = null;

  if (str.toUpperCase().includes('AM')) {
    period = 'AM';
    str = str.replace(/AM/gi, '').trim();
  } else if (str.toUpperCase().includes('PM')) {
    period = 'PM';
    str = str.replace(/PM/gi, '').trim();
  }

  const parts = str.split(':');
  if (parts.length < 2) return '';
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0').slice(0, 2);

  if (isNaN(hours)) return '';

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

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
      const nowTimestamp = Date.now();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const dueMed = medications.find((med) => {
        if (med.status !== 'PENDING') return false;

        // Check if snoozed within last 15 minutes
        const lastSnoozed = snoozedIds.current[med.id];
        if (lastSnoozed && nowTimestamp - lastSnoozed < 15 * 60 * 1000) {
          return false;
        }

        const medTime = med.time || med.schedules?.[0]?.time;
        if (!medTime) return false;

        const cleanedTime = normalizeTime(medTime);
        if (!cleanedTime) return false;

        const [h, m] = cleanedTime.split(':').map((num) => parseInt(num, 10));
        const medMinutes = h * 60 + m;

        // Trigger if current time is within 30 minutes after scheduled time
        const diffMinutes = currentMinutes - medMinutes;
        return diffMinutes >= 0 && diffMinutes <= 30;
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
