import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, CornerDownLeft, BookOpen, Sparkles, Hash, Clock, ArrowRight,
  GraduationCap, FileText, TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import rawCatalog from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';
import type { UserRole } from '../../types/account';
import { formatMoney } from '../../utils/formatInvoice';

const allCourses = rawCatalog as CatalogCourse[];

// ─── Types ─────────────────────────────────────────────────────────────
type ResultKind = 'course' | 'instructor' | 'category' | 'page';

interface CourseResult { kind: 'course'; course: CatalogCourse; to: string }
interface InstructorResult { kind: 'instructor'; name: string; avatar: string; courseCount: number; to: string }
interface CategoryResult { kind: 'category'; name: string; courseCount: number; to: string }
interface PageResult { kind: 'page'; title: string; subtitle: string; icon: LucideIcon; to: string }

type Result = CourseResult | InstructorResult | CategoryResult | PageResult;

// ─── Recent searches storage ───────────────────────────────────────────
const RECENT_KEY = 'search-recent-v1';
const RECENT_MAX = 5;

function readRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'); } catch { return []; }
}
function pushRecent(query: string) {
  const q = query.trim();
  if (!q) return;
  const next = [q, ...readRecent().filter(x => x.toLowerCase() !== q.toLowerCase())].slice(0, RECENT_MAX);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* noop */ }
}
function clearRecent() {
  try { localStorage.removeItem(RECENT_KEY); } catch { /* noop */ }
}

