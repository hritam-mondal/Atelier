import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, EyeOff, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import type { ModerationStatus } from '../../types/admin';

const FILTERS = ['pending', 'approved', 'removed', 'shadow_banned', 'all'] as const;
type Filter = typeof FILTERS[number];

export function ModerationQueue() {
  const { state, dispatch } = useAdmin();
  const [filter, setFilter] = useState<Filter>('pending');

  const filtered = useMemo(() => {
    let list = state.moderation;
    if (filter !== 'all') list = list.filter(i => i.status === filter);
    return [...list].sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));
  }, [state.moderation, filter]);

  const moderate = (id: string, status: ModerationStatus) => {
    dispatch({ type: 'MODERATE', id, status, actor: 'admin@atelier' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Moderation.</h1>
        <p className="text-xs" style={{ color: '#8a857a' }}>
          {state.moderation.filter(m => m.status === 'pending').length} pending
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize"
            style={
              filter === f
                ? { backgroundColor: '#ece6d8', color: '#15171a' }
                : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
            }
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="text-center py-12 text-sm" style={{ color: '#8a857a' }}>Nothing in this view.</li>
        ) : (
          filtered.map(item => (
            <li
              key={item.id}
              className="rounded-xl p-4"
              style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle size={16} style={{ color: '#c5897a' }} className="shrink-0 mt-0.5" aria-hidden />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}>
                      {item.kind.replace('_', ' ')}
                    </span>
                    <span className="text-xs" style={{ color: '#b8b3a7' }}>
                      by {item.authorName}
                    </span>
                    <span className="text-[11px]" style={{ color: '#8a857a' }}>
                      · reported {formatRelativeTime(item.reportedAt)}
                    </span>
                    <span className="text-[11px] ml-auto" style={{ color: '#c5897a' }}>
                      {item.reportCount} {item.reportCount === 1 ? 'report' : 'reports'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: '#ece6d8' }}>
                    "{item.preview}"
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.reportReasons.map(r => (
                      <span key={r} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(197,137,122,0.15)', color: '#c5897a' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {item.status === 'pending' ? (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => moderate(item.id, 'approved')} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity" style={{ border: '1px solid rgba(168,192,138,0.40)', color: '#a8c08a' }}>
                    <CheckCircle2 size={11} aria-hidden /> Approve
                  </button>
                  <button onClick={() => moderate(item.id, 'removed')} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity" style={{ border: '1px solid rgba(197,137,122,0.40)', color: '#c5897a' }}>
                    <XCircle size={11} aria-hidden /> Remove
                  </button>
                  <button onClick={() => moderate(item.id, 'shadow_banned')} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity" style={{ border: '1px solid rgba(216,197,148,0.40)', color: '#d8c594' }}>
                    <EyeOff size={11} aria-hidden /> Shadow ban
                  </button>
                </div>
              ) : (
                <p className="text-[11px] capitalize" style={{ color: '#8a857a' }}>
                  {item.status.replace('_', ' ')} · {item.reviewedAt && formatRelativeTime(item.reviewedAt)}
                </p>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
