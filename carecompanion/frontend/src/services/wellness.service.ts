import { ApiClient } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { WellnessCheckIn } from '../types/Wellness';

export const WellnessService = {
  async submitCheckIn(data: Omit<WellnessCheckIn, 'id' | 'patientId' | 'date'>): Promise<ApiResponse<WellnessCheckIn>> {
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.WELLNESS.CHECKIN, {
      method: 'POST',
      body: {
        mood: data.mood,
        sleep_hours: Math.round(data.sleepHours),
        energy: data.energy,
        pain_level: data.painLevel,
        notes: data.notes || '',
      },
    });

    if (response.success && response.data) {
      const d = response.data;
      const created: WellnessCheckIn = {
        id: String(d.id),
        patientId: 'patient',
        date: new Date().toISOString().split('T')[0],
        mood: d.mood || data.mood,
        energy: d.energy_level || data.energy,
        painLevel: d.pain_level ?? data.painLevel,
        sleepHours: d.sleep_hours ?? data.sleepHours,
        notes: d.notes || data.notes,
      };
      return {
        success: true,
        message: 'Daily wellness check-in recorded',
        data: created,
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to submit wellness check-in.',
    };
  },

  async getLogs(patientId?: string): Promise<ApiResponse<WellnessCheckIn[]>> {
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.WELLNESS.HISTORY);

    if (response.success && Array.isArray(response.data)) {
      const logs: WellnessCheckIn[] = response.data.map((c) => ({
        id: String(c.id),
        patientId: patientId || 'patient',
        date: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        mood: c.mood || 'GOOD',
        energy: c.energy_level || 'HIGH',
        painLevel: c.pain_level ?? 0,
        sleepHours: c.sleep_hours ?? 8,
        notes: c.notes || '',
      }));
      return {
        success: true,
        message: 'Wellness logs retrieved',
        data: logs,
      };
    }

    return {
      success: true,
      message: 'No wellness logs found',
      data: [],
    };
  },
};
