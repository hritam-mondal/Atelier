export interface Resource {
  label: string;
  url: string;
}

export interface Lecture {
  id: string;
  title: string;
  duration: number; // seconds
  videoUrl: string;
  isFreePreview: boolean;
  resources: Resource[];
  description?: string;
}

export interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  instructor: Instructor;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  totalDuration: number; // seconds
  level: CourseLevel;
  lastUpdated: string;
  language: string;
  sections: Section[];
}

// Progress state stored in localStorage
export interface ProgressData {
  completedIds: string[];
  lastWatchedId: string;
  sectionCollapsed: Record<string, boolean>;
  watchedSeconds: Record<string, number>;
}

// Context state
export interface CourseState {
  activeLectureId: string;
  completedLectureIds: Set<string>;
  autoPlayNext: boolean;
  currentTime: number;
  sectionCollapsed: Record<string, boolean>;
  watchedSeconds: Record<string, number>;
}

export type CourseAction =
  | { type: 'SET_ACTIVE_LECTURE'; lectureId: string }
  | { type: 'MARK_COMPLETE'; lectureId: string }
  | { type: 'MARK_INCOMPLETE'; lectureId: string }
  | { type: 'TOGGLE_AUTOPLAY' }
  | { type: 'UPDATE_CURRENT_TIME'; time: number }
  | { type: 'TOGGLE_SECTION_COLLAPSED'; sectionId: string }
  | { type: 'SET_WATCHED_SECONDS'; lectureId: string; seconds: number }
  | { type: 'HYDRATE'; state: Partial<CourseState> };

export interface CourseContextValue {
  course: Course;
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
  getNextLecture: () => Lecture | null;
  getLectureById: (id: string) => Lecture | null;
  getSectionByLectureId: (id: string) => Section | null;
  totalLectures: number;
  completedCount: number;
}

// Video player hook return type
export interface VideoPlayerControls {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  progressPercent: number;
  bufferedPercent: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (r: number) => void;
  toggleFullscreen: () => void;
  togglePiP: () => void;
  skipForward: (sec?: number) => void;
  skipBackward: (sec?: number) => void;
}
