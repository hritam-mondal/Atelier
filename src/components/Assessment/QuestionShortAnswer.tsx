import type { ShortAnswerQuestion } from '../../types/assessment';
import { MarkdownPreview } from '../../utils/renderMarkdown';

interface Props {
  question: ShortAnswerQuestion;
  answer: string | undefined;
  onChange: (next: string) => void;
}

export function QuestionShortAnswer({ question, answer, onChange }: Props) {
  return (
    <div>
      <MarkdownPreview source={question.prompt} className="font-display text-xl leading-snug mb-1" />
      <p className="text-xs uppercase tracking-wider mb-5" style={{ color: '#8a857a' }}>
        Short answer · {question.points} {question.points === 1 ? 'point' : 'points'}
      </p>
      <input
        type="text"
        value={answer ?? ''}
        onChange={e => onChange(e.target.value)}
        autoFocus
        placeholder="Type your answer"
        className="w-full px-4 py-3 rounded-lg outline-none text-base"
        style={{
          backgroundColor: 'rgba(236,230,216,0.02)',
          border: '1px solid rgba(236,230,216,0.20)',
          color: '#ece6d8',
        }}
      />
    </div>
  );
}
