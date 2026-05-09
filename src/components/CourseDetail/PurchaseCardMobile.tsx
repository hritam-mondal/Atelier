import { useEffect, useState } from 'react';
import { ChevronUp, X } from 'lucide-react';
import { PriceTag } from '../shared/PriceTag';
import { PurchaseCard } from './PurchaseCard';
import type { CourseDetail } from '../../types/courseDetail';

interface Props {
  course: CourseDetail;
}

export function PurchaseCardMobile({ course }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Bottom bar */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: 'rgba(21,23,26,0.96)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex-1 min-w-0">
          <PriceTag price={course.price} discountPrice={course.discountPrice} size="md" />
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 mt-0.5 text-xs text-violet-400 hover:text-violet-300"
          >
            View details <ChevronUp size={12} />
          </button>
        </div>
        <button
          className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
        >
          Add to Cart
        </button>
      </div>

      {/* Slide-up sheet */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col" role="dialog" aria-modal="true" aria-label="Course details">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-hidden />
          <div className="relative mt-auto rounded-t-2xl overflow-hidden max-h-[85vh] flex flex-col" style={{ backgroundColor: '#15171a' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <span className="text-sm font-semibold text-white">Course details</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <PurchaseCard course={course} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
