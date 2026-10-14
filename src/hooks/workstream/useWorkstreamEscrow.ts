import { Order, Message } from '../../types';

export interface UseWorkstreamEscrowProps {
  selectedOrder?: Order | null;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

/**
 * Hook responsible for managing workstream escrow release logic.
 */
export function useWorkstreamEscrow({
  selectedOrder,
  setOrders,
  setSelectedOrder,
  setMessages
}: UseWorkstreamEscrowProps) {

  const handleReleaseEscrow = async (review: { rating: number; comment: string }) => {
    if (!selectedOrder) return;

    // 1. Update order status to completed
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'completed' } : o));
    setSelectedOrder(prev => prev ? { ...prev, status: 'completed' } : null);

    // 2. Fire system chat message
    const sysMsg: Message = {
      id: `msg_${Date.now()}`,
      orderId: selectedOrder.id,
      senderId: 'system',
      senderName: 'WorkSphere Escrow Vault',
      text: `🎉 Escrow funds ($${selectedOrder.amount.toLocaleString()}) released to seller! Workstream completed with ${review.rating}-star rating: "${review.comment}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    };
    setMessages(prev => [...prev, sysMsg]);

    // 3. Create real Review object linked to the freelancer via POST /api/reviews
    try {
      const token = localStorage.getItem('workperhour_token') || localStorage.getItem('token');
      await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          targetUserId: selectedOrder.sellerId,
          rating: review.rating,
          comment: review.comment,
          orderTitle: selectedOrder.title
        })
      });
    } catch (err) {
      console.error('Failed to persist escrow review:', err);
    }
  };

  return {
    handleReleaseEscrow
  };
}
