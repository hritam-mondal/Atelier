import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { UserState, UserAction } from '../types/dashboard';
import { mockUserState } from '../data/mockUserState';

const STORAGE_KEY = `user-state:${mockUserState.user.id}`;

function reducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        enrollments: state.enrollments.map(e =>
          e.courseId === action.courseId ? { ...e, isFavorite: !e.isFavorite } : e
        ),
      };
    case 'TOGGLE_ARCHIVE':
      return {
        ...state,
        enrollments: state.enrollments.map(e =>
          e.courseId === action.courseId ? { ...e, isArchived: !e.isArchived } : e
        ),
      };
    case 'REMOVE_ENROLLMENT':
      return {
        ...state,
        enrollments: state.enrollments.filter(e => e.courseId !== action.courseId),
      };
    case 'ENROLL_COURSE': {
      if (state.enrollments.some(e => e.courseId === action.courseId)) return state;
      const now = new Date().toISOString();
      return {
        ...state,
        enrollments: [
          ...state.enrollments,
          {
            courseId: action.courseId,
            enrolledAt: now,
            lastAccessedAt: now,
            progressPercent: 0,
            completedLectureIds: [],
            currentLectureId: '',
            isArchived: false,
            isFavorite: false,
          },
        ],
        // Remove from wishlist if it was there
        wishlist: state.wishlist.filter(id => id !== action.courseId),
      };
    }
    case 'ADD_WISHLIST':
      if (state.wishlist.includes(action.courseId)) return state;
      return { ...state, wishlist: [...state.wishlist, action.courseId] };
    case 'REMOVE_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(id => id !== action.courseId) };
    case 'MOVE_TO_CART':
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.courseId),
        cart: state.cart.includes(action.courseId) ? state.cart : [...state.cart, action.courseId],
      };
    case 'SET_WEEKLY_GOAL':
      return { ...state, learningGoals: { ...state.learningGoals, weeklyMinutes: action.minutes } };
    case 'ADD_ACTIVITY':
      return { ...state, recentActivity: [action.event, ...state.recentActivity].slice(0, 100) };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ContextValue {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<ContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, mockUserState);
  const initialized = useRef(false);

  // Hydrate from localStorage on first mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserState>;
        dispatch({ type: 'HYDRATE', state: parsed });
      }
    } catch { /* noop */ }
  }, []);

  // Persist on change (skip first run before hydration)
  useEffect(() => {
    if (!initialized.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        enrollments: state.enrollments,
        wishlist: state.wishlist,
        cart: state.cart,
        learningGoals: state.learningGoals,
      }));
    } catch { /* noop */ }
  }, [state.enrollments, state.wishlist, state.cart, state.learningGoals]);

  // Cross-tab updates: listen for activity events broadcast from elsewhere
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('learning-activity');
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'ADD_ACTIVITY' && e.data.event) {
        dispatch({ type: 'ADD_ACTIVITY', event: e.data.event });
      }
    };
    channel.addEventListener('message', onMsg);
    return () => {
      channel.removeEventListener('message', onMsg);
      channel.close();
    };
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
