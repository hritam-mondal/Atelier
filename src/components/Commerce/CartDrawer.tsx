import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatMoney } from '../../utils/formatInvoice';
import rawCatalog from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';

const allCourses = rawCatalog as CatalogCourse[];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { dispatch, totals, resolvedItems } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const items = resolvedItems(allCourses);
  const t = totals();

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label="Cart"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="absolute right-0 top-0 bottom-0 w-full max-w-md flex flex-col shadow-2xl"
        style={{ backgroundColor: '#15171a', borderLeft: '1px solid rgba(236,230,216,0.10)' }}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
          <h2 className="font-display text-xl tracking-tight" style={{ color: '#ece6d8' }}>
            Your cart <span style={{ color: '#8a857a' }}>· {items.length}</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 hover:opacity-70 transition-opacity"
          >
            <X size={18} style={{ color: '#b8b3a7' }} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}>
              <ShoppingBag size={26} style={{ color: '#ece6d8' }} />
            </div>
            <p className="font-display text-2xl mb-2 italic" style={{ color: '#ece6d8' }}>
              Nothing here yet.
            </p>
            <p className="text-sm mb-6" style={{ color: '#b8b3a7' }}>
              Add a course from the catalog to get started.
            </p>
            <Link
              to="/catalog"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              Browse catalog <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {items.map(({ item, course }) => (
                <div key={course.id} className="flex gap-3 py-4 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
                  <div className="shrink-0 w-20 aspect-video rounded overflow-hidden bg-black">
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug truncate" style={{ color: '#ece6d8' }}>{course.title}</p>
                    <p className="text-xs" style={{ color: '#8a857a' }}>{course.instructor.name}</p>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE', courseId: course.id })}
                      className="mt-1 text-[11px] hover:opacity-70 transition-opacity"
                      style={{ color: '#b8b3a7' }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="shrink-0 text-sm tabular-nums" style={{ color: '#ece6d8' }}>
                    {formatMoney(item.discountPriceAtAdd ?? item.priceAtAdd)}
                  </div>
                </div>
              ))}
            </div>

            <footer className="px-5 py-4 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm" style={{ color: '#b8b3a7' }}>Subtotal</span>
                <span className="font-display text-xl" style={{ color: '#ece6d8' }}>
                  {formatMoney(t.subtotal - t.itemDiscount)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="py-2.5 rounded-full text-sm font-medium text-center hover:opacity-80 transition-opacity"
                  style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
                >
                  View cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="py-2.5 rounded-full text-sm font-medium text-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
                >
                  Checkout
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
