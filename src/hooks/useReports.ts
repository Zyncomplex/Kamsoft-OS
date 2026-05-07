import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import { useBrand } from '../contexts/BrandContext';

export function useReports() {
  const { activeBrand } = useBrand();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSalesMetrics = useCallback(async (period?: string) => {
    if (!activeBrand) return null;
    setLoading(true);
    try {
      return await api.get(`/reports/sales?period=${period || '30d'}`);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeBrand]);

  const getLeaderboard = useCallback(async (period?: string) => {
    if (!activeBrand) return null;
    setLoading(true);
    try {
      return await api.get(`/reports/sales/leaderboard?period=${period || '30d'}`);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeBrand]);

  const getOverview = useCallback(async (period?: string) => {
    if (!activeBrand) return null;
    setLoading(true);
    try {
      return await api.get(`/reports/overview?period=${period || '30d'}`);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeBrand]);

  return { loading, error, getSalesMetrics, getLeaderboard, getOverview };
}
