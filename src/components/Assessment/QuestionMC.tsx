import type { MCQuestion } from '../../types/assessment';
import { MarkdownPreview } from '../../utils/renderMarkdown';

interface Props {
  question: MCQuestion;
  answer: string | string[] | undefined;
  onChange: (next: string | string[]) => void;
}

export function QuestionMC({ question, answer, onChange }: Props) {
  const isMulti = question.kind === 'multi-select';
  const selected = isMulti ? (Array.isArray(answer) ? answer : []) : (typeof answer === 'string' ? [answer] : []);

  const toggle = (id: string) => {
    if (isMulti) {
      const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
      onChange(next);
    } else {
      onChange(id);
    }
  };

  return (
    <div>
      <MarkdownPreview source={question.prompt} className="font-display text-xl leading-snug mb-1" />
      <p className="text-xs uppercase tracking-wider mb-5" style={{ color: '#8a857a' }}>
        {isMulti ? 'Select all that apply' : 'Select one'} · {question.points} {question.points === 1 ? 'point' : 'points'}
      </p>
      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all"
              style={{
                border: isSelected ? '1px solid rgba(236,230,216,0.55)' : '1px solid rgba(236,230,216,0.15)',
                backgroundColor: isSelected ? 'rgba(236,230,216,0.06)' : 'rgba(236,230,216,0.02)',
              }}
            >
              <input
                type={isMulti ? 'checkbox' : 'radio'}
                name={question.id}
                checked={isSelected}
                onChange={() => toggle(option.id)}
                className="mt-1 accent-[#ece6d8]"
              />
              <span
                className="font-display italic shrink-0 w-5 text-center"
                style={{ color: isSelected ? '#ece6d8' : '#8a857a' }}
                aria-hidden
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: '#ece6d8' }}>
                {option.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
