import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { NotificationsState, NotificationsAction } from '../types/notifications';
import { mockNotifications, mockBadges, mockEvents } from '../data/mockNotifications';

const STORAGE_KEY = 'notifications-v1';

const initial: NotificationsState = {
  notifications: mockNotifications,
  badges: mockBadges,
  events: mockEvents,
  webPushPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
};

function reducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.notification, ...state.notifications].slice(0, 100) };
    case 'MARK_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n) };
    case 'MARK_ALL_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'DELETE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) };
    case 'EARN_BADGE':
      return {
        ...state,
        badges: state.badges.map(b =>
          b.id === action.badgeId && !b.earnedAt ? { ...b, earnedAt: new Date().toISOString() } : b
        ),
      };
    case 'SET_WEB_PUSH_PERMISSION':
      return { ...state, webPushPermission: action.permission };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ContextValue {
  state: NotificationsState;
  dispatch: React.Dispatch<NotificationsAction>;
  unreadCount: number;
}

const NotificationsContext = createContext<ContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) });
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
  }, [state]);

  const unreadCount = state.notifications.filter(n => !n.read).length;
  const value = useMemo(() => ({ state, dispatch, unreadCount }), [state, unreadCount]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
