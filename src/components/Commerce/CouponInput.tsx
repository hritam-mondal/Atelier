import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatMoney } from '../../utils/formatInvoice';

export function CouponInput() {
  const { state, dispatch, applyCouponCode } = useCart();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    if (!code.trim()) return;
    setError(null);
    const result = applyCouponCode(code);
    if (!result.ok) {
      setError(result.reason);
    } else {
      setCode('');
    }
  };

  if (state.appliedCoupon) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-[rgba(143,168,116,0.4)] bg-[rgba(143,168,116,0.08)]">
        <span className="flex items-center gap-2 text-xs">
          <Check size={12} className="text-emerald-400" aria-hidden />
          <span className="font-mono font-semibold tracking-wider" style={{ color: '#ece6d8' }}>
            {state.appliedCoupon.code}
          </span>
          <span style={{ color: '#b8b3a7' }}>−{formatMoney(state.appliedCoupon.amount)}</span>
        </span>
        <button
          onClick={() => dispatch({ type: 'REMOVE_COUPON' })}
          className="p-1 rounded hover:opacity-70 transition-opacity"
          aria-label="Remove coupon"
        >
          <X size={12} style={{ color: '#b8b3a7' }} />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity"
        style={{ color: '#ece6d8' }}
      >
        <Tag size={12} aria-hidden /> Apply coupon
      </button>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(null); }}
          onKeyDown={e => { if (e.key === 'Enter') apply(); }}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono tracking-wider outline-none"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(236,230,216,0.20)',
            color: '#ece6d8',
          }}
          autoFocus
          aria-label="Coupon code"
        />
        <button
          onClick={apply}
          className="px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Apply
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      {!error && (
        <p className="mt-2 text-[11px]" style={{ color: '#8a857a' }}>
          Try <span className="font-mono">WELCOME10</span> or <span className="font-mono">SPRING25</span>
        </p>
      )}
    </div>
  );
}
