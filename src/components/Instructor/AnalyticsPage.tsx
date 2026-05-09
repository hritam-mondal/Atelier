import { useState } from 'react';
import { useInstructor } from '../../context/InstructorContext';
import { LineChart, BarChart } from './Charts';
import { formatMoney } from '../../utils/formatInvoice';

const RANGES = ['week', 'month', 'quarter', 'year'] as const;
type Range = typeof RANGES[number];

export function AnalyticsPage() {
  const { state } = useInstructor();
  const [range, setRange] = useState<Range>('month');

  const enrollData = state.stats.enrollmentsLast30
    .slice(range === 'week' ? -7 : -30)
    .map(p => ({ label: p.date.slice(5), value: p.count }));

  const revenueData = state.stats.revenueLast12Months
    .slice(range === 'year' ? 0 : range === 'quarter' ? -3 : -1)
    .map(p => ({ label: p.month, value: p.amount }));

  const topCourses = [...state.drafts]
    .filter(d => d.status === 'published')
    .sort((a, b) => b.revenueLifetime - a.revenueLifetime);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Analytics.</h1>
        <div className="flex gap-2">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize"
              style={
                range === r
                  ? { backgroundColor: '#ece6d8', color: '#15171a' }
                  : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-xl p-5" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}>
        <h2 className="font-display tracking-tight text-lg mb-3" style={{ color: '#ece6d8' }}>
          Enrollments
        </h2>
        <LineChart data={enrollData} />
      </section>

      <section className="rounded-xl p-5" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}>
        <h2 className="font-display tracking-tight text-lg mb-3" style={{ color: '#ece6d8' }}>
          Revenue
        </h2>
        <BarChart data={revenueData} formatValue={n => formatMoney(n)} />
      </section>

      <section>
        <h2 className="font-display tracking-tight text-lg mb-4" style={{ color: '#ece6d8' }}>
          Course performance
        </h2>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(236,230,216,0.10)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal" style={{ color: '#8a857a' }}>Course</th>
                <th className="text-right px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal" style={{ color: '#8a857a' }}>Students</th>
                <th className="text-right px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal" style={{ color: '#8a857a' }}>Rating</th>
                <th className="text-right px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal" style={{ color: '#8a857a' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map(c => (
                <tr key={c.id} className="border-b last:border-b-0" style={{ borderColor: 'rgba(236,230,216,0.08)' }}>
                  <td className="px-4 py-3" style={{ color: '#ece6d8' }}>{c.title}</td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ color: '#ece6d8' }}>{c.enrollments.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ color: '#ece6d8' }}>{c.rating.toFixed(1)} ★</td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ color: '#ece6d8' }}>{formatMoney(c.revenueLifetime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
