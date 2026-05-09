import { ChevronRight, Globe, Calendar, Captions } from 'lucide-react';
import { StarRating } from '../shared/StarRating';
import type { CourseDetail } from '../../types/courseDetail';

interface Props {
  course: CourseDetail;
}

export function CourseHero({ course }: Props) {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: '#15171a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url(${course.previewThumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) saturate(1.2)',
          transform: 'scale(1.1)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(21,23,26,0.85) 0%, rgba(21,23,26,0.92) 100%)' }}
        aria-hidden
      />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Two-column reservation: hero text + space for floating purchase card */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs text-violet-300 mb-4 flex-wrap" aria-label="Breadcrumb">
              <span>{course.category}</span>
              <ChevronRight size={12} />
              <span>{course.subcategory}</span>
              <ChevronRight size={12} />
              <span className="text-violet-200">React</span>
            </nav>

            {/* Bestseller badge */}
            <div className="mb-3">
              <span className="inline-block text-[11px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded">
                BESTSELLER
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display tracking-tight text-3xl sm:text-4xl font-bold leading-tight mb-3 tracking-tight">
              {course.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 mb-5 leading-relaxed">
              {course.subtitle}
            </p>

            {/* Rating + students */}
            <div className="flex items-center gap-3 flex-wrap mb-3 text-sm">
              <StarRating rating={course.rating} reviewCount={course.reviewCount} />
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">
                <span className="font-semibold text-white">{course.enrollmentCount.toLocaleString()}</span> students
              </span>
            </div>

            {/* Created by */}
            <p className="text-sm text-slate-300 mb-3">
              Created by{' '}
              <a href="#instructor" className="text-violet-300 hover:text-violet-200 underline underline-offset-2">
                {course.instructor.name}
              </a>
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} aria-hidden />
                Last updated {course.lastUpdated}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={13} aria-hidden />
                {course.language}
              </span>
              <span className="flex items-center gap-1.5">
                <Captions size={13} aria-hidden />
                English [Auto], Spanish [Auto]
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
