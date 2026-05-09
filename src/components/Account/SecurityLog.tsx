import { LogIn, Lock, Shield, ShieldOff, LogOut, Link2, Unlink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import type { SecurityEventKind } from '../../types/account';

const ICONS: Record<SecurityEventKind, LucideIcon> = {
  login: LogIn,
  password_change: Lock,
  '2fa_enabled': Shield,
  '2fa_disabled': ShieldOff,
  session_revoked: LogOut,
  oauth_connected: Link2,
  oauth_disconnected: Unlink,
};

const LABELS: Record<SecurityEventKind, string> = {
  login: 'Signed in',
  password_change: 'Password changed',
  '2fa_enabled': 'Two-factor enabled',
  '2fa_disabled': 'Two-factor disabled',
  session_revoked: 'Session revoked',
  oauth_connected: 'OAuth provider connected',
  oauth_disconnected: 'OAuth provider disconnected',
};

export function SecurityLog() {
  const { state } = useAuth();

  return (
    <ul className="space-y-2">
      {state.securityLog.slice(0, 12).map(event => {
        const Icon = ICONS[event.kind];
        return (
          <li
            key={event.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{ border: '1px solid rgba(236,230,216,0.08)' }}
          >
            <Icon size={14} style={{ color: '#b8b3a7' }} aria-hidden />
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: '#ece6d8' }}>{LABELS[event.kind]}</p>
              <p className="text-xs" style={{ color: '#8a857a' }}>
                {event.device} · {event.ipMasked}
              </p>
            </div>
            <p className="text-xs shrink-0" style={{ color: '#8a857a' }}>
              {formatRelativeTime(event.at)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
