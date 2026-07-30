import { useState, useEffect, useCallback } from 'react';
import { WellnessCheckIn } from '../types/Wellness';
import { WellnessService } from '../services/wellness.service';

export const useWellness = () => {
  const [logs, setLogs] = useState<WellnessCheckIn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await WellnessService.getLogs();
      if (res.success && res.data) {
        setLogs(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Unable to load wellness records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const latestLog = logs.length > 0 ? logs[0] : null;

  return {
    logs,
    latestLog,
    isLoading,
    error,
    refetch: fetchLogs,
  };
};
