export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

export interface CatalogInstructor {
  id: string;
  name: string;
  avatar: string;
}

export interface CatalogCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  previewVideoUrl?: string;
  instructor: CatalogInstructor;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  totalDuration: number; // seconds
  lectureCount: number;
  level: CourseLevel;
  category: string;
  subcategory: string;
  tags: string[];
  language: string;
  price: number;
  discountPrice?: number;
  isBestseller: boolean;
  isNew: boolean;
  lastUpdated: string;
  shortDescription: string;
  whatYouLearn: string[];
}

export type SortOption =
  | 'most-popular'
  | 'highest-rated'
  | 'newest'
  | 'most-reviewed'
  | 'price-low'
  | 'price-high';

export type ViewMode = 'grid' | 'list';

export interface DurationRange {
  label: string;
  min: number; // hours
  max: number; // hours (Infinity for open-ended)
}

export interface FilterState {
  query: string;
  category: string;
  subcategory: string;
  rating: number; // minimum rating, 0 = all
  durations: string[]; // duration range labels
  levels: CourseLevel[];
  languages: string[];
  priceType: 'all' | 'free' | 'paid';
  priceMin: number;
  priceMax: number;
  features: string[]; // 'subtitles' | 'quizzes' | 'coding' | 'certificate'
}

export interface CatalogState {
  filters: FilterState;
  sort: SortOption;
  view: ViewMode;
  page: number;
}

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  category: '',
  subcategory: '',
  rating: 0,
  durations: [],
  levels: [],
  languages: [],
  priceType: 'all',
  priceMin: 0,
  priceMax: 200,
  features: [],
};

export const DEFAULT_STATE: CatalogState = {
  filters: DEFAULT_FILTERS,
  sort: 'most-popular',
  view: 'grid',
  page: 1,
};

export const DURATION_RANGES: DurationRange[] = [
  { label: '0–1 hour', min: 0, max: 1 },
  { label: '1–3 hours', min: 1, max: 3 },
  { label: '3–6 hours', min: 3, max: 6 },
  { label: '6–17 hours', min: 6, max: 17 },
  { label: '17+ hours', min: 17, max: Infinity },
];

export const SORT_LABELS: Record<SortOption, string> = {
  'most-popular': 'Most Popular',
  'highest-rated': 'Highest Rated',
  'newest': 'Newest',
  'most-reviewed': 'Most Reviewed',
  'price-low': 'Price: Low → High',
  'price-high': 'Price: High → Low',
};

export const CATEGORIES = [
  'Web Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Personal Development',
];

export type CatalogAction =
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_CATEGORY'; category: string; subcategory?: string }
  | { type: 'SET_SUBCATEGORY'; subcategory: string }
  | { type: 'SET_RATING'; rating: number }
  | { type: 'TOGGLE_DURATION'; duration: string }
  | { type: 'TOGGLE_LEVEL'; level: CourseLevel }
  | { type: 'TOGGLE_LANGUAGE'; language: string }
  | { type: 'SET_PRICE_TYPE'; priceType: 'all' | 'free' | 'paid' }
  | { type: 'SET_PRICE_RANGE'; min: number; max: number }
  | { type: 'TOGGLE_FEATURE'; feature: string }
  | { type: 'SET_SORT'; sort: SortOption }
  | { type: 'SET_VIEW'; view: ViewMode }
  | { type: 'RESET_FILTERS' }
  | { type: 'LOAD_FROM_URL'; state: Partial<CatalogState> };
