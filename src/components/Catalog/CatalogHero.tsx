import { useState, useRef, useDeferredValue } from 'react';
import { Search, X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { getSearchSuggestions } from '../../utils/filterCourses';
import type { CatalogCourse } from '../../types/catalog';

interface Props {
  courses: CatalogCourse[];
}

export function CatalogHero({ courses }: Props) {
  const { state, dispatch } = useCatalog();
  const [inputValue, setInputValue] = useState(state.filters.query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const deferredInput = useDeferredValue(inputValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getSearchSuggestions(courses, deferredInput);

  const commit = (value: string) => {
    setInputValue(value);
    dispatch({ type: 'SET_QUERY', query: value });
    setShowSuggestions(false);
  };

  const clear = () => {
    setInputValue('');
    dispatch({ type: 'SET_QUERY', query: '' });
    inputRef.current?.focus();
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #15171a 0%, #22252b 50%, #15171a 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[rgba(236,230,216,0.05)] rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display tracking-tight text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
          Expand your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ece6d8] to-[#b8b3a7]">skills</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Explore {courses.length}+ courses across development, design, data science, and more.
        </p>

        {/* Search box */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setShowSuggestions(true); }}
              onKeyDown={e => { if (e.key === 'Enter') commit(inputValue); if (e.key === 'Escape') setShowSuggestions(false); }}
              onFocus={() => inputValue && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search for any course, topic, or instructor…"
              className="w-full pl-11 pr-24 py-3.5 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-sm transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}
              aria-label="Search courses"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
            />
            {inputValue && (
              <button
                onClick={clear}
                className="absolute right-20 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => commit(inputValue)}
              className="absolute right-2 px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul
              className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
              style={{ backgroundColor: '#22252b' }}
              role="listbox"
            >
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  role="option"
                  aria-selected={false}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-violet-500/20 hover:text-white cursor-pointer transition-colors"
                  onMouseDown={() => commit(s)}
                >
                  <Search size={13} className="text-gray-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
