import { useMemo } from 'react';
import type { Enrollment, EnrollmentSort } from '../types/dashboard';
import type { CatalogCourse } from '../types/catalog';

export interface FilteredEnrollment {
  enrollment: Enrollment;
  course: CatalogCourse;
}

export function useEnrollmentFilters(
  enrollments: Enrollment[],
  courses: CatalogCourse[],
  query: string,
  sort: EnrollmentSort
): FilteredEnrollment[] {
  return useMemo(() => {
    const courseById = new Map(courses.map(c => [c.id, c]));
    const joined: FilteredEnrollment[] = enrollments
      .map(e => {
        const course = courseById.get(e.courseId);
        return course ? { enrollment: e, course } : null;
      })
      .filter((x): x is FilteredEnrollment => x !== null);

    const filtered = query.trim()
      ? joined.filter(({ course }) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.instructor.name.toLowerCase().includes(query.toLowerCase())
        )
      : joined;

    const sorted = [...filtered];
    switch (sort) {
      case 'recent':
        sorted.sort((a, b) => b.enrollment.lastAccessedAt.localeCompare(a.enrollment.lastAccessedAt));
        break;
      case 'title':
        sorted.sort((a, b) => a.course.title.localeCompare(b.course.title));
        break;
      case 'progress':
        sorted.sort((a, b) => b.enrollment.progressPercent - a.enrollment.progressPercent);
        break;
      case 'enrolled':
        sorted.sort((a, b) => b.enrollment.enrolledAt.localeCompare(a.enrollment.enrolledAt));
        break;
    }
    return sorted;
  }, [enrollments, courses, query, sort]);
}
