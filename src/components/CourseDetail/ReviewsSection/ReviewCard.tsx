import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, BadgeCheck } from 'lucide-react';
import { StarRating } from '../../shared/StarRating';
import type { Review } from '../../../types/courseDetail';

interface Props {
  review: Review;
}

type Vote = 'up' | 'down' | null;

function relativeDate(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  const months = Math.floor(diffDays / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

export function ReviewCard({ review }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [vote, setVote] = useState<Vote>(() => {
    try { return (localStorage.getItem(`review-vote:${review.id}`) as Vote) ?? null; } catch { return null; }
  });
  const [helpfulCount, setHelpfulCount] = useState(() => {
    try {
      const stored = localStorage.getItem(`review-helpful:${review.id}`);
      if (stored) return parseInt(stored, 10);
    } catch { /* noop */ }
    return review.helpfulCount;
  });

  useEffect(() => {
    try { localStorage.setItem(`review-helpful:${review.id}`, String(helpfulCount)); } catch { /* noop */ }
  }, [helpfulCount, review.id]);

  useEffect(() => {
    try {
      if (vote) localStorage.setItem(`review-vote:${review.id}`, vote);
      else localStorage.removeItem(`review-vote:${review.id}`);
    } catch { /* noop */ }
  }, [vote, review.id]);

  const handleVote = (next: 'up' | 'down') => {
    if (vote === next) {
      // toggle off
      if (next === 'up') setHelpfulCount(c => c - 1);
      setVote(null);
    } else {
      if (vote === 'up' && next === 'down') setHelpfulCount(c => c - 1);
      else if (next === 'up') setHelpfulCount(c => c + 1);
      setVote(next);
    }
  };

  const isLong = review.body.length > 280;

  return (
    <article
      className="rounded-xl border border-white/10 p-5"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      <header className="flex items-start gap-3 mb-3">
        <img
          src={review.userAvatar}
          alt=""
          className="w-10 h-10 rounded-full object-cover bg-violet-900 shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-white">{review.userName}</span>
            {review.isVerifiedPurchase && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400"
                title="Verified purchase"
              >
                <BadgeCheck size={12} aria-hidden /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} showCount={false} size={12} />
            <span className="text-xs text-slate-500">{relativeDate(review.date)}</span>
          </div>
        </div>
      </header>

      <h4 className="text-sm font-semibold text-white mb-1.5">{review.title}</h4>
      <p className={`text-sm text-slate-300 leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
        {review.body}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-1 text-xs font-semibold text-violet-300 hover:text-violet-200"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <footer className="mt-4 flex items-center gap-3 text-xs">
        <span className="text-slate-400">Was this review helpful?</span>
        <button
          onClick={() => handleVote('up')}
          className={`p-1.5 rounded border transition-colors ${vote === 'up' ? 'border-violet-500 text-violet-300 bg-violet-500/10' : 'border-white/15 text-slate-400 hover:text-white hover:border-white/30'}`}
          aria-label="Mark review as helpful"
          aria-pressed={vote === 'up'}
        >
          <ThumbsUp size={13} aria-hidden />
        </button>
        <button
          onClick={() => handleVote('down')}
          className={`p-1.5 rounded border transition-colors ${vote === 'down' ? 'border-rose-500 text-rose-400 bg-rose-500/10' : 'border-white/15 text-slate-400 hover:text-white hover:border-white/30'}`}
          aria-label="Mark review as not helpful"
          aria-pressed={vote === 'down'}
        >
          <ThumbsDown size={13} aria-hidden />
        </button>
        <span className="text-slate-500 ml-1">{helpfulCount} found this helpful</span>
        <button className="ml-auto text-slate-500 hover:text-slate-300 transition-colors">
          Report
        </button>
      </footer>
    </article>
  );
}
