import { useState, useRef, useEffect } from 'react';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

interface SpeedSelectorProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export function SpeedSelector({ currentSpeed, onSpeedChange }: SpeedSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-2 py-1 rounded text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none transition-colors"
        aria-label={`Playback speed: ${currentSpeed}x`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {currentSpeed === 1 ? 'Speed' : `${currentSpeed}x`}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Playback speed"
          className="absolute bottom-full mb-1 right-0 bg-gray-900 border border-gray-700 rounded shadow-xl z-50 min-w-[80px] overflow-hidden"
        >
          {SPEEDS.map((speed) => (
            <button
              key={speed}
              role="option"
              aria-selected={currentSpeed === speed}
              onClick={() => { onSpeedChange(speed); setOpen(false); }}
              className={`
                w-full text-left px-3 py-1.5 text-sm transition-colors
                ${currentSpeed === speed
                  ? 'bg-violet-700 text-white font-semibold'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'}
              `}
            >
              {speed === 1 ? 'Normal' : `${speed}x`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
