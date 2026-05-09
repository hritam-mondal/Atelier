import { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { Search } from 'lucide-react';
import { RatingBreakdown } from './RatingBreakdown';
import { ReviewCard } from './ReviewCard';
import { ReviewFilters } from './ReviewFilters';
import { ReviewSortMenu } from './ReviewSortMenu';
import type { CourseDetail, ReviewSort } from '../../../types/courseDetail';

interface Props {
  course: CourseDetail;
}

const PAGE_SIZE = 10;

export function ReviewsSection({ course }: Props) {
  const [query, setQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0); // 0 = all
  const [sort, setSort] = useState<ReviewSort>('most-helpful');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => {
    const c: Record<number, number> = {};
    for (const r of course.reviews) c[r.rating] = (c[r.rating] ?? 0) + 1;
    return c;
  }, [course.reviews]);

  const filtered = useMemo(() => {
    let list = course.reviews;
    if (ratingFilter > 0) list = list.filter(r => r.rating === ratingFilter);
    if (deferredQuery.trim()) {
      const q = deferredQuery.toLowerCase();
      list = list.filter(r =>
        r.body.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    switch (sort) {
      case 'most-helpful': sorted.sort((a, b) => b.helpfulCount - a.helpfulCount); break;
      case 'most-recent':  sorted.sort((a, b) => b.date.localeCompare(a.date)); break;
      case 'highest':      sorted.sort((a, b) => b.rating - a.rating); break;
      case 'lowest':       sorted.sort((a, b) => a.rating - b.rating); break;
    }
    return sorted;
  }, [course.reviews, ratingFilter, deferredQuery, sort]);

  // Reset pagination when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [ratingFilter, deferredQuery, sort]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="reviews">
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-5">Student feedback</h2>

      <div
        className="rounded-xl border border-white/10 p-6 mb-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
      >
        <RatingBreakdown
          rating={course.rating}
          totalReviews={course.reviewCount}
          breakdown={course.ratingsBreakdown}
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search reviews"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 border border-white/15 focus:border-violet-500 focus:outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            aria-label="Search reviews"
          />
        </div>
        <div className="lg:ml-auto">
          <ReviewSortMenu value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="mb-5">
        <ReviewFilters
          active={ratingFilter}
          counts={counts}
          total={course.reviews.length}
          onChange={setRatingFilter}
        />
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No reviews match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
          className="mt-5 px-5 py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
        >
          Show more reviews ({filtered.length - visibleCount} remaining)
        </button>
      )}
    </section>
  );
}
