import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { AuthState, AuthAction, SecurityEvent } from '../types/account';
import { initialAuthState } from '../data/mockAccount';

const STORAGE_KEY = 'auth-state-v1';

function appendLog(state: AuthState, kind: SecurityEvent['kind']): AuthState {
  const event: SecurityEvent = {
    id: `log_${Date.now()}`,
    kind,
    at: new Date().toISOString(),
    ipMasked: '73.x.x.42',
    device: 'MacBook Pro · Chrome',
  };
  return { ...state, securityLog: [event, ...state.securityLog].slice(0, 50) };
}

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGN_IN':
      return appendLog(
        { ...state, signedIn: true, email: action.email, role: action.role, emailVerified: true },
        'login'
      );
    case 'SIGN_OUT':
      return { ...state, signedIn: false, email: '', role: 'student' };
    case 'VERIFY_EMAIL':
      return { ...state, emailVerified: true };
    case 'UPDATE_PROFILE':
      return { ...state, profile: action.profile };
    case 'UPDATE_NOTIFICATION_PREFS':
      return { ...state, notificationPrefs: action.prefs };
    case 'ENABLE_2FA':
      return appendLog(
        { ...state, twoFactorEnabled: true, pendingRecoveryCodes: action.recoveryCodes },
        '2fa_enabled'
      );
    case 'DISABLE_2FA':
      return appendLog({ ...state, twoFactorEnabled: false, pendingRecoveryCodes: undefined }, '2fa_disabled');
    case 'CLEAR_RECOVERY_CODES':
      return { ...state, pendingRecoveryCodes: undefined };
    case 'CONNECT_OAUTH': {
      if (state.oauthConnections.some(c => c.provider === action.connection.provider)) return state;
      return appendLog(
        { ...state, oauthConnections: [...state.oauthConnections, action.connection] },
        'oauth_connected'
      );
    }
    case 'DISCONNECT_OAUTH':
      return appendLog(
        { ...state, oauthConnections: state.oauthConnections.filter(c => c.provider !== action.provider) },
        'oauth_disconnected'
      );
    case 'REVOKE_SESSION':
      return appendLog({ ...state, sessions: state.sessions.filter(s => s.id !== action.id) }, 'session_revoked');
    case 'REVOKE_ALL_OTHER_SESSIONS':
      return appendLog({ ...state, sessions: state.sessions.filter(s => s.current) }, 'session_revoked');
    case 'RECORD_PASSWORD_CHANGE':
      return appendLog(state, 'password_change');
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ContextValue {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<ContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
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

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
