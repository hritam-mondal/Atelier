import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

export function StarRating({ rating, reviewCount, size = 14, showCount = true }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = Math.min(1, Math.max(0, rating - i));
    return fill;
  });

  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-400 font-bold text-sm">{rating.toFixed(1)}</span>
      <div className="flex items-center gap-0.5">
        {stars.map((fill, i) => (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-gray-600" fill="currentColor" />
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={size} className="text-amber-400" fill="currentColor" />
              </span>
            )}
          </span>
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-gray-400 text-xs">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
