import { useState, useEffect, useCallback } from 'react';
import { MedicalReport } from '../types/Report';
import { ReportService } from '../services/report.service';

export const useReports = (patientId?: string) => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ReportService.getReports(patientId);
      if (res.success) {
        setReports(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("We couldn't load your medical reports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const uploadReport = async (title: string, category: MedicalReport['category'], fileUri: string) => {
    try {
      const res = await ReportService.uploadReport(title, category, fileUri);
      if (res.success) {
        setReports((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
    return null;
  };

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports,
    uploadReport,
  };
};
