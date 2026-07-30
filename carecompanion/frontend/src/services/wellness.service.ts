import { mockDelay } from './api';
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
    await mockDelay(500);
    const newEntry: WellnessCheckIn = {
      id: `well_${Date.now()}`,
      patientId: 'usr_101',
      date: new Date().toISOString().split('T')[0],
      ...data,
    };
    MOCK_WELLNESS_LOGS.unshift(newEntry);
    return {
      success: true,
      message: 'Daily wellness check-in recorded',
      data: newEntry,
    };
  },

  async getLogs(patientId?: string): Promise<ApiResponse<WellnessCheckIn[]>> {
    await mockDelay(300);
    return {
      success: true,
      message: 'Wellness logs retrieved',
      data: MOCK_WELLNESS_LOGS,
    };
  },
};
