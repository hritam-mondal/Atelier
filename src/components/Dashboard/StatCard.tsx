import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  subtitleTone?: 'neutral' | 'positive' | 'negative';
  accentColor: string; // tailwind color class, e.g. 'bg-violet-500'
}

export function StatCard({ icon: Icon, label, value, subtitle, subtitleTone = 'neutral', accentColor }: Props) {
  const subColor =
    subtitleTone === 'positive' ? 'text-emerald-400' :
    subtitleTone === 'negative' ? 'text-rose-400' :
    'text-slate-400';

  return (
    <div
      className="relative rounded-xl border border-white/10 p-4 transition-all hover:border-white/20 hover:shadow-2xl hover:-translate-y-0.5"
      style={{ backgroundColor: '#22252b' }}
    >
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${accentColor}`} aria-hidden />
      <div className="flex items-start justify-between mb-3">
        <Icon size={18} className="text-slate-300" aria-hidden />
      </div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums leading-tight">{value}</p>
      {subtitle && <p className={`text-xs mt-1 ${subColor}`}>{subtitle}</p>}
    </div>
  );
}
