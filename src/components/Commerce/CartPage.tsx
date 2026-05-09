import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartLineItem } from './CartLineItem';
import { SavedForLaterRow } from './SavedForLaterRow';
import { CartSummary } from './CartSummary';
import { CourseCard } from '../Catalog/CourseCard';
import rawCatalog from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';

const allCourses = rawCatalog as CatalogCourse[];

export function CartPage() {
  const { state, resolvedItems } = useCart();

  const items = resolvedItems(allCourses);
  const savedItems = state.savedForLater
    .map(item => {
      const course = allCourses.find(c => c.id === item.courseId);
      return course ? { item, course } : null;
    })
    .filter((x): x is { item: typeof state.savedForLater[number]; course: CatalogCourse } => x !== null);

  const enrolledIds = new Set([...state.items, ...state.savedForLater].map(i => i.courseId));
  const recommendations = allCourses
    .filter(c => !enrolledIds.has(c.id))
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 4);

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div
          className="inline-flex w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}
          aria-hidden
        >
          <ShoppingBag size={32} style={{ color: '#ece6d8' }} />
        </div>
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; Empty cart
        </p>
        <h1 className="font-display text-4xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
          Your cart is <span className="italic font-light" style={{ color: '#b8b3a7' }}>empty</span>.
        </h1>
        <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: '#b8b3a7' }}>
          Browse the catalog and add a few courses you've been meaning to start.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Browse the catalog <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
        ✦ &nbsp; Cart
      </p>
      <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-8" style={{ color: '#ece6d8' }}>
        {items.length} course{items.length === 1 ? '' : 's'} in your cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-10">
        {/* Items list */}
        <div className="min-w-0">
          {items.length > 0 ? (
            <div>
              {items.map(({ item, course }) => (
                <CartLineItem key={course.id} item={item} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-sm py-6" style={{ color: '#b8b3a7' }}>
              Your cart is empty. Items below were saved for later.
            </p>
          )}

          {/* Saved for later */}
          {savedItems.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display tracking-tight text-2xl mb-4" style={{ color: '#ece6d8' }}>
                Saved for later <span style={{ color: '#8a857a' }}>({savedItems.length})</span>
              </h2>
              <div>
                {savedItems.map(({ item, course }) => (
                  <SavedForLaterRow key={course.id} item={item} course={course} />
                ))}
              </div>
            </section>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section className="mt-14">
              <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
                ✦ &nbsp; You may also like
              </p>
              <h2 className="font-display tracking-tight text-2xl mb-5" style={{ color: '#ece6d8' }}>
                Popular this week
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {recommendations.map(course => (
                  <CourseCard key={course.id} course={course} view="grid" />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right rail */}
        {items.length > 0 && (
          <div>
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
