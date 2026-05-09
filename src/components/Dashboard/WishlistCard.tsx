import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MoreVertical, Trash2 } from 'lucide-react';
import type { CatalogCourse } from '../../types/catalog';
import { useUser } from '../../context/UserContext';
import { CourseCard } from '../Catalog/CourseCard';

interface Props {
  course: CatalogCourse;
}

export function WishlistCard({ course }: Props) {
  const { dispatch } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  return (
    <div ref={ref} className="relative">
      <CourseCard course={course} view="grid" />
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          aria-label="Wishlist options"
          aria-expanded={menuOpen}
        >
          <MoreVertical size={14} aria-hidden />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-9 w-48 rounded-lg border border-white/10 shadow-2xl py-1"
            style={{ backgroundColor: '#22252b' }}
          >
            <button
              role="menuitem"
              onClick={() => { dispatch({ type: 'MOVE_TO_CART', courseId: course.id }); setMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-200 hover:bg-white/5 transition-colors"
            >
              <ShoppingCart size={13} aria-hidden /> Move to cart
            </button>
            <Link
              role="menuitem"
              to="/course"
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-200 hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              View course
            </Link>
            <button
              role="menuitem"
              onClick={() => { dispatch({ type: 'REMOVE_WISHLIST', courseId: course.id }); setMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={13} aria-hidden /> Remove from wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
