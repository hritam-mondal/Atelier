import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, BookOpen, Heart, Trophy, Archive, Sparkles } from 'lucide-react';
import type { DashboardTab, EnrollmentSort } from '../../types/dashboard';
import type { CatalogCourse } from '../../types/catalog';
import { useUser } from '../../context/UserContext';
import { useEnrollmentFilters } from '../../hooks/useEnrollmentFilters';
import { EnrolledCourseCard } from './EnrolledCourseCard';
import { WishlistCard } from './WishlistCard';
import { EmptyTabState } from './EmptyTabState';
import rawCatalog from '../../data/mockCatalog.json';

const allCourses = rawCatalog as CatalogCourse[];

interface Props {
  tab: DashboardTab;
}

const SORT_LABELS: Record<EnrollmentSort, string> = {
  'recent':   'Recently accessed',
  'title':    'Title A–Z',
  'progress': 'Progress (high → low)',
  'enrolled': 'Date enrolled',
};

export function EnrollmentGrid({ tab }: Props) {
  const { state } = useUser();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<EnrollmentSort>('recent');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const enrollmentsForTab = useMemo(() => {
    switch (tab) {
      case 'all':         return state.enrollments.filter(e => !e.isArchived);
      case 'in-progress': return state.enrollments.filter(e => !e.isArchived && e.progressPercent > 0 && e.progressPercent < 100);
      case 'completed':   return state.enrollments.filter(e => e.progressPercent === 100);
      case 'archived':    return state.enrollments.filter(e => e.isArchived);
      default:            return [];
    }
  }, [state.enrollments, tab]);

  const filtered = useEnrollmentFilters(enrollmentsForTab, allCourses, query, sort);

  // Wishlist tab uses different data
  const wishlistCourses = useMemo(() => {
    if (tab !== 'wishlist') return [];
    let list = allCourses.filter(c => state.wishlist.includes(c.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.instructor.name.toLowerCase().includes(q));
    }
    return list;
  }, [tab, state.wishlist, query]);

  if (tab === 'certificates') return null; // handled by CertificatesGrid

  // Empty states
  const emptyConfig: Record<Exclude<DashboardTab, 'certificates'>, React.ReactNode> = {
    'all': <EmptyTabState icon={BookOpen} title="Start your learning journey" description="You haven't enrolled in any courses yet. Explore the catalog and find something to dive into." cta={{ label: 'Browse catalog', to: '/catalog' }} />,
    'in-progress': <EmptyTabState icon={Sparkles} title="Nothing in progress" description="Pick up an enrolled course to keep building momentum." cta={{ label: 'Browse my courses', to: '?tab=all' }} />,
    'completed': <EmptyTabState icon={Trophy} title="Finish a course to see it here" description="Once you complete a course, it'll show up here with your certificate." />,
    'wishlist': <EmptyTabState icon={Heart} title="Your wishlist is empty" description="Save courses for later by tapping the heart icon as you browse." cta={{ label: 'Browse catalog', to: '/catalog' }} />,
    'archived': <EmptyTabState icon={Archive} title="No archived courses" description="Archive a course to declutter your dashboard without losing progress." />,
  };

  const gridCls = view === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    : 'flex flex-col gap-3';

  const isEmpty = tab === 'wishlist' ? wishlistCourses.length === 0 : filtered.length === 0;
  if (isEmpty && !query) {
    return <div role="tabpanel" id={`tab-panel-${tab}`} aria-labelledby={`tab-${tab}`}>{emptyConfig[tab]}</div>;
  }

  return (
    <div role="tabpanel" id={`tab-panel-${tab}`} aria-labelledby={`tab-${tab}`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search this tab"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 border border-white/15 focus:border-violet-500 focus:outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            aria-label="Search courses"
          />
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          {tab !== 'wishlist' && (
            <select
              value={sort}
              onChange={e => setSort(e.target.value as EnrollmentSort)}
              className="px-3 py-1.5 rounded-lg text-sm text-white border border-white/20 focus:border-violet-500 focus:outline-none cursor-pointer"
              style={{ backgroundColor: '#22252b' }}
              aria-label="Sort"
            >
              {(Object.keys(SORT_LABELS) as EnrollmentSort[]).map(k => (
                <option key={k} value={k}>{SORT_LABELS[k]}</option>
              ))}
            </select>
          )}
          <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 transition-colors ${view === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 transition-colors ${view === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              aria-label="List view"
              aria-pressed={view === 'list'}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {tab === 'wishlist' ? (
        wishlistCourses.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">No matches in your wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlistCourses.map(course => (
              <WishlistCard key={course.id} course={course} />
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-10 text-sm">No matches in this tab.</p>
      ) : (
        <div className={gridCls}>
          {filtered.map(({ enrollment, course }) => (
            <EnrolledCourseCard key={course.id} course={course} enrollment={enrollment} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}
