import { Order, UserAccount } from '../../types';
import { NavigateFunction } from 'react-router-dom';

export interface UseWorkstreamActionsProps {
  currentUser?: UserAccount | null;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  setIsStartWorkstreamModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  financeLedger: any; // Using any for existing finance engine reference
}

/**
 * Hook responsible for managing workstream action logic (starting, contacting).
 */
export function useWorkstreamActions({
  currentUser,
  setOrders,
  setSelectedOrder,
  setIsStartWorkstreamModalOpen,
  navigate,
  financeLedger
}: UseWorkstreamActionsProps) {

  const handleStartWorkstreamModalSubmit = (data: {
    title: string;
    partnerId: string;
    amount: number;
    turnaroundDays: number;
    requirements: string;
  }) => {
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      title: data.title,
      buyerId: currentUser?.id || 'admin_user',
      sellerId: data.partnerId,
      amount: data.amount,
      status: 'in_progress',
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + data.turnaroundDays * 86400000).toISOString().split('T')[0],
      requirements: data.requirements,
      feeBreakdown: financeLedger.quoteOrder(data.amount)
    };
    setOrders(prev => [...prev, newOrder]);
    setSelectedOrder(newOrder);
    navigate(`/messages/${newOrder.id}`);
    setIsStartWorkstreamModalOpen(false);
  };

  const handleContactSeller = async (sellerId: string, sellerName: string, gigTitle: string) => {
    // Existing behavior: just navigation
    navigate(`/messages?contact=${sellerId}`);
  };

  return {
    handleStartWorkstreamModalSubmit,
    handleContactSeller
  };
}
