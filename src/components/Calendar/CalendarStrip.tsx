import { useState } from 'react';
import { Calendar, MapPin, Download } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import { downloadIcs } from '../../utils/generateIcs';
import type { ScheduledEvent } from '../../types/notifications';

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
function formatEventTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function CalendarStrip() {
  const { state } = useNotifications();
  const upcoming = state.events
    .filter(e => new Date(e.startsAt).getTime() > Date.now() - 60 * 60_000)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);

  const [openEvent, setOpenEvent] = useState<ScheduledEvent | null>(null);

  if (upcoming.length === 0) return null;

  return (
    <section
      className="rounded-xl border border-white/10 p-5"
      style={{ backgroundColor: '#22252b' }}
      aria-label="Upcoming sessions"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display tracking-tight text-base" style={{ color: '#ece6d8' }}>
          Upcoming live sessions
        </h3>
      </div>
      <ul className="space-y-2">
        {upcoming.map(event => (
          <li
            key={event.id}
            className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-white/[0.02] transition-colors"
            style={{ border: '1px solid rgba(236,230,216,0.10)' }}
            onClick={() => setOpenEvent(event)}
          >
            <span
              className="shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
              style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}
              aria-hidden
            >
              <Calendar size={14} style={{ color: '#ece6d8' }} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: '#ece6d8' }}>{event.title}</p>
              <p className="text-xs" style={{ color: '#8a857a' }}>
                {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); downloadIcs(event); }}
              className="text-xs hover:opacity-70 transition-opacity inline-flex items-center gap-1 shrink-0"
              style={{ color: '#b8b3a7' }}
              aria-label="Download .ics"
            >
              <Download size={11} aria-hidden /> .ics
            </button>
          </li>
        ))}
      </ul>

      {/* Detail modal */}
      {openEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={openEvent.title}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setOpenEvent(null)} aria-hidden />
          <div
            className="relative w-full max-w-md rounded-xl shadow-2xl p-6"
            style={{ backgroundColor: '#1d2025', border: '1px solid rgba(236,230,216,0.20)' }}
          >
            <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
              ✦ &nbsp; Live session
            </p>
            <h2 className="font-display text-2xl tracking-tight mb-2" style={{ color: '#ece6d8' }}>
              {openEvent.title}
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#b8b3a7' }}>
              {openEvent.description}
            </p>
            <dl className="space-y-2 text-sm mb-5">
              <Row label="When" value={`${formatEventDate(openEvent.startsAt)} · ${formatEventTime(openEvent.startsAt)} – ${formatEventTime(openEvent.endsAt)}`} />
              <Row
                label="Where"
                value={
                  <a href={openEvent.location} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline" style={{ color: '#ece6d8' }}>
                    <MapPin size={11} aria-hidden /> Live link
                  </a>
                }
              />
            </dl>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => downloadIcs(openEvent)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
              >
                <Download size={12} aria-hidden /> Add to calendar
              </button>
              <button
                onClick={() => setOpenEvent(null)}
                className="px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity"
                style={{ color: '#b8b3a7' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-xs w-14 shrink-0" style={{ color: '#8a857a' }}>{label}</dt>
      <dd style={{ color: '#ece6d8' }}>{value}</dd>
    </div>
  );
}
