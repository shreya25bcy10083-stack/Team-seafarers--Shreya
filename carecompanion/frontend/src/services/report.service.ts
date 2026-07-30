import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { MedicalReport } from '../types/Report';

const MOCK_REPORTS: MedicalReport[] = [
  {
    id: 'rep_01',
    patientId: 'usr_101',
    title: 'Complete Blood Count (CBC) & Lipid Panel',
    category: 'LAB_TEST',
    uploadDate: '2026-07-20',
    fileUrl: 'https://example.com/reports/cbc_july.pdf',
    summary: 'Blood glucose slightly elevated, cholesterol levels within target range.',
    keyFindings: [
      'Fasting Glucose: 112 mg/dL (Slightly high)',
      'HDL Cholesterol: 58 mg/dL (Good)',
      'Hemoglobin A1c: 6.2% (Pre-diabetic range monitoring)',
    ],
    simplifiedExplanation:
      'Your blood sugar is a little bit above average. Everything else looks stable! Make sure to take your Metformin as prescribed after meals.',
    requiresFollowUp: false,
  },
  {
    id: 'rep_02',
    patientId: 'usr_101',
    title: 'Cardiology Follow-Up Summary',
    category: 'GENERAL',
    uploadDate: '2026-06-15',
    fileUrl: 'https://example.com/reports/cardio_summary.pdf',
    summary: 'Regular heart rhythm confirmed. Blood pressure 128/82 mmHg.',
    keyFindings: ['ECG Normal Sinus Rhythm', 'Blood Pressure 128/82 mmHg', 'No ankle edema observed'],
    simplifiedExplanation: 'Your heart beat rhythm is completely normal! Your blood pressure medication is working well.',
    requiresFollowUp: true,
  },
];

export const ReportService = {
  async getReports(patientId?: string): Promise<ApiResponse<MedicalReport[]>> {
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.REPORT.LIST);

    if (response.success && Array.isArray(response.data)) {
      const reports: MedicalReport[] = response.data.map((r) => ({
        id: String(r.id),
        patientId: patientId || 'usr_101',
        title: r.report_name || 'Medical Report',
        category: 'GENERAL',
        uploadDate: r.uploaded_at ? r.uploaded_at.split('T')[0] : new Date().toISOString().split('T')[0],
        fileUrl: r.report_url || '',
        summary: r.ai_summary || 'Summary unavailable.',
        keyFindings: ['Report analyzed by CareCompanion AI'],
        simplifiedExplanation: r.ai_summary || 'Your report is saved safely in your portal.',
        requiresFollowUp: false,
      }));
      return {
        success: true,
        message: 'Medical reports retrieved',
        data: reports,
      };
    }

    // Fallback for mock mode
    await mockDelay(450);
    return {
      success: true,
      message: 'Medical reports retrieved (Mock Mode)',
      data: MOCK_REPORTS,
    };
  },

  async uploadReport(title: string, category: MedicalReport['category'], fileUri: string): Promise<ApiResponse<MedicalReport>> {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: `${title.replace(/\s+/g, '_')}.pdf`,
      type: 'application/pdf',
    } as any);

    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.REPORT.UPLOAD, {
      method: 'POST',
      body: formData,
      isFormData: true,
    });

    if (response.success && response.data) {
      const r = response.data;
      const created: MedicalReport = {
        id: String(r.id),
        patientId: 'usr_101',
        title: r.report_name || title,
        category,
        uploadDate: r.uploaded_at ? r.uploaded_at.split('T')[0] : new Date().toISOString().split('T')[0],
        fileUrl: r.report_url || fileUri,
        summary: r.ai_summary || 'Analysis in progress by AI Companion.',
        keyFindings: ['Document uploaded successfully'],
        simplifiedExplanation: 'We have uploaded and saved your report.',
        requiresFollowUp: false,
      };
      return {
        success: true,
        message: 'Report uploaded successfully',
        data: created,
      };
    }

    // Fallback for mock mode
    await mockDelay(1000);
    const newReport: MedicalReport = {
      id: `rep_${Date.now()}`,
      patientId: 'usr_101',
      title,
      category,
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: fileUri,
      summary: 'Analysis in progress by AI Companion.',
      keyFindings: ['Document uploaded successfully', 'Awaiting doctor validation'],
      simplifiedExplanation: 'We have processed your report. You can review the details below.',
      requiresFollowUp: false,
    };
    MOCK_REPORTS.unshift(newReport);
    return {
      success: true,
      message: 'Report uploaded successfully (Mock Mode)',
      data: newReport,
    };
  },
};
