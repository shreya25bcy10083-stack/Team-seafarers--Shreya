<<<<<<< HEAD
import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
=======
import { mockDelay } from './api';
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
import { ApiResponse } from '../types/API';
import { WellnessCheckIn } from '../types/Wellness';

const MOCK_WELLNESS_LOGS: WellnessCheckIn[] = [
  {
    id: 'well_01',
    patientId: 'usr_101',
    date: new Date().toISOString().split('T')[0],
    mood: 'GOOD',
    energy: 'HIGH',
    painLevel: 2,
    sleepHours: 7.5,
    notes: 'Feeling bright and refreshed after morning walk.',
  },
];

export const WellnessService = {
  async submitCheckIn(data: Omit<WellnessCheckIn, 'id' | 'patientId' | 'date'>): Promise<ApiResponse<WellnessCheckIn>> {
<<<<<<< HEAD
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.WELLNESS.CHECKIN, {
      method: 'POST',
      body: {
        mood: data.mood,
        sleep_hours: Math.round(data.sleepHours),
        energy: data.energy,
        pain_level: data.painLevel,
        notes: data.notes,
      },
    });

    if (response.success && response.data) {
      const d = response.data;
      const created: WellnessCheckIn = {
        id: String(d.id),
        patientId: 'usr_101',
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

    // Fallback for mock mode
    await mockDelay(400);
=======
    await mockDelay(500);
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
    const newEntry: WellnessCheckIn = {
      id: `well_${Date.now()}`,
      patientId: 'usr_101',
      date: new Date().toISOString().split('T')[0],
      ...data,
    };
    MOCK_WELLNESS_LOGS.unshift(newEntry);
    return {
      success: true,
<<<<<<< HEAD
      message: 'Daily wellness check-in recorded (Mock Mode)',
=======
      message: 'Daily wellness check-in recorded',
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
      data: newEntry,
    };
  },

  async getLogs(patientId?: string): Promise<ApiResponse<WellnessCheckIn[]>> {
<<<<<<< HEAD
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.WELLNESS.HISTORY);

    if (response.success && Array.isArray(response.data)) {
      const logs: WellnessCheckIn[] = response.data.map((c) => ({
        id: String(c.id),
        patientId: patientId || 'usr_101',
        date: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        mood: c.mood || 'GOOD',
        energy: c.energy_level || 'HIGH',
        painLevel: c.pain_level ?? 0,
        sleepHours: c.sleep_hours ?? 8,
        notes: c.notes,
      }));
      return {
        success: true,
        message: 'Wellness logs retrieved from backend',
        data: logs,
      };
    }

    // Fallback for mock mode
    await mockDelay(300);
    return {
      success: true,
      message: 'Wellness logs retrieved (Mock Mode)',
=======
    await mockDelay(300);
    return {
      success: true,
      message: 'Wellness logs retrieved',
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
      data: MOCK_WELLNESS_LOGS,
    };
  },
};
