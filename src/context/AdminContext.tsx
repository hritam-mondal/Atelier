import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { AdminState, AdminAction, AuditLogEntry } from '../types/admin';
import { initialAdminState } from '../data/mockAdmin';

const STORAGE_KEY = 'admin-state-v1';

function appendAudit(state: AdminState, entry: Omit<AuditLogEntry, 'id' | 'at'>): AdminState {
  return {
    ...state,
    audit: [
      { id: `au_${Date.now()}`, at: new Date().toISOString(), ...entry },
      ...state.audit,
    ].slice(0, 100),
  };
}

function reducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'MODERATE': {
      const item = state.moderation.find(m => m.id === action.id);
      if (!item) return state;
      const next = appendAudit(state, { actor: action.actor, action: `mod.${action.status}`, target: `${item.kind}:${item.contentId}` });
      return {
        ...next,
        moderation: state.moderation.map(m => m.id === action.id ? { ...m, status: action.status, reviewedAt: new Date().toISOString() } : m),
      };
    }
    case 'TOGGLE_FLAG': {
      const flag = state.flags.find(f => f.key === action.key);
      if (!flag) return state;
      const next = appendAudit(state, { actor: action.actor, action: 'flag.toggled', target: action.key });
      return {
        ...next,
        flags: state.flags.map(f => f.key === action.key ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() } : f),
      };
    }
    case 'UPDATE_FLAG': {
      const next = appendAudit(state, { actor: action.actor, action: 'flag.updated', target: action.key });
      return {
        ...next,
        flags: state.flags.map(f => f.key === action.key ? { ...f, ...action.patch, updatedAt: new Date().toISOString() } : f),
      };
    }
    case 'ADD_ANNOUNCEMENT':
      return {
        ...appendAudit(state, { actor: 'admin@atelier', action: 'announce.created', target: `announcement:${action.announcement.id}` }),
        announcements: [action.announcement, ...state.announcements],
      };
    case 'TOGGLE_ANNOUNCEMENT':
      return {
        ...state,
        announcements: state.announcements.map(a => a.id === action.id ? { ...a, active: !a.active } : a),
      };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ContextValue {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  isFlagOn: (key: string) => boolean;
}

const AdminContext = createContext<ContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialAdminState);
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

  const value = useMemo<ContextValue>(() => {
    const isFlagOn = (key: string) => {
      const f = state.flags.find(x => x.key === key);
      if (!f || !f.enabled) return false;
      if (f.rolloutPercent >= 100) return true;
      // Stable bucket from user id (we use a constant for now)
      const bucket = 0; // mock current user always in bucket 0
      return bucket < f.rolloutPercent;
    };
    return { state, dispatch, isFlagOn };
  }, [state]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function useFeatureFlag(key: string): boolean {
  const ctx = useContext(AdminContext);
  if (!ctx) return false;
  return ctx.isFlagOn(key);
}
