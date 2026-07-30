import { mockDelay } from './api';
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
    await mockDelay(400);
    return {
      success: true,
      message: 'Medications loaded successfully',
      data: MOCK_MEDICATIONS,
    };
  },

  async updateMedicationStatus(id: string, status: MedicationStatus): Promise<ApiResponse<MedicationItem>> {
    await mockDelay(300);
    const med = MOCK_MEDICATIONS.find((m) => m.id === id) || MOCK_MEDICATIONS[0];
    const updated = { ...med, status };
    return {
      success: true,
      message: `Medication marked as ${status.toLowerCase()}`,
      data: updated,
    };
  },

  async addMedication(item: Partial<MedicationItem>): Promise<ApiResponse<MedicationItem>> {
    await mockDelay(500);
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
      message: 'Medication added successfully',
      data: newMed,
    };
  },
};
