import { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Brain } from 'lucide-react';
import type { Quiz, QuizSubmission } from '../../types/assessment';
import { useQuiz } from '../../hooks/useQuiz';
import { useUser } from '../../context/UserContext';
import { QuestionMC } from './QuestionMC';
import { QuestionTF } from './QuestionTF';
import { QuestionShortAnswer } from './QuestionShortAnswer';
import { CodeQuestion } from './CodeQuestion';
import { QuizResults } from './QuizResults';

interface Props {
  quiz: Quiz;
  onExit: () => void;
}

export function AssessmentRunner({ quiz, onExit }: Props) {
  const { progress, questionIndex, answers, start, setAnswer, next, prev, submit } = useQuiz(quiz);
  const { dispatch: userDispatch } = useUser();
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);

  if (submission) {
    return (
      <QuizResults
        quiz={quiz}
        submission={submission}
        onRetake={() => { setSubmission(null); start(); }}
        onContinue={onExit}
      />
    );
  }

  if (!progress) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div
          className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: 'rgba(236,230,216,0.10)' }}
          aria-hidden
        >
          <Brain size={26} style={{ color: '#ece6d8' }} />
        </div>
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; Knowledge check
        </p>
        <h1 className="font-display text-4xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: '#b8b3a7' }}>
            {quiz.description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={start}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            Start quiz <ArrowRight size={13} aria-hidden />
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 rounded-full text-sm hover:opacity-70 transition-opacity"
            style={{ color: '#b8b3a7' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[questionIndex];
  const isLast = questionIndex === quiz.questions.length - 1;

  const handleSubmit = () => {
    const sub = submit();
    setSubmission(sub);
    userDispatch({
      type: 'ADD_ACTIVITY',
      event: {
        id: `act_${Date.now()}`,
        type: 'quiz_passed',
        courseId: quiz.courseId,
        timestamp: new Date().toISOString(),
        metadata: { quizTitle: quiz.title, score: Math.round(sub.score * 100) },
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs" style={{ color: '#b8b3a7' }}>
          {quiz.title}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums" style={{ color: '#8a857a' }}>
            {questionIndex + 1} / {quiz.questions.length}
          </span>
          <button
            onClick={() => { if (confirm('Exit the quiz? Your progress is saved.')) onExit(); }}
            aria-label="Exit"
            className="rounded p-1 hover:opacity-70 transition-opacity"
          >
            <X size={16} style={{ color: '#b8b3a7' }} />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1 mb-8" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={quiz.questions.length}>
        {quiz.questions.map((_, i) => (
          <span
            key={i}
            className="flex-1 h-0.5 rounded-full transition-colors"
            style={{
              backgroundColor:
                i < questionIndex ? '#ece6d8' :
                i === questionIndex ? 'rgba(236,230,216,0.6)' :
                'rgba(236,230,216,0.10)',
            }}
          />
        ))}
      </div>

      {/* Question */}
      <div className="mb-8">
        {question.kind === 'multiple-choice' || question.kind === 'multi-select' ? (
          <QuestionMC question={question} answer={answers[question.id] as string | string[]} onChange={v => setAnswer(question.id, v)} />
        ) : question.kind === 'true-false' ? (
          <QuestionTF question={question} answer={answers[question.id] as boolean | undefined} onChange={v => setAnswer(question.id, v)} />
        ) : question.kind === 'short-answer' ? (
          <QuestionShortAnswer question={question} answer={answers[question.id] as string | undefined} onChange={v => setAnswer(question.id, v)} />
        ) : question.kind === 'code' ? (
          <CodeQuestion question={question} answer={answers[question.id] as { code: string; passed?: boolean } | undefined} onChange={v => setAnswer(question.id, v)} />
        ) : null}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <button
          onClick={prev}
          disabled={questionIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm hover:opacity-70 transition-opacity disabled:opacity-30"
          style={{ color: '#b8b3a7' }}
        >
          <ArrowLeft size={13} aria-hidden /> Previous
        </button>
        {isLast ? (
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            Submit answers
          </button>
        ) : (
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            Next <ArrowRight size={13} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
