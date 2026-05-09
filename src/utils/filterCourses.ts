import type { CatalogCourse, FilterState, SortOption } from '../types/catalog';
import { DURATION_RANGES } from '../types/catalog';
import { secondsToHours } from './formatDuration';

export function filterCourses(courses: CatalogCourse[], filters: FilterState): CatalogCourse[] {
  return courses.filter(c => {
    // text search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hit = c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q));
      if (!hit) return false;
    }

    if (filters.category && c.category !== filters.category) return false;
    if (filters.subcategory && c.subcategory !== filters.subcategory) return false;
    if (filters.rating > 0 && c.rating < filters.rating) return false;

    if (filters.levels.length > 0 && !filters.levels.includes(c.level)) return false;
    if (filters.languages.length > 0 && !filters.languages.includes(c.language)) return false;

    if (filters.priceType === 'free' && c.price !== 0) return false;
    if (filters.priceType === 'paid' && c.price === 0) return false;
    if (c.price > 0) {
      const effective = c.discountPrice ?? c.price;
      if (effective < filters.priceMin || effective > filters.priceMax) return false;
    }

    if (filters.durations.length > 0) {
      const hours = secondsToHours(c.totalDuration);
      const match = DURATION_RANGES
        .filter(r => filters.durations.includes(r.label))
        .some(r => hours >= r.min && hours < r.max);
      if (!match) return false;
    }

    return true;
  });
}

export function sortCourses(courses: CatalogCourse[], sort: SortOption): CatalogCourse[] {
  const copy = [...courses];
  switch (sort) {
    case 'most-popular':   return copy.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
    case 'highest-rated':  return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'newest':         return copy.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    case 'most-reviewed':  return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'price-low':      return copy.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    case 'price-high':     return copy.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    default:               return copy;
  }
}

export function getSearchSuggestions(courses: CatalogCourse[], query: string, limit = 8): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const seen = new Set<string>();
  const results: string[] = [];
  for (const c of courses) {
    if (results.length >= limit) break;
    const candidates = [c.title, c.subcategory, ...c.tags];
    for (const s of candidates) {
      if (s.toLowerCase().includes(q) && !seen.has(s)) {
        seen.add(s);
        results.push(s);
      }
    }
  }
  return results;
}
