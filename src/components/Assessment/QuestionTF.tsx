import type { TFQuestion } from '../../types/assessment';
import { MarkdownPreview } from '../../utils/renderMarkdown';

interface Props {
  question: TFQuestion;
  answer: boolean | undefined;
  onChange: (next: boolean) => void;
}

export function QuestionTF({ question, answer, onChange }: Props) {
  return (
    <div>
      <MarkdownPreview source={question.prompt} className="font-display text-xl leading-snug mb-1" />
      <p className="text-xs uppercase tracking-wider mb-5" style={{ color: '#8a857a' }}>
        True or false · {question.points} {question.points === 1 ? 'point' : 'points'}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map(v => (
          <button
            key={String(v)}
            onClick={() => onChange(v)}
            className="py-4 rounded-lg font-display text-lg transition-all"
            style={
              answer === v
                ? { border: '1px solid rgba(236,230,216,0.55)', backgroundColor: 'rgba(236,230,216,0.08)', color: '#ece6d8' }
                : { border: '1px solid rgba(236,230,216,0.15)', backgroundColor: 'rgba(236,230,216,0.02)', color: '#b8b3a7' }
            }
          >
            {v ? 'True' : 'False'}
          </button>
        ))}
      </div>
    </div>
  );
}
