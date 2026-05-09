import { useState, useEffect, useCallback } from 'react';
import type { Quiz, Question, QuizSubmission, MCQuestion, TFQuestion, ShortAnswerQuestion, CodeQuestion } from '../types/assessment';

const STORAGE_KEY_PREFIX = 'quiz-progress:';
const SUBMISSIONS_KEY = 'quiz-submissions-v1';

export interface QuizProgress {
  quizId: string;
  startedAt: string;
  questionIndex: number;
  answers: Record<string, unknown>;
}

function readProgress(quizId: string): QuizProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + quizId);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function writeProgress(p: QuizProgress) {
  try { localStorage.setItem(STORAGE_KEY_PREFIX + p.quizId, JSON.stringify(p)); } catch { /* noop */ }
}
function clearProgress(quizId: string) {
  try { localStorage.removeItem(STORAGE_KEY_PREFIX + quizId); } catch { /* noop */ }
}

function readSubmissions(): QuizSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getLatestSubmission(quizId: string): QuizSubmission | null {
  return readSubmissions().filter(s => s.quizId === quizId).sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0] ?? null;
}

function isCorrect(question: Question, answer: unknown): boolean {
  switch (question.kind) {
    case 'multiple-choice': {
      const q = question as MCQuestion;
      const correct = q.options.find(o => o.correct)?.id;
      return answer === correct;
    }
    case 'multi-select': {
      const q = question as MCQuestion;
      const correct = q.options.filter(o => o.correct).map(o => o.id).sort();
      const got = Array.isArray(answer) ? [...(answer as string[])].sort() : [];
      return JSON.stringify(correct) === JSON.stringify(got);
    }
    case 'true-false':
      return (question as TFQuestion).correctAnswer === answer;
    case 'short-answer': {
      const q = question as ShortAnswerQuestion;
      if (typeof answer !== 'string') return false;
      const trimmed = answer.trim().toLowerCase();
      return q.acceptableAnswers.some(a => a.toLowerCase() === trimmed);
    }
    case 'code': {
      // For code we trust the test runner's verdict, stored under the answer key as { passed: boolean }
      return !!(answer as { passed?: boolean })?.passed;
    }
  }
}

export function gradeQuiz(quiz: Quiz, answers: Record<string, unknown>, startedAt: string): QuizSubmission {
  const totalPoints = quiz.questions.reduce((s, q) => s + q.points, 0);
  let pointsEarned = 0;
  const perQuestion = quiz.questions.map(q => {
    const correct = isCorrect(q, answers[q.id]);
    if (correct) pointsEarned += q.points;
    return { id: q.id, correct, pointsEarned: correct ? q.points : 0 };
  });
  const score = totalPoints > 0 ? pointsEarned / totalPoints : 0;
  const passed = score >= quiz.passingScore;
  return {
    quizId: quiz.id, answers, score, totalPoints, pointsEarned, passed, perQuestion,
    startedAt, completedAt: new Date().toISOString(),
  };
}

export function useQuiz(quiz: Quiz) {
  const [progress, setProgress] = useState<QuizProgress | null>(() => readProgress(quiz.id));
  const [questionIndex, setQuestionIndex] = useState(progress?.questionIndex ?? 0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(progress?.answers ?? {});

  useEffect(() => {
    if (!progress) return;
    writeProgress({ ...progress, questionIndex, answers });
  }, [progress, questionIndex, answers]);

  const start = useCallback(() => {
    const p: QuizProgress = {
      quizId: quiz.id,
      startedAt: new Date().toISOString(),
      questionIndex: 0,
      answers: {},
    };
    setProgress(p);
    setQuestionIndex(0);
    setAnswers({});
    writeProgress(p);
  }, [quiz.id]);

  const setAnswer = useCallback((questionId: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const next = () => setQuestionIndex(i => Math.min(i + 1, quiz.questions.length - 1));
  const prev = () => setQuestionIndex(i => Math.max(i - 1, 0));

  const submit = useCallback((): QuizSubmission => {
    const sub = gradeQuiz(quiz, answers, progress?.startedAt ?? new Date().toISOString());
    const all = readSubmissions();
    try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([sub, ...all].slice(0, 50))); } catch { /* noop */ }
    clearProgress(quiz.id);
    setProgress(null);
    return sub;
  }, [quiz, answers, progress?.startedAt]);

  const reset = useCallback(() => {
    clearProgress(quiz.id);
    setProgress(null);
    setQuestionIndex(0);
    setAnswers({});
  }, [quiz.id]);

  return { progress, questionIndex, answers, start, setAnswer, next, prev, submit, reset, setQuestionIndex };
}

export function runCodeTests(question: CodeQuestion, userCode: string): { passed: boolean; results: { label: string; pass: boolean; got?: unknown; expected: unknown; error?: string }[] } {
  const results: { label: string; pass: boolean; got?: unknown; expected: unknown; error?: string }[] = [];
  // Build a function that exposes the user's function names. Strict mode + sandbox.
  let fn: ((...args: unknown[]) => unknown) | null = null;
  try {
    // Extract first function declaration name to call.
    const match = userCode.match(/function\s+([A-Za-z_$][\w$]*)/);
    const name = match?.[1] ?? '__user';
    const wrapped = `'use strict';\n${userCode}\nreturn typeof ${name} === 'function' ? ${name} : null;`;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    fn = new Function(wrapped)() as ((...args: unknown[]) => unknown);
  } catch (e) {
    return {
      passed: false,
      results: question.testCases.map(tc => ({
        label: tc.label ?? 'test',
        pass: false,
        expected: tc.expected,
        error: e instanceof Error ? e.message : String(e),
      })),
    };
  }
  if (!fn) {
    return {
      passed: false,
      results: question.testCases.map(tc => ({
        label: tc.label ?? 'test',
        pass: false,
        expected: tc.expected,
        error: 'No function found in your code.',
      })),
    };
  }

  for (const tc of question.testCases) {
    try {
      const got = fn!(...tc.input);
      const pass = JSON.stringify(got) === JSON.stringify(tc.expected);
      results.push({ label: tc.label ?? `${JSON.stringify(tc.input)}`, pass, got, expected: tc.expected });
    } catch (e) {
      results.push({
        label: tc.label ?? 'test',
        pass: false,
        expected: tc.expected,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }
  const passed = results.every(r => r.pass);
  return { passed, results };
}
