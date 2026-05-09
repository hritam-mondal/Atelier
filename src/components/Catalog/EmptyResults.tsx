import { SearchX } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export function EmptyResults() {
  const { dispatch } = useCatalog();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SearchX size={56} className="text-gray-600 mb-4" />
      <h3 className="text-white text-xl font-semibold mb-2">No courses found</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-sm">
        We couldn't find any courses matching your current filters. Try adjusting them or start fresh.
      </p>
      <button
        onClick={() => dispatch({ type: 'RESET_FILTERS' })}
        className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
