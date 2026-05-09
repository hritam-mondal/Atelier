import { useEffect, useState } from 'react';
import { Pencil, PartyPopper } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useLearningStats } from '../../hooks/useLearningStats';
import { ContributionGraph } from './ContributionGraph';
import { GoalEditor } from './GoalEditor';

const RING_SIZE = 120;
const RING_STROKE = 12;

export function WeeklyGoalCard() {
  const { state, dispatch } = useUser();
  const { minutesThisWeek, weeklyGoal, goalPercent } = useLearningStats();
  const [editorOpen, setEditorOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Celebrate once when goal hit
  useEffect(() => {
    if (goalPercent >= 100 && !hasCelebrated) {
      setCelebrate(true);
      setHasCelebrated(true);
      const t = setTimeout(() => setCelebrate(false), 2000);
      return () => clearTimeout(t);
    }
  }, [goalPercent, hasCelebrated]);

  const radius = (RING_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(100, goalPercent) / 100) * circumference;

  return (
    <section
      className="rounded-xl border border-white/10 p-5"
      style={{ backgroundColor: '#22252b' }}
      aria-label="Weekly learning goal"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Weekly goal</h3>
          <p className="text-xs text-slate-500">Sun – Sat, this week</p>
        </div>
        <button
          onClick={() => setEditorOpen(true)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-300 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
          aria-label="Edit weekly goal"
        >
          <Pencil size={11} aria-hidden /> Edit
        </button>
      </div>

      {/* Ring + numbers */}
      <div className="flex items-center gap-5 mb-5">
        <div className={`relative shrink-0 ${celebrate ? 'animate-[goalPop_0.6s_ease-out]' : ''}`} style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            role="progressbar"
            aria-valuenow={goalPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Weekly goal: ${goalPercent}% complete`}
          >
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} stroke="rgba(236,230,216,0.10)" strokeWidth={RING_STROKE} fill="none" />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              stroke="url(#goalGradient)"
              strokeWidth={RING_STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
            />
            <defs>
              <linearGradient id="goalGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ece6d8" />
                <stop offset="100%" stopColor="#d6cfbe" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white tabular-nums">{goalPercent}%</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">of goal</span>
          </div>
          {celebrate && (
            <div className="absolute -top-3 -right-3 text-amber-400 animate-[bounce_0.6s_ease-out]">
              <PartyPopper size={22} aria-hidden />
            </div>
          )}
        </div>

        <div>
          <p className="text-3xl font-bold text-white tabular-nums">
            {minutesThisWeek} <span className="text-base text-slate-500 font-medium">/ {weeklyGoal} min</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {goalPercent >= 100 ? "ðŸŽ‰ You hit your goal!" :
              `${weeklyGoal - minutesThisWeek} min to go`}
          </p>
        </div>
      </div>

      {/* Contribution graph */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400 mb-2">Activity over the last 12 weeks</p>
        <ContributionGraph daily={state.learningGoals.dailyMinutesLogged} />
      </div>

      {/* Local keyframe (Tailwind v4 doesn't have this preset) */}
      <style>{`
        @keyframes goalPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.08); opacity: 0.95; }
          100% { transform: scale(1); }
        }
      `}</style>

      <GoalEditor
        open={editorOpen}
        initialValue={weeklyGoal}
        onClose={() => setEditorOpen(false)}
        onSave={(minutes) => { dispatch({ type: 'SET_WEEKLY_GOAL', minutes }); setEditorOpen(false); }}
      />
    </section>
  );
}
