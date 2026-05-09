import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { CATEGORIES, DURATION_RANGES } from '../../types/catalog';
import type { CourseLevel } from '../../types/catalog';
import type { CatalogCourse } from '../../types/catalog';

interface Props {
  courses: CatalogCourse[];
  isOpen: boolean;
  onClose: () => void;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 py-4">
      <button
        className="flex items-center justify-between w-full text-left text-sm font-semibold text-white mb-0"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {title}
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced', 'all-levels'];
const RATINGS = [4.5, 4.0, 3.5, 3.0];

export function FilterSidebar({ courses, isOpen, onClose }: Props) {
  const { state, dispatch } = useCatalog();
  const { filters } = state;

  // Derive available languages from data
  const languages = [...new Set(courses.map(c => c.language))].sort();

  const activeCount = [
    filters.category,
    filters.subcategory,
    filters.rating > 0 ? '1' : '',
    ...filters.durations,
    ...filters.levels,
    ...filters.languages,
    filters.priceType !== 'all' ? '1' : '',
    ...filters.features,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex flex-col
          lg:static lg:z-auto lg:w-64 lg:shrink-0
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: '#15171a' }}
        aria-label="Filter sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-semibold">
            <SlidersHorizontal size={16} className="text-violet-400" />
            Filters
            {activeCount > 0 && (
              <span className="text-xs bg-violet-600 text-white px-1.5 py-0.5 rounded-full">{activeCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Reset
              </button>
            )}
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white" aria-label="Close filters">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Category */}
          <Section title="Category">
            <div className="space-y-1.5">
              <button
                onClick={() => dispatch({ type: 'SET_CATEGORY', category: '' })}
                className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${!filters.category ? 'text-violet-400 font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => dispatch({ type: 'SET_CATEGORY', category: filters.category === cat ? '' : cat })}
                  className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${filters.category === cat ? 'text-violet-400 font-medium bg-violet-500/10' : 'text-gray-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Section>

          {/* Rating */}
          <Section title="Rating">
            <div className="space-y-1.5">
              {RATINGS.map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === r}
                    onChange={() => dispatch({ type: 'SET_RATING', rating: filters.rating === r ? 0 : r })}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {r}★ & up
                  </span>
                </label>
              ))}
            </div>
          </Section>

          {/* Duration */}
          <Section title="Duration">
            <div className="space-y-1.5">
              {DURATION_RANGES.map(range => (
                <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.durations.includes(range.label)}
                    onChange={() => dispatch({ type: 'TOGGLE_DURATION', duration: range.label })}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{range.label}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Level */}
          <Section title="Level">
            <div className="space-y-1.5">
              {LEVELS.map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.levels.includes(level)}
                    onChange={() => dispatch({ type: 'TOGGLE_LEVEL', level })}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors capitalize">{level}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Language */}
          <Section title="Language">
            <div className="space-y-1.5">
              {languages.map(lang => (
                <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(lang)}
                    onChange={() => dispatch({ type: 'TOGGLE_LANGUAGE', language: lang })}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{lang}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Price */}
          <Section title="Price">
            <div className="space-y-1.5">
              {(['all', 'free', 'paid'] as const).map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="price"
                    checked={filters.priceType === type}
                    onChange={() => dispatch({ type: 'SET_PRICE_TYPE', priceType: type })}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors capitalize">{type === 'all' ? 'All Prices' : type}</span>
                </label>
              ))}
            </div>
          </Section>
        </div>
      </aside>
    </>
  );
}
