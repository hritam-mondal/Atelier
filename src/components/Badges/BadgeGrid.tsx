import { useNotifications } from '../../context/NotificationsContext';
import { BadgeCard } from './BadgeCard';

export function BadgeGrid() {
  const { state } = useNotifications();
  const earned = state.badges.filter(b => b.earnedAt);
  const locked = state.badges.filter(b => !b.earnedAt);

  return (
    <section
      className="rounded-xl border border-white/10 p-5"
      style={{ backgroundColor: '#22252b' }}
      aria-label="Achievements"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display tracking-tight text-base" style={{ color: '#ece6d8' }}>Achievements</h3>
          <p className="text-xs" style={{ color: '#8a857a' }}>
            {earned.length} of {state.badges.length} earned
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...earned, ...locked].map(b => <BadgeCard key={b.id} badge={b} />)}
      </div>
    </section>
  );
}
