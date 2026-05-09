import { Users, BookOpen, DollarSign, TrendingUp, Activity, Target } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { formatMoney } from '../../utils/formatInvoice';

export function AdminDashboard() {
  const { state } = useAdmin();
  const m = state.metrics;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Operations.</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={Users}      label="Total users"      value={m.totalUsers.toLocaleString()}      sub={`+${m.newUsersThisWeek.toLocaleString()} this week`} accent="#ece6d8" />
        <Kpi icon={Activity}   label="DAU / MAU"        value={`${m.dau.toLocaleString()} / ${m.mau.toLocaleString()}`} accent="#a8c08a" />
        <Kpi icon={DollarSign} label="MRR"              value={formatMoney(m.monthlyRecurring)}    sub={`Lifetime ${formatMoney(m.totalRevenue)}`} accent="#d8c594" />
        <Kpi icon={Target}     label="Conversion"       value={`${(m.conversionRate * 100).toFixed(2)}%`} accent="#aabacb" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl p-5" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} style={{ color: '#b8b3a7' }} aria-hidden />
            <h2 className="font-display text-lg tracking-tight" style={{ color: '#ece6d8' }}>
              Top categories by enrollment
            </h2>
          </div>
          <ul className="space-y-2">
            {m.topCategories.map(cat => {
              const max = Math.max(...m.topCategories.map(c => c.enrollments));
              const width = (cat.enrollments / max) * 100;
              return (
                <li key={cat.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span style={{ color: '#ece6d8' }}>{cat.category}</span>
                    <span className="tabular-nums" style={{ color: '#b8b3a7' }}>{cat.enrollments.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: '#ece6d8' }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl p-5" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#b8b3a7' }} aria-hidden />
            <h2 className="font-display text-lg tracking-tight" style={{ color: '#ece6d8' }}>
              At a glance
            </h2>
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Total courses"            value={m.totalCourses.toLocaleString()} />
            <Row label="Avg session minutes"      value={`${m.avgSessionMinutes} min`} />
            <Row label="Pending moderation items" value={String(state.moderation.filter(x => x.status === 'pending').length)} />
            <Row label="Active feature flags"     value={String(state.flags.filter(f => f.enabled).length)} />
            <Row label="Active announcements"     value={String(state.announcements.filter(a => a.active).length)} />
          </dl>
        </section>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub, accent }: { icon: React.ElementType; label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="relative rounded-xl p-4" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: '#22252b' }}>
      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r" style={{ backgroundColor: accent }} aria-hidden />
      <Icon size={14} className="mb-2" style={{ color: '#b8b3a7' }} aria-hidden />
      <p className="text-xs" style={{ color: '#8a857a' }}>{label}</p>
      <p className="font-display text-xl tracking-tight tabular-nums" style={{ color: '#ece6d8' }}>{value}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: '#a8c08a' }}>{sub}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt style={{ color: '#b8b3a7' }}>{label}</dt>
      <dd className="font-display tabular-nums" style={{ color: '#ece6d8' }}>{value}</dd>
    </div>
  );
}
