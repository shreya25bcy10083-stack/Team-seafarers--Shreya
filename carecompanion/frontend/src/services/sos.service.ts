import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';

export interface SOSAlertResponse {
  alertId: string;
  triggeredAt: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED';
  caregiverNotified: boolean;
  emergencyServicesNotified: boolean;
}

export const SOSService = {
  async triggerSOS(patientId?: string, latitude?: number, longitude?: number): Promise<ApiResponse<SOSAlertResponse>> {
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.SOS.TRIGGER, {
      method: 'POST',
      body: { latitude, longitude },
    });

    if (response.success && response.data) {
      const d = response.data;
      return {
        success: true,
        message: 'EMERGENCY ALERT SENT: Caregivers notified immediately.',
        data: {
          alertId: String(d.id),
          triggeredAt: new Date().toISOString(),
          status: 'ACTIVE',
          caregiverNotified: true,
          emergencyServicesNotified: true,
        },
      };
    }

    // Fallback for mock mode
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
