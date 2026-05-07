import { useCrud } from './useCrud';

export function useActivityLogs() {
  // activity-log endpoint returns logs
  return useCrud<any>('/activity-log', { params: { limit: 10 } });
}
