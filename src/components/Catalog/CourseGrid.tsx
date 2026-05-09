import type { CatalogCourse, ViewMode } from '../../types/catalog';
import { CourseCard } from './CourseCard';
import { SkeletonCard } from './SkeletonCard';
import { EmptyResults } from './EmptyResults';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const PAGE_SIZE = 12;

interface Props {
  courses: CatalogCourse[];
  view: ViewMode;
  loading?: boolean;
  searchQuery?: string;
}

export function CourseGrid({ courses, view, loading, searchQuery }: Props) {
  const { visibleCount, sentinelRef } = useInfiniteScroll(PAGE_SIZE, courses.length);

  if (loading) {
    return (
      <div className={view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        : 'flex flex-col gap-3'}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} view={view} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) return <EmptyResults />;

  const visible = courses.slice(0, visibleCount);

  return (
    <>
      <div className={view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        : 'flex flex-col gap-3'}
      >
        {visible.map(course => (
          <CourseCard key={course.id} course={course} view={view} searchQuery={searchQuery} />
        ))}
      </div>

      {visibleCount < courses.length && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {visibleCount >= courses.length && courses.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-8">
          Showing all {courses.length} courses
        </p>
      )}
    </>
  );
}
