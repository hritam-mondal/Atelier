export type QuestionKind = 'multiple-choice' | 'multi-select' | 'true-false' | 'short-answer' | 'code';

interface BaseQuestion {
  id: string;
  kind: QuestionKind;
  prompt: string;
  explanation?: string;
  points: number;
}

export interface MCQuestion extends BaseQuestion {
  kind: 'multiple-choice' | 'multi-select';
  options: { id: string; text: string; correct: boolean }[];
}

export interface TFQuestion extends BaseQuestion {
  kind: 'true-false';
  correctAnswer: boolean;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  kind: 'short-answer';
  acceptableAnswers: string[];
}

export interface CodeQuestion extends BaseQuestion {
  kind: 'code';
  language: 'javascript';
  starterCode: string;
  solution: string;
  testCases: { input: unknown[]; expected: unknown; label?: string }[];
}

export type Question = MCQuestion | TFQuestion | ShortAnswerQuestion | CodeQuestion;

export interface Quiz {
  id: string;
  courseId: string;
  sectionId: string;
  insertAfterLectureId: string;
  title: string;
  description?: string;
  passingScore: number;
  shuffleQuestions: boolean;
  questions: Question[];
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, unknown>;
  score: number;
  totalPoints: number;
  pointsEarned: number;
  passed: boolean;
  perQuestion: { id: string; correct: boolean; pointsEarned: number }[];
  startedAt: string;
  completedAt: string;
}
