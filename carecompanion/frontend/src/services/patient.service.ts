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
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.CAREGIVER.DASHBOARD);

    if (response.success && response.data) {
      const d = response.data;
      const patientInfo = d.patient_info || (Array.isArray(d.linked_patients) && d.linked_patients[0]);
      const patientName = d.patient_name || patientInfo?.name;
      const patientId = d.patient_id || patientInfo?.id;

      if (!patientName || patientName === 'No patient linked') {
        return {
          success: true,
          message: 'No patient linked yet',
          data: [],
        };
      }

      const totalMeds = Array.isArray(d.medication_schedule) ? d.medication_schedule.length : 3;
      const adherencePct = d.medication_adherence || 0;
      const takenCount = Math.round((adherencePct / 100) * Math.max(totalMeds, 1));

      const item: CaregiverPatientSummary = {
        id: String(patientId),
        name: patientName,
        age: d.age || patientInfo?.age || 70,
        healthStatus: d.today_status === 'Happy' || d.today_status === 'Calm' || d.today_status === 'GOOD' ? 'HEALTHY' : 'NEEDS_ATTENTION',
        medicationsTakenCount: takenCount,
        totalMedicationsCount: Math.max(totalMeds, 1),
        lastCheckinTime: d.today_status || 'Today',
        emergencyContact: patientInfo?.emergency_contact || 'Emergency Contact Set',
      };

      return {
        success: true,
        message: 'Patient summary loaded from backend',
        data: [item],
      };
    }

    return {
      success: true,
      message: 'No patient linked',
      data: [],
    };
  },

  async joinPatientWithCode(inviteCode: string): Promise<ApiResponse<{ message: string }>> {
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.CAREGIVER.JOIN, {
      method: 'POST',
      body: { invite_code: inviteCode.trim().toUpperCase() },
    });

    if (response.success) {
      return {
        success: true,
        message: response.message || 'Successfully linked to patient.',
        data: { message: response.message || 'Successfully linked' },
      };
    }

    return {
      success: false,
      message: response.message || 'Invalid or expired invite code.',
    };
  },

  async generateInviteCode(): Promise<ApiResponse<{ invite_code: string }>> {
    const response = await ApiClient.request<{ invite_code: string }>(API_CONFIG.ENDPOINTS.PATIENT.INVITE, {
      method: 'POST',
    });

    if (response.success && response.data?.invite_code) {
      return {
        success: true,
        message: 'Invite code generated',
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to generate invite code.',
    };
  },
};
