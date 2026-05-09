import { Link } from 'react-router-dom';
import type { CartItem } from '../../types/commerce';
import type { CatalogCourse } from '../../types/catalog';
import { useCart } from '../../context/CartContext';
import { formatMoney } from '../../utils/formatInvoice';

interface Props {
  item: CartItem;
  course: CatalogCourse;
}

export function SavedForLaterRow({ item, course }: Props) {
  const { dispatch } = useCart();

  return (
    <div
      className="flex items-center gap-3 py-3 border-b"
      style={{ borderColor: 'rgba(236,230,216,0.10)' }}
    >
      <Link to="/course" className="shrink-0 w-16 aspect-video rounded overflow-hidden bg-black">
        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to="/course">
          <p className="text-sm truncate hover:opacity-70 transition-opacity" style={{ color: '#ece6d8' }}>
            {course.title}
          </p>
        </Link>
        <p className="text-xs" style={{ color: '#8a857a' }}>By {course.instructor.name}</p>
      </div>
      <div className="text-sm shrink-0" style={{ color: '#b8b3a7' }}>
        {formatMoney(item.discountPriceAtAdd ?? item.priceAtAdd)}
      </div>
      <button
        onClick={() => dispatch({ type: 'MOVE_TO_CART', courseId: item.courseId })}
        className="px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity shrink-0"
        style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
      >
        Move to cart
      </button>
    </div>
  );
}
