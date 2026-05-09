import { useState, useRef } from 'react';
import { Clock, BookOpen, Play } from 'lucide-react';
import type { CatalogCourse } from '../../types/catalog';
import { StarRating } from '../shared/StarRating';
import { PriceTag } from '../shared/PriceTag';
import { CourseCardHoverPreview } from './CourseCardHoverPreview';
import { formatDuration } from '../../utils/formatDuration';

interface Props {
  course: CatalogCourse;
  view: 'grid' | 'list';
  searchQuery?: string;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-violet-500/30 text-violet-200 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CourseCard({ course, view, searchQuery = '' }: Props) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 300);
  };
  const onMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setHovered(false);
  };

  // Determine which side to show the preview
  const previewSide = (() => {
    if (!cardRef.current) return 'right' as const;
    const rect = cardRef.current.getBoundingClientRect();
    return rect.right + 288 > window.innerWidth ? 'left' as const : 'right' as const;
  })();

  if (view === 'list') {
    return (
      <div
        ref={cardRef}
        className="relative flex gap-4 p-4 rounded-xl border border-white/10 hover:border-violet-500/40 transition-colors group cursor-pointer"
        style={{ backgroundColor: '#1d2025' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Thumbnail */}
        <div className="shrink-0 w-40 h-[90px] rounded-lg overflow-hidden bg-gray-800 relative">
          {!imgError ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" onError={() => setImgError(true)} loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <Play size={24} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={20} className="text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm leading-snug truncate flex-1">
              {highlight(course.title, searchQuery)}
            </h3>
            {course.isBestseller && (
              <span className="shrink-0 text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">BESTSELLER</span>
            )}
          </div>
          <p className="text-gray-400 text-xs truncate mb-2">{course.subtitle}</p>
          <p className="text-gray-500 text-xs mb-2">{course.instructor.name}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(course.totalDuration)}</span>
            <span className="flex items-center gap-1"><BookOpen size={11} />{course.lectureCount} lectures</span>
            <span className="capitalize">{course.level}</span>
          </div>
          <StarRating rating={course.rating} reviewCount={course.reviewCount} size={12} />
        </div>

        <div className="shrink-0 text-right">
          <PriceTag price={course.price} discountPrice={course.discountPrice} size="sm" />
        </div>

        {hovered && <CourseCardHoverPreview course={course} side={previewSide} />}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col rounded-xl border border-white/10 hover:border-violet-500/40 transition-all duration-200 group cursor-pointer overflow-hidden"
      style={{ backgroundColor: '#1d2025' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-gray-800 overflow-hidden">
        {!imgError ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)} loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <Play size={32} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-200">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play size={18} className="text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {course.isBestseller && (
            <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">BESTSELLER</span>
          )}
          {course.isNew && (
            <span className="text-[10px] font-bold bg-emerald-500 text-black px-1.5 py-0.5 rounded">NEW</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3">
        <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2">
          {highlight(course.title, searchQuery)}
        </h3>
        <p className="text-gray-500 text-xs mb-2">{course.instructor.name}</p>
        <div className="mb-2">
          <StarRating rating={course.rating} reviewCount={course.reviewCount} size={12} />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(course.totalDuration)}</span>
          <span>·</span>
          <span className="capitalize">{course.level}</span>
        </div>
        <div className="mt-auto">
          <PriceTag price={course.price} discountPrice={course.discountPrice} size="sm" />
        </div>
      </div>

      {hovered && <CourseCardHoverPreview course={course} side={previewSide} />}
    </div>
  );
}
