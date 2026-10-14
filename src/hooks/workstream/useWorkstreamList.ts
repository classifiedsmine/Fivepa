import { useMemo } from 'react';
import { Order, UserAccount, Gig, Message } from '../../types';
import { WorkstreamItem } from '../../components/workstream/types';

export interface UseWorkstreamListProps {
  orders?: Order[];
  usersList?: UserAccount[];
  gigs?: Gig[];
  messages?: Message[];
  currentUser?: UserAccount | null;
  impersonatedUser?: UserAccount | null;
}

/**
 * Hook responsible for hydrating workstream order items with related seller,
 * buyer, gig metadata, and the latest thread message details for the active user session.
 */
export function useWorkstreamList({
  orders = [],
  usersList = [],
  gigs = [],
  messages = [],
  currentUser,
  impersonatedUser
}: UseWorkstreamListProps = {}) {
  const hydratedWorkstreamItems: WorkstreamItem[] = useMemo(() => {
    const activeUid = impersonatedUser ? impersonatedUser.id : currentUser?.id;
    const relevantOrders = activeUid 
      ? orders.filter(o => o.buyerId === activeUid || o.sellerId === activeUid || currentUser?.role === 'super_admin' || currentUser?.role === 'admin')
      : orders;

    return relevantOrders.map(o => {
      const seller = usersList.find(u => u.id === o.sellerId);
      const buyer = usersList.find(u => u.id === o.buyerId);
      const gig = gigs.find(g => g.id === o.gigId);
      const lastMsg = messages.filter(m => m.orderId === o.id).slice(-1)[0];
      return {
        ...o,
        seller,
        buyer,
        gig,
        lastMessage: lastMsg ? lastMsg.text : undefined,
        lastMessageTime: lastMsg ? lastMsg.timestamp : undefined
      };
    });
  }, [orders, usersList, gigs, messages, currentUser, impersonatedUser]);

  return {
    hydratedWorkstreamItems,
    workstreams: hydratedWorkstreamItems
  };
}
