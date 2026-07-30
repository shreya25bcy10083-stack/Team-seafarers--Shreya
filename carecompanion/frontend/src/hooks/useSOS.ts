import { useState } from 'react';
import { SOSService, SOSAlertResponse } from '../services/sos.service';

export const useSOS = () => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [activeAlert, setActiveAlert] = useState<SOSAlertResponse | null>(null);

  const triggerSOS = async (patientId: string) => {
    setIsTriggering(true);
    try {
      const res = await SOSService.triggerSOS(patientId);
      if (res.success && res.data) {
        setActiveAlert(res.data);
      }
    } catch (err) {
      console.error('SOS error', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const cancelSOS = async () => {
    if (!activeAlert) return;
    try {
      await SOSService.cancelSOS(activeAlert.alertId);
      setActiveAlert(null);
    } catch (err) {
      console.error('Cancel SOS error', err);
    }
  };

  return {
    isTriggering,
    activeAlert,
    triggerSOS,
    cancelSOS,
  };
};
