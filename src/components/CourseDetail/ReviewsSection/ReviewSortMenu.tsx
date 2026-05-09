import { ChevronDown } from 'lucide-react';
import type { ReviewSort } from '../../../types/courseDetail';

interface Props {
  value: ReviewSort;
  onChange: (sort: ReviewSort) => void;
}

const LABELS: Record<ReviewSort, string> = {
  'most-helpful': 'Most helpful',
  'most-recent':  'Most recent',
  'highest':      'Highest rated',
  'lowest':       'Lowest rated',
};

export function ReviewSortMenu({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value as ReviewSort)}
        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm text-white border border-white/20 focus:border-violet-500 focus:outline-none cursor-pointer"
        style={{ backgroundColor: '#22252b' }}
        aria-label="Sort reviews"
      >
        {(Object.keys(LABELS) as ReviewSort[]).map(key => (
          <option key={key} value={key}>{LABELS[key]}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden />
    </div>
  );
}