// ─── Helpers ───────────────────────────────────────────────────────────
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function HighlightedText({ text, query }: { text: string; query: string }): ReactNode {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        className="rounded-sm px-0.5 -mx-0.5"
        style={{ backgroundColor: 'rgba(216, 197, 148, 0.30)', color: '#ece6d8' }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Build pages list per role ─────────────────────────────────────────
function buildPages(signedIn: boolean, role: UserRole): PageResult[] {
  const pages: PageResult[] = [
    { kind: 'page', title: 'Catalog',          subtitle: 'Browse all courses',              icon: BookOpen, to: '/catalog' },
    { kind: 'page', title: 'Help center',      subtitle: 'Find answers and contact support', icon: FileText, to: '/help' },
  ];
  if (signedIn) {
    pages.unshift({ kind: 'page', title: 'My Learning', subtitle: 'Your enrolled courses', icon: BookOpen, to: '/learning' });
    pages.push({ kind: 'page', title: 'Account',     subtitle: 'Profile, security, billing', icon: FileText, to: '/account' });
    pages.push({ kind: 'page', title: 'Wishlist',    subtitle: 'Courses saved for later',    icon: FileText, to: '/learning?tab=wishlist' });
    pages.push({ kind: 'page', title: 'Achievements',subtitle: 'Certificates and badges',    icon: FileText, to: '/learning?tab=certificates' });
    if (role === 'instructor' || role === 'admin') {
      pages.push({ kind: 'page', title: 'Instructor studio', subtitle: 'Create and manage courses', icon: GraduationCap, to: '/instructor' });
    }
    if (role === 'admin') {
      pages.push({ kind: 'page', title: 'Admin', subtitle: 'Moderation, flags, audit', icon: GraduationCap, to: '/admin' });
    }
  }
  return pages;
}

// ─── Derive instructors and categories from catalog ────────────────────
const instructorIndex = (() => {
  const map = new Map<string, { name: string; avatar: string; courseCount: number }>();
  for (const c of allCourses) {
    const key = c.instructor.name;
    const existing = map.get(key);
    if (existing) { existing.courseCount += 1; }
    else { map.set(key, { name: c.instructor.name, avatar: c.instructor.avatar, courseCount: 1 }); }
  }
  return [...map.values()];
})();

const categoryIndex = (() => {
  const map = new Map<string, number>();
  for (const c of allCourses) {
    map.set(c.category, (map.get(c.category) ?? 0) + 1);
  }
  return [...map.entries()].map(([name, courseCount]) => ({ name, courseCount }));
})();

const popularCourses = [...allCourses]
  .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
  .slice(0, 6);

// ─── The modal ─────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  signedIn: boolean;
  role: UserRole;
}

export function SearchModal({ open, onClose, signedIn, role }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>(() => readRecent());

  const q = query.trim().toLowerCase();
  const pages = useMemo(() => buildPages(signedIn, role), [signedIn, role]);

  // ─── Build groups ──────────────────────────────────────────────────
  const groups = useMemo(() => {
    if (!q) {
      // Empty state — show suggestions
      return {
        courses: popularCourses.map((course): CourseResult => ({ kind: 'course', course, to: '/course' })),
        instructors: [] as InstructorResult[],
        categories: categoryIndex.slice(0, 5).map((cat): CategoryResult => ({
          kind: 'category', name: cat.name, courseCount: cat.courseCount,
          to: `/catalog?cat=${encodeURIComponent(cat.name)}`,
        })),
        pages: pages.slice(0, 4),
      };
    }
    const courses: CourseResult[] = allCourses
      .filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map((course): CourseResult => ({ kind: 'course', course, to: '/course' }));

    const instructors: InstructorResult[] = instructorIndex
      .filter(i => i.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((i): InstructorResult => ({
        kind: 'instructor', name: i.name, avatar: i.avatar, courseCount: i.courseCount,
        to: `/u/${slugify(i.name)}`,
      }));

    const categories: CategoryResult[] = categoryIndex
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map(c => ({ kind: 'category', name: c.name, courseCount: c.courseCount, to: `/catalog?cat=${encodeURIComponent(c.name)}` }));

    const pageMatches: PageResult[] = pages
      .filter(p => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q))
      .slice(0, 4);

    return { courses, instructors, categories, pages: pageMatches };
  }, [q, pages]);

  // ─── Flat list for keyboard navigation ────────────────────────────
  const flat: Result[] = useMemo(
    () => [...groups.courses, ...groups.instructors, ...groups.categories, ...groups.pages],
    [groups]
  );

  // Keep activeIndex in range
  useEffect(() => {
    if (activeIndex >= flat.length) setActiveIndex(0);
  }, [flat.length, activeIndex]);

  // Reset highlight on query change
  useEffect(() => { setActiveIndex(0); }, [q]);

  // Auto-focus on open + reset query
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
      setRecent(readRecent());
    }
  }, [open]);

  // ─── Keyboard handling ────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, flat.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const item = flat[activeIndex];
        if (item) { commit(item); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flat, activeIndex]);

  const commit = (item: Result) => {
    if (q) pushRecent(query.trim());
    navigate(item.to);
    onClose();
    setQuery('');
  };

  const useRecent = (s: string) => {
    setQuery(s);
    inputRef.current?.focus();
  };

  const totalResults = flat.length;
  const showEmptyState = !q;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[8vh]"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-2xl rounded-xl border overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#15171a', borderColor: 'rgba(236, 230, 216, 0.25)', color: '#ece6d8' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(236, 230, 216, 0.10)' }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: '#b8b3a7' }} aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, instructors, categories…"
            className="flex-1 bg-transparent outline-none text-base placeholder:opacity-60"
            style={{ color: '#ece6d8' }}
            aria-label="Search"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs px-2 py-0.5 rounded-full transition-opacity hover:opacity-80"
              style={{ color: '#b8b3a7', backgroundColor: 'rgba(236, 230, 216, 0.08)' }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 hover:opacity-60 transition-opacity"
          >
            <X className="w-4 h-4" style={{ color: '#b8b3a7' }} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Empty state */}
          {showEmptyState && (
            <>
              {/* Recent searches */}
              {recent.length > 0 && (
                <Section title="Recent searches">
                  <div className="px-3 py-1 flex flex-wrap gap-1.5">
                    {recent.map(s => (
                      <button
                        key={s}
                        onClick={() => useRecent(s)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
                      >
                        <Clock size={10} aria-hidden style={{ color: '#8a857a' }} />
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => { clearRecent(); setRecent([]); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs hover:opacity-70 transition-opacity"
                      style={{ color: '#8a857a' }}
                    >
                      Clear
                    </button>
                  </div>
                </Section>
              )}

              {/* Browse by category */}
              {groups.categories.length > 0 && (
                <Section title="Browse by topic">
                  <div className="px-3 py-1 flex flex-wrap gap-1.5">
                    {groups.categories.map((cat, i) => {
                      const flatIdx = groups.courses.length + groups.instructors.length + i;
                      return (
                        <button
                          key={cat.name}
                          onMouseEnter={() => setActiveIndex(flatIdx)}
                          onClick={() => commit(cat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors"
                          style={{
                            border: '1px solid rgba(236,230,216,0.15)',
                            backgroundColor: activeIndex === flatIdx ? 'rgba(236,230,216,0.10)' : 'transparent',
                            color: '#ece6d8',
                          }}
                        >
                          <Hash size={10} aria-hidden style={{ color: '#8a857a' }} />
                          {cat.name}
                          <span style={{ color: '#8a857a' }}>· {cat.courseCount}</span>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Popular courses */}
              {groups.courses.length > 0 && (
                <Section
                  title="Popular this week"
                  iconAccent={<TrendingUp size={11} aria-hidden style={{ color: '#a8c08a' }} />}
                >
                  {groups.courses.map((r, i) => (
                    <CourseRow
                      key={r.course.id}
                      result={r}
                      query={query}
                      active={activeIndex === i}
                      onHover={() => setActiveIndex(i)}
                      onClick={() => commit(r)}
                    />
                  ))}
                </Section>
              )}

              {/* Pages */}
              {groups.pages.length > 0 && (
                <Section title="Quick navigation">
                  {groups.pages.map((r, i) => {
                    const flatIdx = groups.courses.length + groups.instructors.length + groups.categories.length + i;
                    return (
                      <PageRow
                        key={r.title}
                        result={r}
                        query={query}
                        active={activeIndex === flatIdx}
                        onHover={() => setActiveIndex(flatIdx)}
                        onClick={() => commit(r)}
                      />
                    );
                  })}
                </Section>
              )}
            </>
          )}

          {/* Active query */}
          {!showEmptyState && (
            <>
              {totalResults === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Sparkles size={24} className="mx-auto mb-3 opacity-50" style={{ color: '#b8b3a7' }} aria-hidden />
                  <div className="font-display text-2xl italic mb-2" style={{ color: '#b8b3a7' }}>
                    Nothing matches "{query}"
                  </div>
                  <div className="text-sm mb-4" style={{ color: '#8a857a' }}>
                    Try a different keyword, or browse by category.
                  </div>
                  <button
                    onClick={() => navigate('/catalog')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
                  >
                    Browse the catalog <ArrowRight size={11} aria-hidden />
                  </button>
                </div>
              ) : (
                <>
                  {groups.courses.length > 0 && (
                    <Section
                      title={`Courses · ${groups.courses.length}`}
                      action={groups.courses.length >= 6
                        ? <button onClick={() => { navigate(`/catalog?q=${encodeURIComponent(query)}`); onClose(); }} className="text-[11px] hover:opacity-70" style={{ color: '#ece6d8' }}>View all in catalog →</button>
                        : undefined}
                    >
                      {groups.courses.map((r, i) => (
                        <CourseRow
                          key={r.course.id}
                          result={r}
                          query={query}
                          active={activeIndex === i}
                          onHover={() => setActiveIndex(i)}
                          onClick={() => commit(r)}
                        />
                      ))}
                    </Section>
                  )}

                  {groups.instructors.length > 0 && (
                    <Section title={`Instructors · ${groups.instructors.length}`}>
                      {groups.instructors.map((r, i) => {
                        const flatIdx = groups.courses.length + i;
                        return (
                          <InstructorRow
                            key={r.name}
                            result={r}
                            query={query}
                            active={activeIndex === flatIdx}
                            onHover={() => setActiveIndex(flatIdx)}
                            onClick={() => commit(r)}
                          />
                        );
                      })}
                    </Section>
                  )}

                  {groups.categories.length > 0 && (
                    <Section title={`Categories · ${groups.categories.length}`}>
                      {groups.categories.map((r, i) => {
                        const flatIdx = groups.courses.length + groups.instructors.length + i;
                        return (
                          <CategoryRow
                            key={r.name}
                            result={r}
                            query={query}
                            active={activeIndex === flatIdx}
                            onHover={() => setActiveIndex(flatIdx)}
                            onClick={() => commit(r)}
                          />
                        );
                      })}
                    </Section>
                  )}

                  {groups.pages.length > 0 && (
                    <Section title="Pages">
                      {groups.pages.map((r, i) => {
                        const flatIdx = groups.courses.length + groups.instructors.length + groups.categories.length + i;
                        return (
                          <PageRow
                            key={r.title}
                            result={r}
                            query={query}
                            active={activeIndex === flatIdx}
                            onHover={() => setActiveIndex(flatIdx)}
                            onClick={() => commit(r)}
                          />
                        );
                      })}
                    </Section>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t flex items-center justify-between text-[11px]"
          style={{ borderColor: 'rgba(236, 230, 216, 0.10)', color: '#8a857a' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <Kbd>↑↓</Kbd> Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd> Select
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>esc</Kbd> Close
            </span>
          </div>
          {q && (
            <span className="hidden sm:inline">
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className="px-1.5 py-0.5 rounded font-mono text-[10px]"
      style={{ backgroundColor: 'rgba(236, 230, 216, 0.08)', color: '#ece6d8' }}
    >
      {children}
    </kbd>
  );
}

function Section({ title, action, iconAccent, children }: { title: string; action?: ReactNode; iconAccent?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div
        className="px-5 pt-3 pb-1 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase"
        style={{ color: '#8a857a' }}
      >
        <span className="flex items-center gap-1.5">
          {iconAccent}
          {title}
        </span>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

interface RowProps<T> {
  result: T;
  query: string;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}

function CourseRow({ result, query, active, onHover, onClick }: RowProps<CourseResult>) {
  const c = result.course;
  return (
    <button
      onMouseEnter={onHover}
      onClick={onClick}
      className="w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors"
      style={{ backgroundColor: active ? 'rgba(236, 230, 216, 0.06)' : 'transparent' }}
    >
      <div className="shrink-0 w-12 aspect-video rounded overflow-hidden bg-black">
        <img src={c.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm leading-snug truncate" style={{ color: '#ece6d8' }}>
          <HighlightedText text={c.title} query={query} />
        </div>
        <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: '#8a857a' }}>
          <span style={{ color: '#b8b3a7' }}>
            <HighlightedText text={c.instructor.name} query={query} />
          </span>
          <span aria-hidden>·</span>
          <span><HighlightedText text={c.category} query={query} /></span>
          {c.isBestseller && (
            <>
              <span aria-hidden>·</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: '#d8c594' }}>Bestseller</span>
            </>
          )}
        </div>
      </div>
      <div className="text-xs tabular-nums shrink-0" style={{ color: '#ece6d8' }}>
        {c.price === 0 ? 'Free' : formatMoney(c.discountPrice ?? c.price)}
      </div>
      {active && <CornerDownLeft className="w-3.5 h-3.5 shrink-0" style={{ color: '#8a857a' }} aria-hidden />}
    </button>
  );
}

function InstructorRow({ result, query, active, onHover, onClick }: RowProps<InstructorResult>) {
  return (
    <button
      onMouseEnter={onHover}
      onClick={onClick}
      className="w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors"
      style={{ backgroundColor: active ? 'rgba(236, 230, 216, 0.06)' : 'transparent' }}
    >
      <div
        className="shrink-0 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}
      >
        <img src={result.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm" style={{ color: '#ece6d8' }}>
          <HighlightedText text={result.name} query={query} />
        </div>
        <div className="text-xs" style={{ color: '#8a857a' }}>
          {result.courseCount} {result.courseCount === 1 ? 'course' : 'courses'}
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: 'rgba(236,230,216,0.08)', color: '#b8b3a7' }}>
        Instructor
      </span>
      {active && <CornerDownLeft className="w-3.5 h-3.5 shrink-0" style={{ color: '#8a857a' }} aria-hidden />}
    </button>
  );
}

function CategoryRow({ result, query, active, onHover, onClick }: RowProps<CategoryResult>) {
  return (
    <button
      onMouseEnter={onHover}
      onClick={onClick}
      className="w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors"
      style={{ backgroundColor: active ? 'rgba(236, 230, 216, 0.06)' : 'transparent' }}
    >
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}
        aria-hidden
      >
        <Hash size={14} style={{ color: '#ece6d8' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm" style={{ color: '#ece6d8' }}>
          <HighlightedText text={result.name} query={query} />
        </div>
        <div className="text-xs" style={{ color: '#8a857a' }}>
          {result.courseCount} {result.courseCount === 1 ? 'course' : 'courses'} in this category
        </div>
      </div>
      {active && <CornerDownLeft className="w-3.5 h-3.5 shrink-0" style={{ color: '#8a857a' }} aria-hidden />}
    </button>
  );
}

function PageRow({ result, query, active, onHover, onClick }: RowProps<PageResult>) {
  const Icon = result.icon;
  return (
    <button
      onMouseEnter={onHover}
      onClick={onClick}
      className="w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors"
      style={{ backgroundColor: active ? 'rgba(236, 230, 216, 0.06)' : 'transparent' }}
    >
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}
        aria-hidden
      >
        <Icon size={14} style={{ color: '#ece6d8' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm" style={{ color: '#ece6d8' }}>
          <HighlightedText text={result.title} query={query} />
        </div>
        <div className="text-xs truncate" style={{ color: '#8a857a' }}>
          <HighlightedText text={result.subtitle} query={query} />
        </div>
      </div>
      {active && <CornerDownLeft className="w-3.5 h-3.5 shrink-0" style={{ color: '#8a857a' }} aria-hidden />}
    </button>
  );
}
