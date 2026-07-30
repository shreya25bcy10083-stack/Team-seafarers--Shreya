import { mockDelay } from './api';
import { ApiResponse } from '../types/API';

export interface SOSAlertResponse {
  alertId: string;
  triggeredAt: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED';
  caregiverNotified: boolean;
  emergencyServicesNotified: boolean;
}

export const SOSService = {
  async triggerSOS(patientId: string): Promise<ApiResponse<SOSAlertResponse>> {
    await mockDelay(400);
    return {
      success: true,
      message: 'EMERGENCY ALERT SENT: Caregiver and contacts notified immediately.',
      data: {
        alertId: `sos_${Date.now()}`,
        triggeredAt: new Date().toISOString(),
        status: 'ACTIVE',
        caregiverNotified: true,
        emergencyServicesNotified: true,
      },
    };
  },

  async cancelSOS(alertId: string): Promise<ApiResponse<{ alertId: string }>> {
    await mockDelay(300);
    return {
      success: true,
      message: 'SOS Alert cancelled safely.',
      data: { alertId },
    };
  },
};
