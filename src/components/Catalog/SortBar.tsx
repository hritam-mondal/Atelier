import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { SORT_LABELS } from '../../types/catalog';
import type { SortOption } from '../../types/catalog';

interface Props {
  totalCount: number;
  filteredCount: number;
}

export function SortBar({ totalCount, filteredCount }: Props) {
  const { state, dispatch } = useCatalog();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/10 mb-4">
      <span className="text-gray-400 text-sm">
        <span className="text-white font-medium">{filteredCount.toLocaleString()}</span>
        {filteredCount !== totalCount && ` of ${totalCount.toLocaleString()}`} courses
      </span>

      <div className="flex-1" />

      {/* Sort select */}
      <div className="relative">
        <select
          value={state.sort}
          onChange={e => dispatch({ type: 'SET_SORT', sort: e.target.value as SortOption })}
          className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm text-white border border-white/20 focus:border-violet-500 focus:outline-none cursor-pointer"
          style={{ backgroundColor: '#22252b' }}
          aria-label="Sort courses"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map(key => (
            <option key={key} value={key}>{SORT_LABELS[key]}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* View toggle */}
      <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', view: 'grid' })}
          className={`p-1.5 transition-colors ${state.view === 'grid' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
          aria-label="Grid view"
          aria-pressed={state.view === 'grid'}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', view: 'list' })}
          className={`p-1.5 transition-colors ${state.view === 'list' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
          aria-label="List view"
          aria-pressed={state.view === 'list'}
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
}
