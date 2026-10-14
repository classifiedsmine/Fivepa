import { Order, Message } from '../../types';

export interface UseWorkstreamDeliveryProps {
  selectedOrder?: Order | null;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

/**
 * Hook responsible for managing workstream delivery state and logic.
 */
export function useWorkstreamDelivery({
  selectedOrder,
  setOrders,
  setSelectedOrder,
  setMessages
}: UseWorkstreamDeliveryProps) {

  const handleDeliverWork = (delivery: { notes: string; files: Array<{ name: string; size: string; url: string }> }) => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'delivered' } : o));
    setSelectedOrder(prev => prev ? { ...prev, status: 'delivered' } : null);

    const sysMsg: Message = {
      id: `msg_${Date.now()}`,
      orderId: selectedOrder.id,
      senderId: 'system',
      senderName: 'WorkSphere Deliveries',
      text: `📦 Deliverables submitted for review: "${delivery.notes}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    };
    
    const fileMsgs: Message[] = delivery.files.map((file, i) => ({
      id: `msg_${Date.now()}_file_${i}`,
      orderId: selectedOrder.id,
      senderId: 'system',
      senderName: 'WorkSphere Deliveries',
      text: `File attached: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'file',
      fileInfo: file
    }));

    setMessages(prev => [...prev, sysMsg, ...fileMsgs]);
  };

  return {
    handleDeliverWork
  };
}
