import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const PRESETS = [60, 120, 180, 300];

interface Props {
  open: boolean;
  initialValue: number;
  onClose: () => void;
  onSave: (minutes: number) => void;
}

export function GoalEditor({ open, initialValue, onClose, onSave }: Props) {
  const [value, setValue] = useState(initialValue);
  const [custom, setCustom] = useState<string>('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setValue(initialValue);
    setCustom('');
    previousFocus.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button, input');
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => dialogRef.current?.querySelector<HTMLElement>('button, input')?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, [open, initialValue, onClose]);

  if (!open) return null;

  const save = () => {
    const finalValue = custom.trim() ? Math.max(15, Math.min(2000, parseInt(custom, 10) || value)) : value;
    onSave(finalValue);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit weekly goal">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-xl border border-white/10 shadow-2xl"
        style={{ backgroundColor: '#22252b' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-base font-semibold text-white">Set your weekly goal</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-400 mb-4">
            Pick a target you'll feel great about hitting. You can change it any time.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRESETS.map(min => (
              <button
                key={min}
                onClick={() => { setValue(min); setCustom(''); }}
                className={`py-3 rounded-lg border text-sm font-semibold transition-colors
                  ${value === min && !custom
                    ? 'border-violet-500 bg-violet-500/15 text-violet-200'
                    : 'border-white/15 text-slate-200 hover:border-white/30 hover:bg-white/5'}`}
              >
                {min} min / week
              </button>
            ))}
          </div>
          <label className="block text-xs text-slate-400 mb-1.5">Custom target</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="15"
              max="2000"
              placeholder="e.g. 240"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 border border-white/15 focus:border-violet-500 focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            />
            <span className="text-sm text-slate-400">min / week</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            Save goal
          </button>
        </div>
      </div>
    </div>
  );
}
