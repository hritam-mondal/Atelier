export interface QAQuestion {
  id: string;
  courseId: string;
  lectureId?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isInstructor: boolean;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  answerCount: number;
  views: number;
  pinned: boolean;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QAAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isInstructor: boolean;
  body: string;
  upvotes: number;
  isAcceptedAnswer: boolean;
  createdAt: string;
  parentAnswerId?: string;
}

export type QAVoteDirection = 1 | -1 | 0;

export interface QAVote {
  userId: string;
  targetId: string;
  targetKind: 'question' | 'answer';
  direction: QAVoteDirection;
}

export type QASort = 'recent' | 'top' | 'most-answers' | 'mine';
export type QAFilter = 'all' | 'lecture' | 'instructor' | 'open' | 'resolved' | 'mine';

export interface CohortThread {
  id: string;
  cohortId: string;
  category: 'announcements' | 'general' | 'help' | 'showcase' | 'jobs';
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  replyCount: number;
  lastReplyAt: string;
  pinned: boolean;
  createdAt: string;
}

export interface QAState {
  questions: QAQuestion[];
  answers: QAAnswer[];
  votes: QAVote[];
  cohortThreads: CohortThread[];
}

export type QAAction =
  | { type: 'ADD_QUESTION'; question: QAQuestion }
  | { type: 'ADD_ANSWER'; answer: QAAnswer }
  | { type: 'TOGGLE_VOTE'; targetId: string; targetKind: 'question' | 'answer'; direction: 1 | -1; userId: string }
  | { type: 'ACCEPT_ANSWER'; answerId: string; questionId: string }
  | { type: 'TOGGLE_PIN'; questionId: string }
  | { type: 'TOGGLE_RESOLVED'; questionId: string }
  | { type: 'ADD_COHORT_THREAD'; thread: CohortThread }
  | { type: 'HYDRATE'; state: Partial<QAState> };
