import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { QAState, QAAction } from '../types/qa';
import { mockQuestions, mockAnswers, mockCohortThreads } from '../data/mockQA';

const STORAGE_KEY = 'qa-state-v1';
const CURRENT_USER_ID = 'u-current';

const initial: QAState = {
  questions: mockQuestions,
  answers: mockAnswers,
  votes: [],
  cohortThreads: mockCohortThreads,
};

function reducer(state: QAState, action: QAAction): QAState {
  switch (action.type) {
    case 'ADD_QUESTION':
      return { ...state, questions: [action.question, ...state.questions] };
    case 'ADD_ANSWER': {
      const answers = [action.answer, ...state.answers];
      const questions = state.questions.map(q =>
        q.id === action.answer.questionId ? { ...q, answerCount: q.answerCount + 1, updatedAt: action.answer.createdAt } : q
      );
      return { ...state, answers, questions };
    }
    case 'TOGGLE_VOTE': {
      const existing = state.votes.find(v => v.userId === action.userId && v.targetId === action.targetId && v.targetKind === action.targetKind);
      let nextVotes;
      let delta = 0;
      if (existing && existing.direction === action.direction) {
        // Toggle off
        nextVotes = state.votes.filter(v => v !== existing);
        delta = -action.direction;
      } else if (existing) {
        nextVotes = state.votes.map(v => v === existing ? { ...v, direction: action.direction } : v);
        delta = action.direction - existing.direction;
      } else {
        nextVotes = [...state.votes, { userId: action.userId, targetId: action.targetId, targetKind: action.targetKind, direction: action.direction }];
        delta = action.direction;
      }
      // Update tally
      let questions = state.questions, answers = state.answers;
      if (action.targetKind === 'question') {
        questions = questions.map(q => q.id === action.targetId ? { ...q, upvotes: q.upvotes + delta } : q);
      } else {
        answers = answers.map(a => a.id === action.targetId ? { ...a, upvotes: a.upvotes + delta } : a);
      }
      return { ...state, votes: nextVotes, questions, answers };
    }
    case 'ACCEPT_ANSWER': {
      const answers = state.answers.map(a => a.questionId === action.questionId
        ? { ...a, isAcceptedAnswer: a.id === action.answerId }
        : a
      );
      const questions = state.questions.map(q =>
        q.id === action.questionId ? { ...q, resolved: true } : q
      );
      return { ...state, answers, questions };
    }
    case 'TOGGLE_PIN':
      return { ...state, questions: state.questions.map(q => q.id === action.questionId ? { ...q, pinned: !q.pinned } : q) };
    case 'TOGGLE_RESOLVED':
      return { ...state, questions: state.questions.map(q => q.id === action.questionId ? { ...q, resolved: !q.resolved } : q) };
    case 'ADD_COHORT_THREAD':
      return { ...state, cohortThreads: [action.thread, ...state.cohortThreads] };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ContextValue {
  state: QAState;
  dispatch: React.Dispatch<QAAction>;
  currentUserId: string;
  voteOf: (targetId: string, kind: 'question' | 'answer') => 1 | -1 | 0;
}

const QAContext = createContext<ContextValue | null>(null);

export function QAProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
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

  const value = useMemo<ContextValue>(() => {
    const voteOf = (targetId: string, kind: 'question' | 'answer'): 1 | -1 | 0 =>
      state.votes.find(v => v.userId === CURRENT_USER_ID && v.targetId === targetId && v.targetKind === kind)?.direction as 1 | -1 | 0 ?? 0;
    return { state, dispatch, currentUserId: CURRENT_USER_ID, voteOf };
  }, [state]);

  return <QAContext.Provider value={value}>{children}</QAContext.Provider>;
}

export function useQA() {
  const ctx = useContext(QAContext);
  if (!ctx) throw new Error('useQA must be used within QAProvider');
  return ctx;
}
