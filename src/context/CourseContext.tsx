import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { Course, CourseState, CourseAction, CourseContextValue, Lecture, Section } from '../types/course';
import { loadProgress, saveProgress } from '../utils/progressStorage';
import courseData from '../data/mockCourse.json';

const course = courseData as Course;

function getFirstLectureId(c: Course): string {
  return c.sections[0]?.lectures[0]?.id ?? '';
}

function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'SET_ACTIVE_LECTURE':
      return { ...state, activeLectureId: action.lectureId, currentTime: 0 };
    case 'MARK_COMPLETE': {
      const next = new Set(state.completedLectureIds);
      next.add(action.lectureId);
      return { ...state, completedLectureIds: next };
    }
    case 'MARK_INCOMPLETE': {
      const next = new Set(state.completedLectureIds);
      next.delete(action.lectureId);
      return { ...state, completedLectureIds: next };
    }
    case 'TOGGLE_AUTOPLAY':
      return { ...state, autoPlayNext: !state.autoPlayNext };
    case 'UPDATE_CURRENT_TIME':
      return { ...state, currentTime: action.time };
    case 'TOGGLE_SECTION_COLLAPSED': {
      const collapsed = { ...state.sectionCollapsed };
      collapsed[action.sectionId] = !collapsed[action.sectionId];
      return { ...state, sectionCollapsed: collapsed };
    }
    case 'SET_WATCHED_SECONDS': {
      const ws = { ...state.watchedSeconds, [action.lectureId]: action.seconds };
      return { ...state, watchedSeconds: ws };
    }
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const CourseContext = createContext<CourseContextValue | null>(null);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const initialState: CourseState = {
    activeLectureId: getFirstLectureId(course),
    completedLectureIds: new Set<string>(),
    autoPlayNext: true,
    currentTime: 0,
    sectionCollapsed: {},
    watchedSeconds: {},
  };

  const [state, dispatch] = useReducer(courseReducer, initialState);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = loadProgress(course.id);
    if (!saved) return;
    const hydrated: Partial<CourseState> = {
      completedLectureIds: new Set(saved.completedIds),
      sectionCollapsed: saved.sectionCollapsed ?? {},
      watchedSeconds: saved.watchedSeconds ?? {},
    };
    if (saved.lastWatchedId) {
      hydrated.activeLectureId = saved.lastWatchedId;
    }
    dispatch({ type: 'HYDRATE', state: hydrated });
  }, []);

  // Persist on every state change
  useEffect(() => {
    saveProgress(course.id, {
      completedIds: [...state.completedLectureIds],
      lastWatchedId: state.activeLectureId,
      sectionCollapsed: state.sectionCollapsed,
      watchedSeconds: state.watchedSeconds,
    });
  }, [state]);

  const allLectures = useMemo(
    () => course.sections.flatMap((s) => s.lectures),
    []
  );

  const getLectureById = useCallback(
    (id: string): Lecture | null => allLectures.find((l) => l.id === id) ?? null,
    [allLectures]
  );

  const getSectionByLectureId = useCallback(
    (id: string): Section | null =>
      course.sections.find((s) => s.lectures.some((l) => l.id === id)) ?? null,
    []
  );

  const getNextLecture = useCallback((): Lecture | null => {
    const idx = allLectures.findIndex((l) => l.id === state.activeLectureId);
    if (idx === -1 || idx >= allLectures.length - 1) return null;
    return allLectures[idx + 1];
  }, [allLectures, state.activeLectureId]);

  const totalLectures = allLectures.length;
  const completedCount = state.completedLectureIds.size;

  const value: CourseContextValue = {
    course,
    state,
    dispatch,
    getNextLecture,
    getLectureById,
    getSectionByLectureId,
    totalLectures,
    completedCount,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourse(): CourseContextValue {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourse must be used within CourseProvider');
  return ctx;
}
