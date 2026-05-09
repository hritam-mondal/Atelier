import { useState } from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const COLORS = {
  info:      { bg: 'rgba(170,186,203,0.10)', fg: '#aabacb', border: 'rgba(170,186,203,0.35)' },
  warn:      { bg: 'rgba(216,197,148,0.12)', fg: '#d8c594', border: 'rgba(216,197,148,0.35)' },
  celebrate: { bg: 'rgba(168,192,138,0.10)', fg: '#a8c08a', border: 'rgba(168,192,138,0.35)' },
} as const;

export function SiteAnnouncementBanner() {
  const { state } = useAdmin();
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const raw = sessionStorage.getItem('announce-dismissed');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  const active = state.announcements
    .filter(a => a.active && !dismissed.has(a.id))
    .filter(a => Date.parse(a.startsAt) <= Date.now() && Date.now() <= Date.parse(a.endsAt))[0];

  if (!active) return null;
  const colors = COLORS[active.kind];

  const dismiss = () => {
    const next = new Set(dismissed); next.add(active.id);
    setDismissed(next);
    try { sessionStorage.setItem('announce-dismissed', JSON.stringify([...next])); } catch { /* noop */ }
  };

  return (
    <div className="border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }} role="status">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-2 flex items-center gap-3 text-xs">
        <span style={{ color: colors.fg }}>{active.message}</span>
        {active.link && (
          <a href={active.link} className="underline underline-offset-2 hover:opacity-70" style={{ color: colors.fg }}>
            Learn more
          </a>
        )}
        <button onClick={dismiss} aria-label="Dismiss" className="ml-auto rounded p-1 hover:opacity-70 transition-opacity">
          <X size={12} style={{ color: '#b8b3a7' }} />
        </button>
      </div>
    </div>
  );
}
