import { CheckCircle2, GraduationCap } from 'lucide-react';
import type { QAAnswer } from '../../types/qa';
import { VoteWidget } from './VoteWidget';
import { MarkdownPreview } from '../../utils/renderMarkdown';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { useQA } from '../../context/QAContext';

interface Props {
  answer: QAAnswer;
  isQuestionAuthor: boolean;
  questionId: string;
}

export function AnswerCard({ answer, isQuestionAuthor, questionId }: Props) {
  const { dispatch } = useQA();

  return (
    <article
      className="flex gap-3 px-3 py-3 rounded-lg"
      style={{
        border: answer.isAcceptedAnswer ? '1px solid rgba(168,192,138,0.40)' : '1px solid rgba(236,230,216,0.08)',
        backgroundColor: answer.isAcceptedAnswer ? 'rgba(168,192,138,0.06)' : 'rgba(236,230,216,0.02)',
      }}
    >
      <VoteWidget targetId={answer.id} targetKind="answer" count={answer.upvotes} />
      <div className="flex-1 min-w-0">
        <header className="flex items-center gap-2 mb-2">
          <img src={answer.authorAvatar} alt="" className="w-6 h-6 rounded-full" loading="lazy" />
          <span className="text-xs font-medium" style={{ color: '#ece6d8' }}>{answer.authorName}</span>
          {answer.isInstructor && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}>
              <GraduationCap size={10} aria-hidden /> Instructor
            </span>
          )}
          {answer.isAcceptedAnswer && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(168,192,138,0.15)', color: '#a8c08a' }}>
              <CheckCircle2 size={10} aria-hidden /> Accepted
            </span>
          )}
          <span className="text-[11px] ml-auto" style={{ color: '#8a857a' }}>
            {formatRelativeTime(answer.createdAt)}
          </span>
        </header>
        <MarkdownPreview source={answer.body} className="text-sm leading-relaxed" />
        {isQuestionAuthor && !answer.isAcceptedAnswer && (
          <button
            onClick={() => dispatch({ type: 'ACCEPT_ANSWER', answerId: answer.id, questionId })}
            className="mt-2 text-xs hover:opacity-70 transition-opacity inline-flex items-center gap-1"
            style={{ color: '#a8c08a' }}
          >
            <CheckCircle2 size={11} aria-hidden /> Accept this answer
          </button>
        )}
      </div>
    </article>
  );
}
