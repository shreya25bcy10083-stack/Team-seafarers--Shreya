import { mockDelay } from './api';
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
    await mockDelay(500);
    return {
      success: true,
      message: 'Patients summary loaded',
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
