import { useState, useEffect, useCallback } from 'react';
import { MedicationItem, MedicationStatus } from '../types/Medication';
import { MedicationService } from '../services/medication.service';

export const useMedication = (patientId?: string) => {
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await MedicationService.getMedications(patientId);
      if (res.success) {
        setMedications(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("We couldn't load your medications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const updateStatus = async (id: string, status: MedicationStatus) => {
    try {
      setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      await MedicationService.updateMedicationStatus(id, status);
    } catch (err) {
      // Revert status on failure
      fetchMedications();
    }
  };

  const addMedication = async (med: Partial<MedicationItem>) => {
    try {
      const res = await MedicationService.addMedication(med);
      if (res.success) {
        setMedications((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Failed to add medication', err);
    }
  };

  return {
    medications,
    isLoading,
    error,
    refetch: fetchMedications,
    updateStatus,
    addMedication,
  };
};
