export type MedicationStatus = 'PENDING' | 'TAKEN' | 'SKIPPED' | 'MISSED';

export interface MedicationSchedule {
  time: string; // e.g. "08:00"
  dosage: string; // e.g. "1 Tablet"
  instructions?: string; // e.g. "Take after breakfast"
}

export interface MedicationItem {
  id: string;
  patientId?: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Daily", "Twice a day"
  time?: string;
  instructions?: string;
  schedules?: MedicationSchedule[];
  status: MedicationStatus;
  notes?: string;
  stockRemaining?: number;
  startDate?: string;
  endDate?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  timeLogged: string;
  scheduledTime: string;
  status: MedicationStatus;
}
