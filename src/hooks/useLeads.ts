import { useCrud } from './useCrud';
import { Lead } from '../types';

export function useLeads() {
  const crud = useCrud<Lead>('/leads');

  const convertToQuote = async (id: string) => {
    const { api } = await import('../lib/api');
    const result = await api.post<{ lead: Lead, quote: any }>(`/leads/${id}/convert`);
    // Refresh the list to show status change
    await crud.fetchAll();
    return result;
  };

  return { ...crud, convertToQuote };
}
