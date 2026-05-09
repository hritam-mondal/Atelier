import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import { NotificationItem } from './NotificationItem';

export function NotificationBell() {
  const { state, dispatch, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-md hover:opacity-80 transition-opacity"
        style={{ color: '#ece6d8' }}
      >
        <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#c5897a' }}
            aria-hidden
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: '#15171a',
            border: '1px solid rgba(236,230,216,0.20)',
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'rgba(236,230,216,0.10)' }}
          >
            <h2 className="font-display text-base" style={{ color: '#ece6d8' }}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch({ type: 'MARK_ALL_READ' })}
                className="inline-flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
                style={{ color: '#b8b3a7' }}
              >
                <CheckCheck size={11} aria-hidden /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="font-display text-base italic mb-1" style={{ color: '#b8b3a7' }}>
                  All quiet.
                </p>
                <p className="text-xs" style={{ color: '#8a857a' }}>
                  We'll let you know when something happens.
                </p>
              </div>
            ) : (
              state.notifications.slice(0, 10).map(n => (
                <NotificationItem key={n.id} notification={n} onClose={() => setOpen(false)} />
              ))
            )}
          </div>

          <div
            className="px-4 py-3 border-t flex items-center justify-between text-xs"
            style={{ borderColor: 'rgba(236,230,216,0.10)' }}
          >
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="hover:opacity-70 transition-opacity"
              style={{ color: '#ece6d8' }}
            >
              View all
            </Link>
            <Link
              to="/account/notifications"
              onClick={() => setOpen(false)}
              className="hover:opacity-70 transition-opacity"
              style={{ color: '#b8b3a7' }}
            >
              Preferences
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
