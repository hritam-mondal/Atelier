import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CouponInput } from './CouponInput';
import { formatMoney } from '../../utils/formatInvoice';

interface Props {
  state?: string;
  showCheckout?: boolean;
}

export function CartSummary({ state = 'NY', showCheckout = true }: Props) {
  const { state: cart, totals } = useCart();
  const t = totals(state);

  if (cart.items.length === 0) return null;

  return (
    <aside
      className="rounded-xl p-6 sticky top-24"
      style={{
        backgroundColor: 'rgba(236,230,216,0.04)',
        border: '1px solid rgba(236,230,216,0.10)',
      }}
      aria-label="Order summary"
    >
      <h2 className="font-display tracking-tight text-xl mb-4" style={{ color: '#ece6d8' }}>
        Order summary
      </h2>

      <div className="space-y-3 text-sm" style={{ color: '#b8b3a7' }}>
        <Row label={`Subtotal (${t.itemCount} ${t.itemCount === 1 ? 'item' : 'items'})`} value={formatMoney(t.subtotal)} />
        {t.itemDiscount > 0 && (
          <Row label="Course discounts" value={`−${formatMoney(t.itemDiscount)}`} accent />
        )}
        {t.couponDiscount > 0 && (
          <Row label={`Coupon ${cart.appliedCoupon?.code}`} value={`−${formatMoney(t.couponDiscount)}`} accent />
        )}
        <Row label={`Tax (${state})`} value={formatMoney(t.tax)} />
        <div className="h-px my-3" style={{ backgroundColor: 'rgba(236,230,216,0.10)' }} />
        <div className="flex items-center justify-between">
          <span className="font-display text-base" style={{ color: '#ece6d8' }}>Total</span>
          <span className="font-display text-2xl" style={{ color: '#ece6d8' }}>{formatMoney(t.total)}</span>
        </div>
      </div>

      <div className="mt-5">
        <CouponInput />
      </div>

      {showCheckout && (
        <Link
          to="/checkout"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Proceed to checkout <ArrowRight size={14} aria-hidden />
        </Link>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: '#8a857a' }}>
        <Lock size={10} aria-hidden /> 30-day money-back guarantee
      </div>
    </aside>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="tabular-nums" style={{ color: accent ? '#a8c08a' : '#ece6d8' }}>{value}</span>
    </div>
  );
}
