import { Download, Wallet, Calendar } from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { BarChart } from './Charts';
import { formatMoney, formatInvoiceDate } from '../../utils/formatInvoice';

export function EarningsPage() {
  const { state } = useInstructor();
  const stats = state.stats;
  const chartData = stats.revenueLast12Months.map(p => ({ label: p.month, value: p.amount }));

  const downloadStatement = () => {
    const csv = [
      'Month,Amount',
      ...stats.revenueLast12Months.map(p => `${p.month},${p.amount}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `atelier-statement-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Earnings.</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card title="This month"      value={formatMoney(stats.monthlyRevenue)} accent="#a8c08a" />
        <Card title="Lifetime"        value={formatMoney(stats.lifetimeRevenue)} accent="#ece6d8" />
        <Card title="Pending payout"  value={formatMoney(stats.pendingPayout)}   accent="#d8c594" subtitle="Next: in 12 days" />
        <Card title="Avg / student"   value={formatMoney(Math.round(stats.lifetimeRevenue / Math.max(stats.totalStudents, 1) * 100) / 100)} accent="#b8b3a7" />
      </div>

      <section
        className="rounded-xl p-5"
        style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display tracking-tight text-lg" style={{ color: '#ece6d8' }}>
              Monthly revenue
            </h2>
            <p className="text-xs" style={{ color: '#8a857a' }}>Last 12 months</p>
          </div>
          <button
            onClick={downloadStatement}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
          >
            <Download size={11} aria-hidden /> Statement (CSV)
          </button>
        </div>
        <BarChart data={chartData} formatValue={n => formatMoney(n)} />
      </section>

      <section>
        <h2 className="font-display tracking-tight text-lg mb-4" style={{ color: '#ece6d8' }}>
          Recent payouts
        </h2>
        <ul className="space-y-2">
          {state.payouts.map(p => (
            <li
              key={p.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ border: '1px solid rgba(236,230,216,0.10)' }}
            >
              <Wallet size={16} style={{ color: '#a8c08a' }} aria-hidden />
              <div className="flex-1">
                <p className="text-sm" style={{ color: '#ece6d8' }}>
                  {formatMoney(p.amount)}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: '#8a857a' }}>
                  <Calendar size={10} aria-hidden /> {formatInvoiceDate(p.paidAt)} · {p.method}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(168,192,138,0.12)', color: '#a8c08a' }}>
                Paid
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

interface CardProps { title: string; value: string; accent: string; subtitle?: string }
function Card({ title, value, accent, subtitle }: CardProps) {
  return (
    <div className="relative rounded-xl p-4" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: '#22252b' }}>
      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r" style={{ backgroundColor: accent }} aria-hidden />
      <p className="text-xs mb-1" style={{ color: '#8a857a' }}>{title}</p>
      <p className="font-display text-xl tracking-tight tabular-nums" style={{ color: '#ece6d8' }}>{value}</p>
      {subtitle && <p className="text-[11px] mt-1" style={{ color: '#b8b3a7' }}>{subtitle}</p>}
    </div>
  );
}
