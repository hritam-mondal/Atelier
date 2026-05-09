interface Props {
  active: number; // 0 = all
  counts: Record<number, number>; // rating -> count
  total: number;
  onChange: (value: number) => void;
}

const RATINGS = [5, 4, 3, 2, 1];

export function ReviewFilters({ active, counts, total, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip active={active === 0} onClick={() => onChange(0)} label={`All ratings (${total})`} />
      {RATINGS.map(r => (
        <Chip
          key={r}
          active={active === r}
          onClick={() => onChange(r)}
          label={`${r} stars (${counts[r] ?? 0})`}
        />
      ))}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
        ${active
          ? 'border-violet-500 bg-violet-500/15 text-violet-200'
          : 'border-white/15 text-slate-300 hover:text-white hover:border-white/30'}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
