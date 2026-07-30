export type ReportCategory = 'LAB_TEST' | 'PRESCRIPTION' | 'DISCHARGE_SUMMARY' | 'GENERAL';

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  category: ReportCategory;
  uploadDate: string;
  fileUrl: string;
  summary: string;
  keyFindings: string[];
  simplifiedExplanation: string;
  doctorNotes?: string;
  requiresFollowUp: boolean;
}
