import { Clock, Users, BarChart, CheckCircle2 } from 'lucide-react';
import type { CatalogCourse } from '../../types/catalog';
import { StarRating } from '../shared/StarRating';
import { PriceTag } from '../shared/PriceTag';
import { formatDuration } from '../../utils/formatDuration';

interface Props {
  course: CatalogCourse;
  side: 'left' | 'right';
}

export function CourseCardHoverPreview({ course, side }: Props) {
  return (
    <div
      className={`absolute top-0 z-50 w-72 rounded-xl shadow-2xl border border-white/10 overflow-hidden pointer-events-none
        ${side === 'right' ? 'left-full ml-2' : 'right-full mr-2'}`}
      style={{ backgroundColor: '#22252b' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          {course.isBestseller && (
            <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">BESTSELLER</span>
          )}
          {course.isNew && (
            <span className="text-[10px] font-bold bg-emerald-500 text-black px-1.5 py-0.5 rounded">NEW</span>
          )}
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug mb-1">{course.title}</h3>
        <p className="text-gray-400 text-xs line-clamp-2">{course.subtitle}</p>
      </div>

      {/* Meta */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDuration(course.totalDuration)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {course.enrollmentCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <BarChart size={12} />
            {course.level}
          </span>
        </div>
        <StarRating rating={course.rating} reviewCount={course.reviewCount} />
      </div>

      {/* What you learn */}
      <div className="px-4 pb-4">
        <p className="text-xs font-semibold text-gray-300 mb-2">What you'll learn</p>
        <ul className="space-y-1">
          {course.whatYouLearn.slice(0, 4).map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
              <CheckCircle2 size={11} className="text-violet-400 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="px-4 pb-4">
        <PriceTag price={course.price} discountPrice={course.discountPrice} size="md" />
      </div>
    </div>
  );
}
