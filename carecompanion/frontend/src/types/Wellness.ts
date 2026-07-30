export type MoodLevel = 'GREAT' | 'GOOD' | 'OKAY' | 'LOW' | 'BAD';
export type EnergyLevel = 'HIGH' | 'MODERATE' | 'LOW';

export interface WellnessCheckIn {
  id: string;
  patientId: string;
  date: string;
  mood: MoodLevel;
  energy: EnergyLevel;
  painLevel: number; // 0 to 10
  sleepHours: number;
  notes?: string;
}
