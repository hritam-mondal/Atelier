import { useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { RelatedCoursesCarousel } from '../CourseDetail/RelatedCoursesCarousel';
import rawCatalog from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';

const allCourses = rawCatalog as CatalogCourse[];

export function RecommendedCourses() {
  const { state } = useUser();

  // Find the most-watched category among in-progress enrollments
  const data = useMemo(() => {
    const enrolledIds = new Set(state.enrollments.map(e => e.courseId));
    const wishlistIds = new Set(state.wishlist);

    const enrolledCourses = state.enrollments
      .map(e => allCourses.find(c => c.id === e.courseId))
      .filter((c): c is CatalogCourse => Boolean(c));

    const categoryCounts = new Map<string, number>();
    for (const c of enrolledCourses) {
      categoryCounts.set(c.category, (categoryCounts.get(c.category) ?? 0) + 1);
    }
    const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!topCategory) return null;

    const subcategoriesEnrolled = new Set(enrolledCourses.filter(c => c.category === topCategory).map(c => c.subcategory));
    const topSubcategory = [...subcategoriesEnrolled][0];
    const focus = topSubcategory ?? topCategory;

    const recommendations = allCourses
      .filter(c => c.category === topCategory)
      .filter(c => !enrolledIds.has(c.id) && !wishlistIds.has(c.id))
      .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      .slice(0, 8)
      .map(c => c.id);

    return { focus, recommendations };
  }, [state.enrollments, state.wishlist]);

  if (!data || data.recommendations.length === 0) return null;

  return (
    <section aria-label="Recommended courses">
      <p className="text-sm text-slate-400 mb-1">Because you're learning</p>
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-4">{data.focus}</h2>
      <RelatedCoursesCarousel courseIds={data.recommendations} showHeading={false} />
    </section>
  );
}
