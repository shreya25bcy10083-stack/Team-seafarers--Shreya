import { useState, useEffect } from 'react';
import { CaregiverPatientSummary, PatientService } from '../services/patient.service';

export const usePatient = () => {
  const [patients, setPatients] = useState<CaregiverPatientSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await PatientService.getCaregiverPatients();
      if (res.success) {
        setPatients(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Unable to load patients overview.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    isLoading,
    error,
    refetch: fetchPatients,
  };
};
