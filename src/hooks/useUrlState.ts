import { useCallback } from 'react';
import type { CatalogState } from '../types/catalog';
import { DEFAULT_FILTERS } from '../types/catalog';

function serialize(state: CatalogState): string {
  const params = new URLSearchParams();
  const f = state.filters;
  if (f.query)              params.set('q', f.query);
  if (f.category)           params.set('cat', f.category);
  if (f.subcategory)        params.set('sub', f.subcategory);
  if (f.rating > 0)         params.set('rating', String(f.rating));
  if (f.durations.length)   params.set('dur', f.durations.join(','));
  if (f.levels.length)      params.set('lvl', f.levels.join(','));
  if (f.languages.length)   params.set('lang', f.languages.join(','));
  if (f.priceType !== 'all') params.set('price', f.priceType);
  if (f.priceMin !== DEFAULT_FILTERS.priceMin) params.set('pmin', String(f.priceMin));
  if (f.priceMax !== DEFAULT_FILTERS.priceMax) params.set('pmax', String(f.priceMax));
  if (f.features.length)    params.set('feat', f.features.join(','));
  if (state.sort !== 'most-popular') params.set('sort', state.sort);
  if (state.view !== 'grid') params.set('view', state.view);
  return params.toString();
}

export function parseUrlState(): Partial<CatalogState> {
  const params = new URLSearchParams(window.location.search);
  const partial: Partial<CatalogState> = {};
  const f: Partial<CatalogState['filters']> = {};

  if (params.has('q'))      f.query = params.get('q')!;
  if (params.has('cat'))    f.category = params.get('cat')!;
  if (params.has('sub'))    f.subcategory = params.get('sub')!;
  if (params.has('rating')) f.rating = Number(params.get('rating'));
  if (params.has('dur'))    f.durations = params.get('dur')!.split(',');
  if (params.has('lvl'))    f.levels = params.get('lvl')!.split(',') as CatalogState['filters']['levels'];
  if (params.has('lang'))   f.languages = params.get('lang')!.split(',');
  if (params.has('price'))  f.priceType = params.get('price') as 'all' | 'free' | 'paid';
  if (params.has('pmin'))   f.priceMin = Number(params.get('pmin'));
  if (params.has('pmax'))   f.priceMax = Number(params.get('pmax'));
  if (params.has('feat'))   f.features = params.get('feat')!.split(',');

  if (Object.keys(f).length) partial.filters = { ...DEFAULT_FILTERS, ...f };
  if (params.has('sort'))   partial.sort = params.get('sort') as CatalogState['sort'];
  if (params.has('view'))   partial.view = params.get('view') as CatalogState['view'];

  return partial;
}

export function useSyncUrl(state: CatalogState) {
  return useCallback(() => {
    const qs = serialize(state);
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [state]);
}
