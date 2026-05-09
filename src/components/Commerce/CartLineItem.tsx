import { useState } from 'react';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../../types/commerce';
import type { CatalogCourse } from '../../types/catalog';
import { useCart } from '../../context/CartContext';
import { StarRating } from '../shared/StarRating';
import { formatMoney } from '../../utils/formatInvoice';

interface Props {
  item: CartItem;
  course: CatalogCourse;
}

export function CartLineItem({ item, course }: Props) {
  const { dispatch } = useCart();
  const [removed, setRemoved] = useState(false);

  if (removed) {
    return (
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg"
        style={{ backgroundColor: 'rgba(236,230,216,0.04)', border: '1px dashed rgba(236,230,216,0.20)' }}
      >
        <span className="text-sm" style={{ color: '#b8b3a7' }}>
          Removed "{course.title.length > 36 ? course.title.slice(0, 34) + '…' : course.title}"
        </span>
        <button
          onClick={() => setRemoved(false)}
          className="inline-flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity"
          style={{ color: '#ece6d8' }}
        >
          <ArrowLeft size={11} aria-hidden /> Undo
        </button>
      </div>
    );
  }

  const remove = () => {
    setRemoved(true);
    setTimeout(() => {
      dispatch({ type: 'REMOVE', courseId: item.courseId });
    }, 4000);
  };

  const moveToSaved = () => dispatch({ type: 'MOVE_TO_SAVED', courseId: item.courseId });

  const effective = item.discountPriceAtAdd ?? item.priceAtAdd;
  const hasDiscount = item.discountPriceAtAdd !== undefined && item.discountPriceAtAdd < item.priceAtAdd;

  return (
    <div
      className="flex gap-4 py-5 border-b"
      style={{ borderColor: 'rgba(236,230,216,0.10)' }}
    >
      <Link
        to="/course"
        className="shrink-0 w-32 sm:w-44 aspect-video rounded-md overflow-hidden bg-black"
      >
        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to="/course">
          <h3 className="font-display text-base lg:text-lg leading-snug truncate hover:opacity-70 transition-opacity" style={{ color: '#ece6d8' }}>
            {course.title}
          </h3>
        </Link>
        <p className="text-xs mb-1" style={{ color: '#8a857a' }}>By {course.instructor.name}</p>
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={course.rating} reviewCount={course.reviewCount} size={11} />
        </div>
        <div className="flex items-center gap-3 flex-wrap text-[11px]" style={{ color: '#b8b3a7' }}>
          <span className="capitalize">{course.level}</span>
          <span>·</span>
          <span>{course.lectureCount} lectures</span>
          <span>·</span>
          <span>{Math.round(course.totalDuration / 3600)}h total</span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs">
          <button
            onClick={moveToSaved}
            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#ece6d8' }}
          >
            <Heart size={11} aria-hidden /> Save for later
          </button>
          <span style={{ color: '#8a857a' }}>·</span>
          <button
            onClick={remove}
            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#ece6d8' }}
          >
            <Trash2 size={11} aria-hidden /> Remove
          </button>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="font-display text-lg" style={{ color: '#ece6d8' }}>
          {formatMoney(effective)}
        </div>
        {hasDiscount && (
          <div className="text-xs line-through" style={{ color: '#8a857a' }}>
            {formatMoney(item.priceAtAdd)}
          </div>
        )}
      </div>
    </div>
  );
}
