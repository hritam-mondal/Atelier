import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCheck, Trash2, Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import { NotificationItem } from './NotificationItem';
import type { NotificationKind } from '../../types/notifications';

const KIND_LABELS: Record<NotificationKind, string> = {
  instructor_replied: 'Replies',
  cohort_session_starting: 'Sessions',
  streak_at_risk: 'Streak',
  streak_milestone: 'Streak',
  goal_progress: 'Goals',
  new_review: 'Reviews',
  price_drop: 'Price drops',
  new_course_in_category: 'New launches',
  badge_earned: 'Badges',
};

const FILTERS: { key: 'all' | 'unread' | NotificationKind; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'instructor_replied', label: 'Replies' },
  { key: 'cohort_session_starting', label: 'Sessions' },
  { key: 'streak_milestone', label: 'Streak' },
  { key: 'badge_earned', label: 'Badges' },
];

export function NotificationsPage() {
  const { state, dispatch, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<typeof FILTERS[number]['key']>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = state.notifications;
    if (filter === 'unread') list = list.filter(n => !n.read);
    else if (filter !== 'all') list = list.filter(n => n.kind === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));
    }
    return list;
  }, [state.notifications, filter, query]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
        ✦ &nbsp; Activity
      </p>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight" style={{ color: '#ece6d8' }}>
          Notifications.
        </h1>
        <Link to="/account/notifications" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#ece6d8' }}>
          Preferences →
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8a857a' }} aria-hidden />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search notifications"
            className="w-full pl-9 pr-3 py-2 rounded-lg outline-none text-sm"
            style={{ border: '1px solid rgba(236,230,216,0.15)', backgroundColor: 'rgba(255,255,255,0.02)', color: '#ece6d8' }}
            aria-label="Search"
          />
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch({ type: 'MARK_ALL_READ' })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity shrink-0"
            style={{ border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
          >
            <CheckCheck size={12} aria-hidden /> Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={
              filter === f.key
                ? { backgroundColor: '#ece6d8', color: '#15171a' }
                : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(236,230,216,0.10)' }}
      >
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Bell size={28} style={{ color: '#8a857a' }} className="mx-auto mb-3" aria-hidden />
            <p className="font-display text-lg italic mb-1" style={{ color: '#b8b3a7' }}>
              No notifications match.
            </p>
            <p className="text-xs" style={{ color: '#8a857a' }}>
              Try a different filter or check back later.
            </p>
          </div>
        ) : (
          <div className="relative">
            {filtered.map(n => (
              <div key={n.id} className="relative group">
                <NotificationItem notification={n} />
                <button
                  onClick={() => dispatch({ type: 'DELETE_NOTIFICATION', id: n.id })}
                  className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-white/5"
                  aria-label="Delete notification"
                  title="Delete"
                >
                  <Trash2 size={11} style={{ color: '#8a857a' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] mt-4 text-center" style={{ color: '#8a857a' }}>
        {KIND_LABELS && '·'} Showing {filtered.length} of {state.notifications.length} total.
      </p>
    </div>
  );
}
