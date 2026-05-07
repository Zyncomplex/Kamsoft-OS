import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useBrand } from '../contexts/BrandContext';

interface UseCrudOptions {
  autoFetch?: boolean;
  params?: Record<string, any>;
}

export function useCrud<T>(endpoint: string, options: UseCrudOptions = {}) {
  const { activeBrand } = useBrand();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (customParams?: Record<string, any>) => {
    if (!activeBrand) return;
    
    setLoading(true);
    setError(null);
    try {
      const mergedParams = { ...options.params, ...customParams };
      const queryString = new URLSearchParams(mergedParams).toString();
      const result = await api.get<{ data: T[] } | T[]>(`${endpoint}${queryString ? `?${queryString}` : ''}`);
      
      // Handle both paginated ({data: []}) and simple ([]) responses
      if (Array.isArray(result)) {
        setData(result);
      } else if (result && typeof result === 'object' && 'data' in result) {
        setData(result.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeBrand, endpoint, options.params]);

  const create = async (body: any) => {
    setLoading(true);
    try {
      const result = await api.post<T>(endpoint, body);
      setData(prev => [result, ...prev]);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, body: any) => {
    setLoading(true);
    try {
      const result = await api.patch<T>(`${endpoint}/${id}`, body);
      setData(prev => prev.map(item => (item as any).id === id ? result : item));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`${endpoint}/${id}`);
      setData(prev => prev.filter(item => (item as any).id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchAll();
    }
  }, [fetchAll, options.autoFetch]);

  return { data, loading, error, fetchAll, create, update, remove };
}
