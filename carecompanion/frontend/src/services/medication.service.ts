import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { MedicationItem, MedicationStatus } from '../types/Medication';

const MOCK_MEDICATIONS: MedicationItem[] = [
  {
    id: 'med_01',
    patientId: 'usr_101',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once Daily',
    schedules: [{ time: '08:00 AM', dosage: '1 Tablet', instructions: 'Take after breakfast with water' }],
    status: 'PENDING',
    notes: 'For blood pressure control',
    stockRemaining: 24,
    startDate: '2026-01-01',
  },
  {
    id: 'med_02',
    patientId: 'usr_101',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice Daily',
    schedules: [
      { time: '08:30 AM', dosage: '1 Tablet', instructions: 'Take with food' },
      { time: '07:00 PM', dosage: '1 Tablet', instructions: 'Take with dinner' },
    ],
    status: 'TAKEN',
    notes: 'For blood sugar management',
    stockRemaining: 40,
    startDate: '2026-01-01',
  },
  {
    id: 'med_03',
    patientId: 'usr_101',
    name: 'Calcium + Vitamin D',
    dosage: '600mg',
    frequency: 'Once Daily',
    schedules: [{ time: '01:00 PM', dosage: '1 Capsule', instructions: 'Take afternoon' }],
    status: 'PENDING',
    notes: 'Bone strength supplement',
    stockRemaining: 15,
    startDate: '2026-02-01',
  },
];

export const MedicationService = {
  async getMedications(patientId?: string): Promise<ApiResponse<MedicationItem[]>> {
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.MEDICATION.LIST);

    if (response.success && Array.isArray(response.data)) {
      const items: MedicationItem[] = response.data.map((m) => ({
        id: String(m.id),
        patientId: patientId || 'usr_101',
        name: m.name || m.medicine_name || 'Medication',
        dosage: m.dosage || '1 Tablet',
        frequency: m.frequency || 'Daily',
        schedules: [{ time: m.time || '09:00 AM', dosage: m.dosage || '1 Tablet' }],
        status: (m.status || 'PENDING').toUpperCase() as MedicationStatus,
        startDate: new Date().toISOString().split('T')[0],
      }));

      return {
        success: true,
        message: 'Medications loaded from backend',
        data: items,
      };
    }

    // Fallback to mock data if offline
    await mockDelay(300);
    return {
      success: true,
      message: 'Medications loaded successfully (Mock Mode)',
      data: MOCK_MEDICATIONS,
    };
  },

  async updateMedicationStatus(id: string, status: MedicationStatus): Promise<ApiResponse<MedicationItem>> {
    const backendStatus = status.toLowerCase() === 'skipped' ? 'snoozed' : status.toLowerCase();
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.MEDICATION.LOG, {
      method: 'POST',
      body: {
        medication_id: Number(id) || 1,
        status: backendStatus,
      },
    });

    if (response.success) {
      const med = MOCK_MEDICATIONS.find((m) => m.id === id) || MOCK_MEDICATIONS[0];
      return {
        success: true,
        message: `Medication marked as ${status.toLowerCase()}`,
        data: { ...med, status },
      };
    }

    // Fallback for mock mode
    await mockDelay(200);
    const med = MOCK_MEDICATIONS.find((m) => m.id === id) || MOCK_MEDICATIONS[0];
    const updated = { ...med, status };
    return {
      success: true,
      message: `Medication marked as ${status.toLowerCase()} (Mock Mode)`,
      data: updated,
    };
  },

  async addMedication(item: Partial<MedicationItem>): Promise<ApiResponse<MedicationItem>> {
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.MEDICATION.CREATE, {
      method: 'POST',
      body: {
        name: item.name,
        dosage: item.dosage,
        frequency: item.frequency,
        time: item.schedules?.[0]?.time || '09:00',
        instructions: item.notes,
      },
    });

    if (response.success && response.data) {
      const m = response.data;
      const created: MedicationItem = {
        id: String(m.id),
        patientId: item.patientId || 'usr_101',
        name: m.name || item.name || 'Medication',
        dosage: m.dosage || item.dosage || '1 Tablet',
        frequency: item.frequency || 'Daily',
        schedules: [{ time: m.time || '09:00 AM', dosage: item.dosage || '1 Tablet' }],
        status: 'PENDING',
        startDate: new Date().toISOString().split('T')[0],
      };
      return {
        success: true,
        message: 'Medication added successfully',
        data: created,
      };
    }

    // Fallback for mock mode
    await mockDelay(400);
    const newMed: MedicationItem = {
      id: `med_${Date.now()}`,
      patientId: item.patientId || 'usr_101',
      name: item.name || 'New Medication',
      dosage: item.dosage || '1 Tablet',
      frequency: item.frequency || 'Daily',
      schedules: item.schedules || [{ time: '09:00 AM', dosage: '1 Tablet' }],
      status: 'PENDING',
      notes: item.notes || '',
      stockRemaining: item.stockRemaining || 30,
      startDate: new Date().toISOString().split('T')[0],
    };
    MOCK_MEDICATIONS.push(newMed);
    return {
      success: true,
      message: 'Medication added successfully (Mock Mode)',
      data: newMed,
    };
  },
};
