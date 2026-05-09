import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../../types/courseDetail';

interface Props {
  items: FAQItem[];
}

export function FAQSection({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-4">Frequently asked questions</h2>
      <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10">
        {items.map((item, i) => (
          <FAQRow
            key={i}
            item={item}
            open={openIndex === i}
            onToggle={() => setOpenIndex(prev => (prev === i ? null : i))}
            id={`faq-${i}`}
          />
        ))}
      </div>
    </section>
  );
}

function FAQRow({ item, open, onToggle, id }: { item: FAQItem; open: boolean; onToggle: () => void; id: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (open && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [open]);

  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
        aria-expanded={open}
        aria-controls={`${id}-content`}
      >
        <span className="text-sm font-semibold text-white">{item.question}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      <div
        id={`${id}-content`}
        role="region"
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="px-5 pb-4 text-sm text-slate-300 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}
