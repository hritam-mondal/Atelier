import { Link } from 'react-router-dom';
import { Users, DollarSign, Star, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { LineChart } from './Charts';
import { formatMoney } from '../../utils/formatInvoice';

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function InstructorDashboard() {
  const { state } = useInstructor();
  const stats = state.stats;
  const enrollChart = stats.enrollmentsLast30.map(p => ({ label: formatDayLabel(p.date), value: p.count }));
  const totalEnrollments = enrollChart.reduce((s, p) => s + p.value, 0);

  const topCourses = [...state.drafts]
    .filter(d => d.status === 'published')
    .sort((a, b) => b.revenueLifetime - a.revenueLifetime)
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-2" style={{ color: '#ece6d8' }}>
          Welcome back, Sarah.
        </h1>
        <p className="text-sm" style={{ color: '#b8b3a7' }}>
          Here's how your courses are performing.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={Users}        label="Students taught"   value={stats.totalStudents.toLocaleString()} accent="#ece6d8" />
        <Kpi icon={DollarSign}   label="This month"        value={formatMoney(stats.monthlyRevenue)}    accent="#a8c08a" />
        <Kpi icon={Star}         label="Average rating"    value={stats.avgRating.toFixed(1)}            accent="#d8c594" />
        <Kpi icon={MessageSquare}label="Pending Q&A"       value={String(stats.unansweredQuestions)}     accent="#c5897a" link="/instructor/qa" />
      </div>

      {/* Enrollment chart */}
      <section
        className="rounded-xl p-5"
        style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display tracking-tight text-lg" style={{ color: '#ece6d8' }}>
              Enrollments — last 30 days
            </h2>
            <p className="text-xs" style={{ color: '#8a857a' }}>
              {totalEnrollments.toLocaleString()} new students
            </p>
          </div>
          <Link to="/instructor/analytics" className="text-xs hover:opacity-70 inline-flex items-center gap-1" style={{ color: '#ece6d8' }}>
            View analytics <ArrowUpRight size={11} aria-hidden />
          </Link>
        </div>
        <LineChart data={enrollChart} />
      </section>

      {/* Top courses */}
      <section>
        <h2 className="font-display tracking-tight text-lg mb-4" style={{ color: '#ece6d8' }}>
          Top courses by lifetime revenue
        </h2>
        <ul className="space-y-2">
          {topCourses.map((c, i) => (
            <li
              key={c.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ border: '1px solid rgba(236,230,216,0.10)' }}
            >
              <span className="font-display italic shrink-0 w-6 text-center" style={{ color: '#8a857a' }}>
                0{i + 1}
              </span>
              {c.thumbnail && (
                <img src={c.thumbnail} alt="" className="w-16 aspect-video rounded object-cover shrink-0" loading="lazy" />
              )}
              <div className="flex-1 min-w-0">
                <Link to={`/instructor/courses/${c.id}`} className="text-sm truncate hover:opacity-70" style={{ color: '#ece6d8' }}>
                  {c.title}
                </Link>
                <p className="text-xs" style={{ color: '#8a857a' }}>
                  {c.enrollments.toLocaleString()} students · {c.rating.toFixed(1)} ★
                </p>
              </div>
              <span className="font-display text-base shrink-0 tabular-nums" style={{ color: '#ece6d8' }}>
                {formatMoney(c.revenueLifetime)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

interface KpiProps {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
  link?: string;
}

function Kpi({ icon: Icon, label, value, accent, link }: KpiProps) {
  const Inner = (
    <div
      className="rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
      style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: '#22252b' }}
    >
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r`} style={{ backgroundColor: accent }} aria-hidden />
      <Icon size={16} className="mb-3" style={{ color: '#b8b3a7' }} aria-hidden />
      <p className="text-xs mb-0.5" style={{ color: '#8a857a' }}>{label}</p>
      <p className="font-display text-2xl tracking-tight tabular-nums" style={{ color: '#ece6d8' }}>{value}</p>
    </div>
  );
  return link ? <Link to={link} className="relative block">{Inner}</Link> : <div className="relative">{Inner}</div>;
}
