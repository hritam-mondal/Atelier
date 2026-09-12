import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Code, Quote, Eye, X } from 'lucide-react';
import { MarkdownPreview } from '../../../utils/renderMarkdown';

interface Props {
  initialBody: string;
  initialTags?: string[];
  onSave: (body: string, tags: string[]) => void;
  onCancel?: () => void;
  autoSaveMs?: number;
}

export function NoteEditor({ initialBody, initialTags = [], onSave, onCancel, autoSaveMs = 800 }: Props) {
  const [body, setBody] = useState(initialBody);
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '));
  const [showPreview, setShowPreview] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

  // Auto-save
  useEffect(() => {
    if (body === initialBody && tagsInput === initialTags.join(', ')) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSave(body, tags), autoSaveMs);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, tagsInput]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const wrap = (before: string, after: string = before) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end);
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);
    queueMicrotask(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    });
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <ToolButton onClick={() => wrap('**')} aria-label="Bold"><Bold size={12} /></ToolButton>
        <ToolButton onClick={() => wrap('*')} aria-label="Italic"><Italic size={12} /></ToolButton>
        <ToolButton onClick={() => wrap('`')} aria-label="Inline code"><Code size={12} /></ToolButton>
        <ToolButton onClick={() => setBody(prev => prev + '\n- ')} aria-label="List"><List size={12} /></ToolButton>
        <ToolButton onClick={() => setBody(prev => prev + '\n> ')} aria-label="Quote"><Quote size={12} /></ToolButton>
        <div className="flex-1" />
        <ToolButton onClick={() => setShowPreview(p => !p)} aria-label={showPreview ? 'Edit' : 'Preview'} active={showPreview}>
          <Eye size={12} />
        </ToolButton>
        {onCancel && (
          <ToolButton onClick={onCancel} aria-label="Cancel">
            <X size={12} />
          </ToolButton>
        )}
      </div>

      {/* Body */}
      {showPreview ? (
        <MarkdownPreview source={body || '*(empty)*'} className="px-3 py-3 text-sm leading-relaxed min-h-[100px]" />
      ) : (
        <textarea
          ref={taRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="What did you learn? Markdown supported."
          className="w-full px-3 py-3 bg-transparent outline-none text-sm leading-relaxed resize-y font-mono"
          style={{ color: '#ece6d8', minHeight: 100 }}
          aria-label="Note body"
        />
      )}

      {/* Tags */}
      <div className="px-3 py-2 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <input
          type="text"
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
          placeholder="tags, comma, separated"
          className="w-full bg-transparent outline-none text-xs"
          style={{ color: '#b8b3a7' }}
          aria-label="Tags"
        />
      </div>
    </div>
  );
}

function ToolButton({ children, active, ...rest }: { children: React.ReactNode; active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className="rounded p-1.5 transition-opacity hover:opacity-80"
      style={{
        backgroundColor: active ? 'rgba(236,230,216,0.12)' : 'transparent',
        color: '#ece6d8',
      }}
    >
      {children}
    </button>
  );
}
