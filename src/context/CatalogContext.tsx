import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { CatalogState, CatalogAction } from '../types/catalog';
import { DEFAULT_STATE } from '../types/catalog';
import { parseUrlState, useSyncUrl } from '../hooks/useUrlState';

function catalogReducer(state: CatalogState, action: CatalogAction): CatalogState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, filters: { ...state.filters, query: action.query }, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, filters: { ...state.filters, category: action.category, subcategory: action.subcategory ?? '' }, page: 1 };
    case 'SET_SUBCATEGORY':
      return { ...state, filters: { ...state.filters, subcategory: action.subcategory }, page: 1 };
    case 'SET_RATING':
      return { ...state, filters: { ...state.filters, rating: action.rating }, page: 1 };
    case 'TOGGLE_DURATION': {
      const exists = state.filters.durations.includes(action.duration);
      return { ...state, filters: { ...state.filters, durations: exists ? state.filters.durations.filter(d => d !== action.duration) : [...state.filters.durations, action.duration] }, page: 1 };
    }
    case 'TOGGLE_LEVEL': {
      const exists = state.filters.levels.includes(action.level);
      return { ...state, filters: { ...state.filters, levels: exists ? state.filters.levels.filter(l => l !== action.level) : [...state.filters.levels, action.level] }, page: 1 };
    }
    case 'TOGGLE_LANGUAGE': {
      const exists = state.filters.languages.includes(action.language);
      return { ...state, filters: { ...state.filters, languages: exists ? state.filters.languages.filter(l => l !== action.language) : [...state.filters.languages, action.language] }, page: 1 };
    }
    case 'SET_PRICE_TYPE':
      return { ...state, filters: { ...state.filters, priceType: action.priceType }, page: 1 };
    case 'SET_PRICE_RANGE':
      return { ...state, filters: { ...state.filters, priceMin: action.min, priceMax: action.max }, page: 1 };
    case 'TOGGLE_FEATURE': {
      const exists = state.filters.features.includes(action.feature);
      return { ...state, filters: { ...state.filters, features: exists ? state.filters.features.filter(f => f !== action.feature) : [...state.filters.features, action.feature] }, page: 1 };
    }
    case 'SET_SORT':
      return { ...state, sort: action.sort };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'RESET_FILTERS':
      return { ...DEFAULT_STATE };
    case 'LOAD_FROM_URL':
      return { ...state, ...action.state, filters: { ...state.filters, ...(action.state.filters ?? {}) } };
    default:
      return state;
  }
}

interface CatalogContextValue {
  state: CatalogState;
  dispatch: React.Dispatch<CatalogAction>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(catalogReducer, DEFAULT_STATE);
  const syncUrl = useSyncUrl(state);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const fromUrl = parseUrlState();
      if (Object.keys(fromUrl).length > 0) {
        dispatch({ type: 'LOAD_FROM_URL', state: fromUrl });
      }
    }
  }, []);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
