import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';

const QUALITIES = ['Auto', '1080p', '720p', '480p', '360p'];

interface QualitySelectorProps {
  currentQuality?: string;
  onQualityChange?: (q: string) => void;
}

export function QualitySelector({ currentQuality = 'Auto', onQualityChange }: QualitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [quality, setQuality] = useState(currentQuality);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const select = (q: string) => {
    setQuality(q);
    onQualityChange?.(q);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none transition-colors"
        aria-label={`Video quality: ${quality}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Settings size={18} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Video quality"
          className="absolute bottom-full mb-1 right-0 bg-gray-900 border border-gray-700 rounded shadow-xl z-50 min-w-[90px] overflow-hidden"
        >
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-700">Quality</div>
          {QUALITIES.map((q) => (
            <button
              key={q}
              role="option"
              aria-selected={quality === q}
              onClick={() => select(q)}
              className={`
                w-full text-left px-3 py-1.5 text-sm transition-colors
                ${quality === q
                  ? 'bg-violet-700 text-white font-semibold'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'}
              `}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
