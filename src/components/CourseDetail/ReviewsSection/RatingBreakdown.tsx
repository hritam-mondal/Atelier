import { useEffect, useRef, useState } from 'react';
import { StarRating } from '../../shared/StarRating';
import type { RatingBreakdownItem } from '../../../types/courseDetail';

interface Props {
  rating: number;
  totalReviews: number;
  breakdown: RatingBreakdownItem[];
}

export function RatingBreakdown({ rating, totalReviews, breakdown }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAnimated(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="text-center shrink-0">
        <div
          className="text-6xl font-bold text-amber-400 tabular-nums leading-none"
          aria-label={`Rated ${rating.toFixed(1)} out of 5`}
        >
          {rating.toFixed(1)}
        </div>
        <div className="mt-2">
          <StarRating rating={rating} showCount={false} size={16} />
        </div>
        <div className="text-xs text-slate-400 mt-1">Course rating</div>
      </div>

      <div className="flex-1 w-full space-y-1.5">
        {breakdown.map(({ stars, percent }) => (
          <div key={stars} className="flex items-center gap-3 text-xs">
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-[width] duration-1000 ease-out"
                style={{ width: animated ? `${percent}%` : '0%' }}
              />
            </div>
            <span className="w-12 text-slate-400 shrink-0 text-right">
              {stars} ★
            </span>
            <span className="w-10 text-slate-300 tabular-nums shrink-0 text-right">{percent}%</span>
          </div>
        ))}
        <p className="text-xs text-slate-500 mt-2">{totalReviews.toLocaleString()} ratings</p>
      </div>
    </div>
  );
}
