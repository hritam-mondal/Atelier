import { useState } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatInvoiceDate } from '../../utils/formatInvoice';
import type { SiteAnnouncement } from '../../types/admin';

export function AnnouncementsPage() {
  const { state, dispatch } = useAdmin();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [kind, setKind] = useState<SiteAnnouncement['kind']>('info');

  const submit = () => {
    if (!message.trim()) return;
    const ann: SiteAnnouncement = {
      id: `ann_${Date.now()}`,
      message: message.trim(),
      link: link.trim() || undefined,
      kind,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      active: true,
    };
    dispatch({ type: 'ADD_ANNOUNCEMENT', announcement: ann });
    setOpen(false);
    setMessage(''); setLink(''); setKind('info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Announcements.</h1>
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          <Plus size={13} aria-hidden /> New
        </button>
      </div>

      {open && (
        <div className="rounded-xl p-5 space-y-3" style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Site-wide message"
            className="w-full px-3 py-2 rounded outline-none text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
          />
          <input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="Optional link"
            className="w-full px-3 py-2 rounded outline-none text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
          />
          <div className="flex gap-2">
            {(['info', 'warn', 'celebrate'] as const).map(k => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize"
                style={
                  kind === k
                    ? { backgroundColor: '#ece6d8', color: '#15171a' }
                    : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
                }
              >
                {k}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-full text-xs hover:opacity-70" style={{ color: '#b8b3a7' }}>Cancel</button>
            <button onClick={submit} className="px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-80" style={{ backgroundColor: '#ece6d8', color: '#15171a' }}>
              Post
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {state.announcements.length === 0 ? (
          <li className="text-center py-12 text-sm" style={{ color: '#8a857a' }}>No announcements yet.</li>
        ) : (
          state.announcements.map(a => (
            <li
              key={a.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: a.active ? 'rgba(168,192,138,0.04)' : 'rgba(236,230,216,0.02)' }}
            >
              <Megaphone size={14} style={{ color: a.active ? '#a8c08a' : '#8a857a' }} aria-hidden />
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: '#ece6d8' }}>{a.message}</p>
                <p className="text-[11px]" style={{ color: '#8a857a' }}>
                  {a.kind} · {formatInvoiceDate(a.startsAt)} → {formatInvoiceDate(a.endsAt)}
                </p>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_ANNOUNCEMENT', id: a.id })}
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: a.active ? '#c5897a' : '#a8c08a' }}
              >
                {a.active ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
