import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import type { Quiz, QuizSubmission } from '../../types/assessment';
import { MarkdownPreview } from '../../utils/renderMarkdown';

interface Props {
  quiz: Quiz;
  submission: QuizSubmission;
  onRetake: () => void;
  onContinue: () => void;
}

export function QuizResults({ quiz, submission, onRetake, onContinue }: Props) {
  const percent = Math.round(submission.score * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          border: `1px solid ${submission.passed ? 'rgba(168,192,138,0.40)' : 'rgba(216,197,148,0.40)'}`,
          backgroundColor: submission.passed ? 'rgba(168,192,138,0.06)' : 'rgba(216,197,148,0.04)',
        }}
      >
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; {submission.passed ? 'Quiz passed' : 'Almost there'}
        </p>
        <p className="font-display text-7xl tracking-tight mb-2" style={{ color: submission.passed ? '#a8c08a' : '#d8c594' }}>
          {percent}%
        </p>
        <p className="text-sm mb-1" style={{ color: '#ece6d8' }}>
          {submission.pointsEarned} of {submission.totalPoints} points
        </p>
        <p className="text-xs" style={{ color: '#8a857a' }}>
          Passing score: {Math.round(quiz.passingScore * 100)}%
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {quiz.questions.map((q, i) => {
          const result = submission.perQuestion.find(p => p.id === q.id);
          if (!result) return null;
          return (
            <div
              key={q.id}
              className="rounded-xl p-4"
              style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}
            >
              <div className="flex items-start gap-3">
                {result.correct ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-1" style={{ color: '#a8c08a' }} aria-hidden />
                ) : (
                  <XCircle size={16} className="shrink-0 mt-1" style={{ color: '#c5897a' }} aria-hidden />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8a857a' }}>
                    Question {i + 1} · {result.pointsEarned} / {q.points} points
                  </p>
                  <MarkdownPreview source={q.prompt} className="text-sm leading-relaxed" />
                  {q.explanation && (
                    <div
                      className="mt-3 p-3 rounded text-xs leading-relaxed"
                      style={{ backgroundColor: 'rgba(236,230,216,0.04)', borderLeft: '2px solid rgba(236,230,216,0.40)', color: '#b8b3a7' }}
                    >
                      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8a857a' }}>
                        Explanation
                      </p>
                      <MarkdownPreview source={q.explanation} className="text-xs" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
        >
          <RotateCcw size={13} aria-hidden /> Retake quiz
        </button>
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          {submission.passed ? 'Continue to next lecture' : 'Back to lecture'} <ArrowRight size={13} aria-hidden />
        </button>
      </div>
    </div>
  );
}
