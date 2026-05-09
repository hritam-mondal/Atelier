import { Clock, GraduationCap, Trophy, Flame } from 'lucide-react';
import { StatCard } from './StatCard';
import { useLearningStats } from '../../hooks/useLearningStats';
import { useStreak } from '../../hooks/useStreak';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function StatsRow() {
  const stats = useLearningStats();
  const { current, longest } = useStreak();

  const weekDeltaText = stats.weekDelta === 0
    ? 'No change this week'
    : `${stats.weekDelta > 0 ? '+' : ''}${formatHours(Math.abs(stats.weekDelta))} this week`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon={Clock}
        label="Total Learning Time"
        value={formatHours(stats.totalMinutes)}
        subtitle={weekDeltaText}
        subtitleTone={stats.weekDelta > 0 ? 'positive' : stats.weekDelta < 0 ? 'negative' : 'neutral'}
        accentColor="bg-violet-500"
      />
      <StatCard
        icon={GraduationCap}
        label="In Progress"
        value={String(stats.inProgress.length)}
        subtitle={`${stats.activeThisWeek.length} active this week`}
        accentColor="bg-sky-500"
      />
      <StatCard
        icon={Trophy}
        label="Completed"
        value={String(stats.completed.length)}
        subtitle={
          stats.lastCompleted
            ? `Last completed ${formatRelativeTime(stats.lastCompleted.lastAccessedAt)}`
            : 'No completions yet'
        }
        accentColor="bg-amber-500"
      />
      <StatCard
        icon={Flame}
        label="Current Streak"
        value={`${current} ${current === 1 ? 'day' : 'days'}`}
        subtitle={`Best: ${longest} days`}
        accentColor="bg-rose-500"
      />
    </div>
  );
}
