import { useAdmin } from '../../context/AdminContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import type { FlagAudience } from '../../types/admin';

export function FlagsAdminPage() {
  const { state, dispatch } = useAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Feature flags.</h1>
        <p className="text-sm mt-1" style={{ color: '#b8b3a7' }}>
          Toggle and roll out features to subsets of users. Changes are audit-logged.
        </p>
      </div>

      <div className="space-y-2">
        {state.flags.map(flag => (
          <div
            key={flag.key}
            className="rounded-xl p-4"
            style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: flag.enabled ? 'rgba(168,192,138,0.04)' : 'rgba(236,230,216,0.02)' }}
          >
            <div className="flex items-start gap-3">
              <button
                role="switch"
                aria-checked={flag.enabled}
                onClick={() => dispatch({ type: 'TOGGLE_FLAG', key: flag.key, actor: 'admin@atelier' })}
                className="relative inline-block w-9 h-5 rounded-full mt-1 shrink-0 transition-colors"
                style={{ backgroundColor: flag.enabled ? '#a8c08a' : 'rgba(236,230,216,0.15)' }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{
                    backgroundColor: flag.enabled ? '#15171a' : '#ece6d8',
                    left: flag.enabled ? '18px' : '2px',
                  }}
                />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm" style={{ color: '#ece6d8' }}>{flag.key}</p>
                <p className="text-xs mt-0.5" style={{ color: '#b8b3a7' }}>{flag.description}</p>
                <p className="text-[11px] mt-2" style={{ color: '#8a857a' }}>
                  Updated {formatRelativeTime(flag.updatedAt)}
                </p>
              </div>
            </div>

            {flag.enabled && (
              <div className="mt-3 pl-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase mb-1" style={{ color: '#b8b3a7' }}>
                    Rollout · {flag.rolloutPercent}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={flag.rolloutPercent}
                    onChange={e => dispatch({ type: 'UPDATE_FLAG', key: flag.key, patch: { rolloutPercent: Number(e.target.value) }, actor: 'admin@atelier' })}
                    className="w-full accent-[#ece6d8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase mb-1" style={{ color: '#b8b3a7' }}>
                    Audience
                  </label>
                  <select
                    value={flag.audience}
                    onChange={e => dispatch({ type: 'UPDATE_FLAG', key: flag.key, patch: { audience: e.target.value as FlagAudience }, actor: 'admin@atelier' })}
                    className="w-full px-3 py-1.5 rounded outline-none text-sm cursor-pointer"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
                  >
                    {(['all', 'students', 'instructors', 'admins'] as FlagAudience[]).map(a => (
                      <option key={a} value={a} style={{ backgroundColor: '#1d2025' }}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
