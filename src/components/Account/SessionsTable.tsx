import { Monitor, Smartphone, Tablet, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

function deviceIcon(device: string) {
  const d = device.toLowerCase();
  if (d.includes('iphone') || d.includes('android')) return Smartphone;
  if (d.includes('ipad') || d.includes('tablet')) return Tablet;
  return Monitor;
}

export function SessionsTable() {
  const { state, dispatch } = useAuth();

  const others = state.sessions.filter(s => !s.current);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: '#b8b3a7' }}>
          {state.sessions.length} active session{state.sessions.length === 1 ? '' : 's'}
        </p>
        {others.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Sign out of all other sessions?')) dispatch({ type: 'REVOKE_ALL_OTHER_SESSIONS' });
            }}
            className="text-xs hover:opacity-70 transition-opacity"
            style={{ color: '#c5897a' }}
          >
            Revoke all other sessions
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {state.sessions.map(s => {
          const Icon = deviceIcon(s.device);
          return (
            <li
              key={s.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}
            >
              <Icon size={18} style={{ color: '#ece6d8' }} aria-hidden />
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: '#ece6d8' }}>
                  {s.device}
                  {s.current && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(168,192,138,0.15)', color: '#a8c08a' }}>
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs flex items-center gap-2 mt-0.5" style={{ color: '#8a857a' }}>
                  <MapPin size={10} aria-hidden /> {s.location} · {s.ipMasked}
                  <span>·</span>
                  <span>Last active {formatRelativeTime(s.lastActiveAt)}</span>
                </p>
              </div>
              {!s.current && (
                <button
                  onClick={() => dispatch({ type: 'REVOKE_SESSION', id: s.id })}
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: '#c5897a' }}
                >
                  Revoke
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
