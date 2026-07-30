import { ApiClient } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { MedicationItem } from '../types/Medication';

export const MedicationService = {
  async getMedications(patientId?: string): Promise<ApiResponse<MedicationItem[]>> {
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.MEDICATION.LIST);

    if (response.success && Array.isArray(response.data)) {
      const items: MedicationItem[] = response.data.map((m) => ({
        id: String(m.id),
        name: m.name || m.medicine_name,
        dosage: m.dosage || '',
        frequency: m.frequency || 'Daily',
        time: m.time || m.reminder_time || '08:00',
        instructions: m.instructions || m.notes || '',
        status: (m.status?.toUpperCase() as any) || 'PENDING',
      }));
      return {
        success: true,
        message: 'Medications loaded',
        data: items,
      };
    }

    return {
      success: true,
      message: 'No scheduled medications',
      data: [],
    };
  },

  async addMedication(medication: {
    name: string;
    dosage: string;
    frequency: string;
    time?: string;
    instructions?: string;
    patientId?: number;
  }): Promise<ApiResponse<MedicationItem>> {
    // If caregiver adding for patient
    const endpoint = medication.patientId
      ? `${API_CONFIG.ENDPOINTS.CAREGIVER.MEDICATIONS}?patient_id=${medication.patientId}&name=${encodeURIComponent(medication.name)}&dosage=${encodeURIComponent(medication.dosage)}&frequency=${encodeURIComponent(medication.frequency)}&time=${encodeURIComponent(medication.time || '08:00')}&instructions=${encodeURIComponent(medication.instructions || '')}`
      : API_CONFIG.ENDPOINTS.MEDICATION.ADD;

    const body = medication.patientId
      ? undefined
      : {
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          time: medication.time || '08:00',
          instructions: medication.instructions || '',
        };

    const response = await ApiClient.request<any>(endpoint, {
      method: 'POST',
      body,
    });

    if (response.success && response.data) {
      const m = response.data;
      const created: MedicationItem = {
        id: String(m.id),
        name: m.name || medication.name,
        dosage: m.dosage || medication.dosage,
        frequency: m.frequency || medication.frequency,
        time: m.time || medication.time || '08:00',
        instructions: m.instructions || medication.instructions || '',
        status: 'PENDING',
      };
      return {
        success: true,
        message: 'Medication added successfully',
        data: created,
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to add medication',
    };
  },

  async updateStatus(id: string, status: MedicationItem['status']): Promise<ApiResponse<void>> {
    const backendStatus = status.toLowerCase();
    const response = await ApiClient.request<void>(API_CONFIG.ENDPOINTS.MEDICATION.LOG, {
      method: 'POST',
      body: {
        medication_id: Number(id),
        status: backendStatus,
      },
    });

    if (response.success) {
      return {
        success: true,
        message: `Medication marked as ${status}`,
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to update medication status.',
    };
  },

  async deleteMedication(id: string): Promise<ApiResponse<void>> {
    const response = await ApiClient.request<void>(`${API_CONFIG.ENDPOINTS.CAREGIVER.MEDICATIONS}/${id}`, {
      method: 'DELETE',
    });

    if (response.success) {
      return {
        success: true,
        message: 'Medication deleted',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to delete medication.',
    };
  },
};
