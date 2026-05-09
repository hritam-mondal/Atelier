import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { filterCourses, sortCourses } from '../../utils/filterCourses';
import { CatalogHero } from './CatalogHero';
import { FilterSidebar } from './FilterSidebar';
import { SortBar } from './SortBar';
import { CourseGrid } from './CourseGrid';
import { ActiveFilterChips } from './ActiveFilterChips';
import rawCourses from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';

const allCourses = rawCourses as CatalogCourse[];

export function CatalogPage() {
  const { state } = useCatalog();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(
    () => filterCourses(allCourses, state.filters),
    [state.filters]
  );

  const sorted = useMemo(
    () => sortCourses(filtered, state.sort),
    [filtered, state.sort]
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#15171a', color: 'white' }}>
      {/* Hero / Search */}
      <CatalogHero courses={allCourses} />

      {/* Main layout */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile filter toggle */}
        <div className="flex items-center gap-2 mb-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm text-gray-300 hover:text-white hover:border-violet-500 transition-colors"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            courses={allCourses}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <ActiveFilterChips />
            <SortBar totalCount={allCourses.length} filteredCount={filtered.length} />
            <CourseGrid
              courses={sorted}
              view={state.view}
              searchQuery={state.filters.query}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
