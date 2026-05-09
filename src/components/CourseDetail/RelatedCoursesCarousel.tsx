import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CourseCard } from '../Catalog/CourseCard';
import type { CatalogCourse } from '../../types/catalog';
import rawCatalog from '../../data/mockCatalog.json';

const allCourses = rawCatalog as CatalogCourse[];

interface Props {
  courseIds: string[];
  heading?: string;
  showHeading?: boolean;
}

export function RelatedCoursesCarousel({ courseIds, heading = 'Students also bought', showHeading = true }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const courses = courseIds
    .map(id => allCourses.find(c => c.id === id))
    .filter((c): c is CatalogCourse => Boolean(c));

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [courses.length]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 280;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  };

  if (courses.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        {showHeading ? <h2 className="font-display tracking-tight text-xl font-bold text-white">{heading}</h2> : <span />}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-disabled={atStart}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-disabled={atEnd}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
        {courses.map(course => (
          <div
            key={course.id}
            className="shrink-0 w-64 sm:w-72"
            style={{ scrollSnapAlign: 'start' }}
          >
            <CourseCard course={course} view="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}
