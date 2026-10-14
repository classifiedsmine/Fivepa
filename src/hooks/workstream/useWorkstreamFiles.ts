import { useMemo } from 'react';
import { SharedFileItem } from '../../components/workstream/types';
import { Message } from '../../types';

export interface UseWorkstreamFilesProps {
  selectedOrder?: { id: string } | null;
  messages?: Message[];
}

/**
 * Hook responsible for deriving active shared files from workstream messages.
 */
export function useWorkstreamFiles({
  selectedOrder,
  messages = []
}: UseWorkstreamFilesProps = {}) {
  const activeSharedFiles: SharedFileItem[] = useMemo(() => {
    if (!selectedOrder) return [];
    return messages
      .filter(m => m.orderId === selectedOrder.id && (m.type === 'file' || m.fileInfo))
      .map(m => ({
        id: m.id,
        name: m.fileInfo?.name || 'attachment.pdf',
        size: m.fileInfo?.size || '1.0 MB',
        url: m.fileInfo?.url || '#',
        uploadedAt: m.timestamp,
        uploadedBy: m.senderName
      }));
  }, [selectedOrder, messages]);

  return {
    activeSharedFiles
  };
}
