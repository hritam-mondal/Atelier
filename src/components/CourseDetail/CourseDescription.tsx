import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  text: string;
  collapsedHeight?: number;
}

export function CourseDescription({ text, collapsedHeight = 280 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  return (
    <section>
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-4">Description</h2>
      <div
        className="relative overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: expanded ? '4000px' : `${collapsedHeight}px` }}
      >
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {!expanded && (
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent 0%, #15171a 100%)' }}
            aria-hidden
          />
        )}
      </div>
      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:text-violet-200"
        aria-expanded={expanded}
      >
        {expanded ? (<>Show less <ChevronUp size={14} /></>) : (<>Show more <ChevronDown size={14} /></>)}
      </button>
    </section>
  );
}
