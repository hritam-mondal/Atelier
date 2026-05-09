import { X } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import type { CourseLevel } from '../../types/catalog';

export function ActiveFilterChips() {
    const { state, dispatch } = useCatalog();
    const { filters } = state;

    const chips: { label: string; onRemove: () => void }[] = [];

    if (filters.query)
        chips.push({ label: `"${filters.query}"`, onRemove: () => dispatch({ type: 'SET_QUERY', query: '' }) });
    if (filters.category)
        chips.push({ label: filters.category, onRemove: () => dispatch({ type: 'SET_CATEGORY', category: '' }) });
    if (filters.subcategory)
        chips.push({ label: filters.subcategory, onRemove: () => dispatch({ type: 'SET_SUBCATEGORY', subcategory: '' }) });
    if (filters.rating > 0)
        chips.push({ label: `${filters.rating}★+`, onRemove: () => dispatch({ type: 'SET_RATING', rating: 0 }) });
    filters.durations.forEach(d =>
        chips.push({ label: d, onRemove: () => dispatch({ type: 'TOGGLE_DURATION', duration: d }) })
    );
    filters.levels.forEach(l =>
        chips.push({ label: l, onRemove: () => dispatch({ type: 'TOGGLE_LEVEL', level: l as CourseLevel }) })
    );
    filters.languages.forEach(l =>
        chips.push({ label: l, onRemove: () => dispatch({ type: 'TOGGLE_LANGUAGE', language: l }) })
    );
    if (filters.priceType !== 'all')
        chips.push({ label: filters.priceType === 'free' ? 'Free' : 'Paid', onRemove: () => dispatch({ type: 'SET_PRICE_TYPE', priceType: 'all' }) });
    filters.features.forEach(f =>
        chips.push({ label: f, onRemove: () => dispatch({ type: 'TOGGLE_FEATURE', feature: f }) })
    );

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {chips.map((chip, i) => (
                <span
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-violet-500/40 text-violet-300 bg-violet-500/10"
                >
                    {chip.label}
                    <button
                        onClick={chip.onRemove}
                        className="hover:text-white transition-colors"
                        aria-label={`Remove filter: ${chip.label}`}
                    >
                        <X size={11} />
                    </button>
                </span>
            ))}
            {chips.length > 1 && (
                <button
                    onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                    className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}
