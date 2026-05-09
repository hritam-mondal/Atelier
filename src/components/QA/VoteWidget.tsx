import { ChevronUp, ChevronDown } from 'lucide-react';
import { useQA } from '../../context/QAContext';

interface Props {
  targetId: string;
  targetKind: 'question' | 'answer';
  count: number;
}

export function VoteWidget({ targetId, targetKind, count }: Props) {
  const { dispatch, currentUserId, voteOf } = useQA();
  const direction = voteOf(targetId, targetKind);

  const cast = (next: 1 | -1) => {
    dispatch({ type: 'TOGGLE_VOTE', targetId, targetKind, direction: next, userId: currentUserId });
  };

  return (
    <div className="flex flex-col items-center shrink-0">
      <button
        onClick={() => cast(1)}
        aria-label={`Upvote, current count ${count}`}
        aria-pressed={direction === 1}
        className="rounded p-1 hover:opacity-70 transition-opacity"
        style={{ color: direction === 1 ? '#a8c08a' : '#8a857a' }}
      >
        <ChevronUp size={16} />
      </button>
      <span className="text-xs font-mono tabular-nums my-0.5" style={{ color: '#ece6d8' }}>
        {count}
      </span>
      <button
        onClick={() => cast(-1)}
        aria-label="Downvote"
        aria-pressed={direction === -1}
        className="rounded p-1 hover:opacity-70 transition-opacity"
        style={{ color: direction === -1 ? '#c5897a' : '#8a857a' }}
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
}
