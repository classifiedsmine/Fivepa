import { useWorkstreamList } from './useWorkstreamList';
import { useWorkstreamFilters } from './useWorkstreamFilters';
import { useWorkstreamSelection } from './useWorkstreamSelection';
import { useWorkstreamMessages } from './useWorkstreamMessages';
import { useWorkstreamRealtime } from './useWorkstreamRealtime';
import { useWorkstreamActions } from './useWorkstreamActions';
import { useWorkstreamFiles } from './useWorkstreamFiles';
import { useWorkstreamDelivery } from './useWorkstreamDelivery';
import { useWorkstreamRevision } from './useWorkstreamRevision';
import { useWorkstreamEscrow } from './useWorkstreamEscrow';
import { useWorkstreamReview } from './useWorkstreamReview';
import { useWorkstreamMeeting } from './useWorkstreamMeeting';

/**
 * Top-level orchestration hook for all workstream sub-hooks.
 */
export function useWorkstream(props?: any) {
  const list = useWorkstreamList(props);
  const filters = useWorkstreamFilters(props);
  const selection = useWorkstreamSelection();
  const messages = useWorkstreamMessages();
  const realtime = useWorkstreamRealtime(props);
  const actions = useWorkstreamActions(props);
  const files = useWorkstreamFiles(props);
  const delivery = useWorkstreamDelivery(props);
  const revision = useWorkstreamRevision(props);
  const escrow = useWorkstreamEscrow(props);
  const review = useWorkstreamReview(props);
  const meeting = useWorkstreamMeeting(props);

  return {
    ...list,
    ...filters,
    ...selection,
    ...messages,
    ...realtime,
    ...actions,
    ...files,
    ...delivery,
    ...revision,
    ...escrow,
    ...review,
    ...meeting
  };
}
