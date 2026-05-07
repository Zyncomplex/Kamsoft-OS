import { useCrud } from './useCrud';

export function useVendors() {
  return useCrud<any>('/vendors');
}
