import { useCrud } from './useCrud';
import { Order } from '../types';

export function useOrders() {
  return useCrud<Order>('/orders');
}
