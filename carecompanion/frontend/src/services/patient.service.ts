import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';

export interface CaregiverPatientSummary {
  id: string;
  name: string;
  age: number;
  healthStatus: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';
  medicationsTakenCount: number;
  totalMedicationsCount: number;
  lastCheckinTime: string;
  emergencyContact: string;
}

export const PatientService = {
  async getCaregiverPatients(): Promise<ApiResponse<CaregiverPatientSummary[]>> {
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.CAREGIVER.DASHBOARD);

    if (response.success && Array.isArray(response.data)) {
      const items: CaregiverPatientSummary[] = response.data.map((d, index) => ({
        id: String(d.id || `usr_10${index + 1}`),
        name: d.patient_name || 'Patient',
        age: d.age || 75,
        healthStatus: d.today_status === 'Happy' || d.today_status === 'GOOD' ? 'HEALTHY' : 'NEEDS_ATTENTION',
        medicationsTakenCount: d.medication_adherence ? Math.round((d.medication_adherence / 100) * 3) : 2,
        totalMedicationsCount: 3,
        lastCheckinTime: d.today_status || 'Today',
        emergencyContact: '+1 (555) 987-6543',
      }));
      return {
        success: true,
        message: 'Patients summary loaded from backend',
        data: items,
      };
    }

    // Fallback for mock mode
    await mockDelay(500);
    return {
      success: true,
      message: 'Patients summary loaded (Mock Mode)',
      data: [
        {
          id: 'usr_101',
          name: 'Eleanor Vance',
          age: 74,
          healthStatus: 'HEALTHY',
          medicationsTakenCount: 2,
          totalMedicationsCount: 3,
          lastCheckinTime: 'Today at 08:30 AM',
          emergencyContact: '+1 (555) 987-6543',
        },
        {
          id: 'usr_102',
          name: 'Arthur Pendelton',
          age: 81,
          healthStatus: 'NEEDS_ATTENTION',
          medicationsTakenCount: 1,
          totalMedicationsCount: 4,
          lastCheckinTime: 'Yesterday at 06:00 PM',
          emergencyContact: '+1 (555) 345-6789',
        },
      ],
    };
  },
};
