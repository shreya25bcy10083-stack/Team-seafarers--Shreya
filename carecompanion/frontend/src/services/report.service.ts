import { ApiClient } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { MedicalReport } from '../types/Report';

export const ReportService = {
  async getReports(patientId?: string): Promise<ApiResponse<MedicalReport[]>> {
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.REPORT.LIST);

    if (response.success && Array.isArray(response.data)) {
      const reports: MedicalReport[] = response.data.map((r) => {
        let parsedAnalysis: any = null;
        if (r.ai_summary) {
          try {
            parsedAnalysis = JSON.parse(r.ai_summary);
          } catch (e) {
            parsedAnalysis = { summary: r.ai_summary };
          }
        }

        return {
          id: String(r.id),
          patientId: patientId || 'patient',
          title: r.report_name || 'Medical Report',
          category: 'LAB_TEST',
          uploadDate: r.uploaded_at ? r.uploaded_at.split('T')[0] : new Date().toISOString().split('T')[0],
          fileUrl: r.report_url || '',
          summary: parsedAnalysis?.summary || r.ai_summary || 'Analysis complete',
          keyFindings: parsedAnalysis?.key_findings || ['Report saved in portal'],
          simplifiedExplanation: parsedAnalysis?.simplified_explanation || r.ai_summary || 'Report processed',
          doctorNotes: parsedAnalysis?.questions_for_doctor ? parsedAnalysis.questions_for_doctor.join('\n') : undefined,
          requiresFollowUp: false,
        };
      });
      return {
        success: true,
        message: 'Medical reports retrieved',
        data: reports,
      };
    }

    return {
      success: true,
      message: 'No medical reports found',
      data: [],
    };
  },

  async uploadReportFile(file: File | { uri: string; name: string; type: string }): Promise<ApiResponse<MedicalReport>> {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    }

    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.AI.REPORT_SUMMARY, {
      method: 'POST',
      body: formData,
      isFormData: true,
    });

    if (response.success && response.data) {
      const d = response.data;
      const created: MedicalReport = {
        id: String(Date.now()),
        patientId: 'patient',
        title: file.name || 'Uploaded Medical Report',
        category: 'LAB_TEST',
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: '',
        summary: d.summary || 'Summary unavailable.',
        keyFindings: d.key_findings || ['Report analyzed by CareCompanion AI'],
        simplifiedExplanation: d.simplified_explanation || d.summary || 'Report processed.',
        doctorNotes: d.questions_for_doctor ? d.questions_for_doctor.join('\n') : undefined,
        requiresFollowUp: false,
      };
      return {
        success: true,
        message: 'Report uploaded and analyzed successfully',
        data: created,
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to upload report file.',
    };
  },
};
