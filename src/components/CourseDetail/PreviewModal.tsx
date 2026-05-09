import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Lecture } from '../../types/course';

interface Props {
  lecture: Lecture | null;
  onClose: () => void;
}

export function PreviewModal({ lecture, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!lecture) return;
    previousFocus.current = document.activeElement as HTMLElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, video, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => dialogRef.current?.querySelector<HTMLElement>('button, video')?.focus());

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, [lecture, onClose]);

  if (!lecture) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${lecture.title}`}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#15171a' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white truncate">{lecture.title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 -mr-1 focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none rounded"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>
        <video
          src={lecture.videoUrl}
          controls
          autoPlay
          playsInline
          className="w-full aspect-video bg-black"
        />
      </div>
    </div>
  );
}
