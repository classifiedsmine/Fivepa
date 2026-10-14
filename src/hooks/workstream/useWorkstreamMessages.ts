import { useState, useCallback } from 'react';
import { Message } from '../../types';

/**
 * Hook responsible for managing workstream messages state and API fetching behavior.
 */
export function useWorkstreamMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  const fetchMessages = useCallback(async (orderId: string) => {
    try {
      const token = localStorage.getItem('workperhour_token') || localStorage.getItem('token');
      const res = await fetch(`/api/messages/${orderId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.status === 401) {
        console.error('Authentication required for messages');
        return;
      }
      const data = res.ok ? await res.json() : [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, []);

  return {
    messages,
    setMessages,
    newMessageText,
    setNewMessageText,
    fetchMessages
  };
}
