import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { InstructorState, InstructorAction } from '../types/instructor';
import { initialInstructorState } from '../data/mockInstructorState';

const STORAGE_KEY = 'instructor-state-v1';

function reducer(state: InstructorState, action: InstructorAction): InstructorState {
  switch (action.type) {
    case 'CREATE_DRAFT':
      return { ...state, drafts: [action.draft, ...state.drafts] };
    case 'UPDATE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.id ? { ...d, ...action.patch, lastUpdatedAt: new Date().toISOString() } : d
        ),
      };
    case 'PUBLISH_DRAFT':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.id ? { ...d, status: 'published', publishedAt: new Date().toISOString(), lastUpdatedAt: new Date().toISOString() } : d
        ),
      };
    case 'ARCHIVE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.id ? { ...d, status: 'archived', lastUpdatedAt: new Date().toISOString() } : d
        ),
      };
    case 'ADD_SECTION':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.draftId
            ? { ...d, sections: [...d.sections, { id: `s_${Date.now()}`, title: action.title, lectures: [] }], lastUpdatedAt: new Date().toISOString() }
            : d
        ),
      };
    case 'UPDATE_SECTION':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.draftId
            ? {
                ...d,
                sections: d.sections.map(s => s.id === action.sectionId ? { ...s, ...action.patch } : s),
                lastUpdatedAt: new Date().toISOString(),
              }
            : d
        ),
      };
    case 'REMOVE_SECTION':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.draftId
            ? { ...d, sections: d.sections.filter(s => s.id !== action.sectionId), lastUpdatedAt: new Date().toISOString() }
            : d
        ),
      };
    case 'REORDER_SECTIONS':
      return {
        ...state,
        drafts: state.drafts.map(d => {
          if (d.id !== action.draftId) return d;
          const map = new Map(d.sections.map(s => [s.id, s]));
          const reordered = action.orderedIds.map(id => map.get(id)).filter((s): s is typeof d.sections[number] => !!s);
          return { ...d, sections: reordered, lastUpdatedAt: new Date().toISOString() };
        }),
      };
    case 'ADD_LECTURE':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.draftId
            ? {
                ...d,
                sections: d.sections.map(s =>
                  s.id === action.sectionId
                    ? { ...s, lectures: [...s.lectures, { id: `l_${Date.now()}`, title: action.title, description: '', isFreePreview: false }] }
                    : s
                ),
                lastUpdatedAt: new Date().toISOString(),
              }
            : d
        ),
      };
    case 'UPDATE_LECTURE':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.draftId
            ? {
                ...d,
                sections: d.sections.map(s =>
                  s.id === action.sectionId
                    ? { ...s, lectures: s.lectures.map(l => l.id === action.lectureId ? { ...l, ...action.patch } : l) }
                    : s
                ),
                lastUpdatedAt: new Date().toISOString(),
              }
            : d
        ),
      };
    case 'REMOVE_LECTURE':
      return {
        ...state,
        drafts: state.drafts.map(d =>
          d.id === action.draftId
            ? {
                ...d,
                sections: d.sections.map(s =>
                  s.id === action.sectionId
                    ? { ...s, lectures: s.lectures.filter(l => l.id !== action.lectureId) }
                    : s
                ),
                lastUpdatedAt: new Date().toISOString(),
              }
            : d
        ),
      };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ContextValue {
  state: InstructorState;
  dispatch: React.Dispatch<InstructorAction>;
}

const InstructorContext = createContext<ContextValue | null>(null);

export function InstructorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialInstructorState);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) });
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <InstructorContext.Provider value={value}>{children}</InstructorContext.Provider>;
}

export function useInstructor() {
  const ctx = useContext(InstructorContext);
  if (!ctx) throw new Error('useInstructor must be used within InstructorProvider');
  return ctx;
}
