import { Flame } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useStreak } from '../../hooks/useStreak';

const MICROCOPY = [
  "Small steps every day add up to big wins.",
  "Today is a great day to learn something new.",
  "Your future self will thank you for today's session.",
  "Keep the momentum — one lecture at a time.",
  "Consistency beats intensity. You've got this.",
  "Progress over perfection. Just press play.",
  "Make today count, even if it's just ten minutes.",
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function WelcomeHeader() {
  const { state } = useUser();
  const { current, longest } = useStreak();
  const firstName = state.user.name.split(' ')[0];

  // Day-of-year based microcopy so it shifts daily but stays stable in-session
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  const tagline = MICROCOPY[day % MICROCOPY.length];

  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display tracking-tight text-2xl sm:text-3xl font-bold text-white">
          {greeting()}, {firstName}
        </h1>
        <p className="text-sm text-slate-400 mt-1">{tagline}</p>
      </div>

      {current > 0 && (
        <div
          className="group relative flex items-center gap-1.5 px-3 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 shrink-0"
          tabIndex={0}
          aria-describedby="streak-tooltip"
        >
          <Flame size={16} className="text-amber-400" aria-hidden />
          <span className="text-sm font-semibold text-amber-300">
            {current}-day streak
          </span>
          <div
            id="streak-tooltip"
            role="tooltip"
            className="pointer-events-none absolute top-full mt-2 right-0 px-3 py-1.5 rounded-md text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            style={{ backgroundColor: '#22252b', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
          >
            Best streak: {longest} days
          </div>
        </div>
      )}
    </header>
  );
}
