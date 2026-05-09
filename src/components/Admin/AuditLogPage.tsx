import { useAdmin } from '../../context/AdminContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

export function AuditLogPage() {
  const { state } = useAdmin();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Audit log.</h1>
      <p className="text-sm" style={{ color: '#b8b3a7' }}>
        Every privileged action across the studio. The most recent {state.audit.length} entries.
      </p>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(236,230,216,0.10)' }}>
        <ul>
          {state.audit.map(entry => (
            <li
              key={entry.id}
              className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
              style={{ borderColor: 'rgba(236,230,216,0.08)' }}
            >
              <span className="font-mono text-xs px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: 'rgba(236,230,216,0.08)', color: '#ece6d8' }}>
                {entry.action}
              </span>
              <span className="text-xs flex-1 truncate font-mono" style={{ color: '#b8b3a7' }}>{entry.target}</span>
              <span className="text-xs" style={{ color: '#8a857a' }}>{entry.actor}</span>
              <span className="text-[11px]" style={{ color: '#8a857a' }}>{formatRelativeTime(entry.at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
