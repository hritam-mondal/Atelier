import { useState } from 'react';
import { Play, CheckCircle2, XCircle } from 'lucide-react';
import type { CodeQuestion as CodeQuestionType } from '../../types/assessment';
import { MarkdownPreview } from '../../utils/renderMarkdown';
import { runCodeTests } from '../../hooks/useQuiz';

interface Props {
  question: CodeQuestionType;
  answer: { code: string; passed?: boolean } | undefined;
  onChange: (next: { code: string; passed?: boolean }) => void;
}

interface TestResult {
  label: string;
  pass: boolean;
  got?: unknown;
  expected: unknown;
  error?: string;
}

export function CodeQuestion({ question, answer, onChange }: Props) {
  const [code, setCode] = useState(answer?.code ?? question.starterCode);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [running, setRunning] = useState(false);

  const onRun = () => {
    setRunning(true);
    setTimeout(() => {
      const r = runCodeTests(question, code);
      setResults(r.results);
      onChange({ code, passed: r.passed });
      setRunning(false);
    }, 250);
  };

  const onCodeChange = (next: string) => {
    setCode(next);
    onChange({ code: next, passed: answer?.passed });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5">
      {/* Prompt + tests */}
      <div>
        <MarkdownPreview source={question.prompt} className="font-display text-xl leading-snug mb-1" />
        <p className="text-xs uppercase tracking-wider mb-5" style={{ color: '#8a857a' }}>
          Coding exercise · {question.points} {question.points === 1 ? 'point' : 'points'}
        </p>
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(236,230,216,0.10)' }}>
          <div className="px-3 py-2 text-[11px] tracking-[0.18em] uppercase border-b" style={{ borderColor: 'rgba(236,230,216,0.10)', color: '#b8b3a7' }}>
            Test cases
          </div>
          <ul className="divide-y" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
            {(results ?? question.testCases.map(tc => ({ label: tc.label ?? JSON.stringify(tc.input), pass: false, expected: tc.expected, got: undefined, error: undefined } as TestResult))).map((r, i) => {
              const isPending = !results;
              return (
                <li key={i} className="px-3 py-2 flex items-start gap-2 text-xs" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
                  {isPending ? (
                    <span className="w-4 h-4 rounded-full mt-0.5 shrink-0" style={{ border: '1px dashed rgba(236,230,216,0.25)' }} aria-hidden />
                  ) : r.pass ? (
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: '#a8c08a' }} aria-hidden />
                  ) : (
                    <XCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#c5897a' }} aria-hidden />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono" style={{ color: '#ece6d8' }}>{r.label}</p>
                    {!isPending && !r.pass && (
                      <p className="text-[11px] mt-0.5" style={{ color: '#b8b3a7' }}>
                        {r.error ? `Error: ${r.error}` : `Got ${JSON.stringify(r.got)}, expected ${JSON.stringify(r.expected)}`}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: '#b8b3a7' }}>
            JavaScript
          </p>
          <button
            onClick={onRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            <Play size={11} aria-hidden /> {running ? 'Running…' : 'Run tests'}
          </button>
        </div>
        <textarea
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          rows={14}
          spellCheck={false}
          className="w-full px-3 py-3 rounded-lg outline-none text-sm font-mono leading-relaxed resize-y"
          style={{
            backgroundColor: 'rgba(0,0,0,0.30)',
            border: '1px solid rgba(236,230,216,0.10)',
            color: '#ece6d8',
            tabSize: 2,
          }}
          aria-label="Code editor"
        />
        {answer?.passed && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs" style={{ color: '#a8c08a' }}>
            <CheckCircle2 size={11} aria-hidden /> All tests passing.
          </p>
        )}
      </div>
    </div>
  );
}
