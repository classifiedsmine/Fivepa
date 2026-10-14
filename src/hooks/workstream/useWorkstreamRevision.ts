import { Order } from '../../types';

export interface UseWorkstreamRevisionProps {
  selectedOrder?: Order | null;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

/**
 * Hook responsible for managing workstream revision request logic.
 */
export function useWorkstreamRevision({
  selectedOrder,
  setOrders,
  setSelectedOrder
}: UseWorkstreamRevisionProps) {

  const handleRequestRevision = (reason: string) => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'revision' } : o));
    setSelectedOrder(prev => prev ? { ...prev, status: 'revision' } : null);
  };

  return {
    handleRequestRevision
  };
}
