import { useState } from 'react';
import { CreditCard, Plus, MoreVertical, Star, Trash2 } from 'lucide-react';
import { useBilling } from '../../../context/BillingContext';
import { brandLabel } from '../../../utils/formatInvoice';
import { AddPaymentMethodModal } from './AddPaymentMethodModal';

export function PaymentMethodList() {
  const { state, dispatch } = useBilling();
  const [addOpen, setAddOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display tracking-tight text-xl" style={{ color: '#ece6d8' }}>
          Payment methods
        </h3>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          <Plus size={12} aria-hidden /> Add card
        </button>
      </div>

      {state.paymentMethods.length === 0 ? (
        <div
          className="rounded-lg p-8 text-center"
          style={{ border: '1px dashed rgba(236,230,216,0.20)' }}
        >
          <CreditCard size={24} className="mx-auto mb-3" style={{ color: '#8a857a' }} aria-hidden />
          <p className="text-sm" style={{ color: '#b8b3a7' }}>
            No payment methods on file.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {state.paymentMethods.map(m => (
            <li
              key={m.id}
              className="relative flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}
            >
              <CreditCard size={18} aria-hidden style={{ color: '#ece6d8' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: '#ece6d8' }}>
                  {brandLabel(m.brand)} ending in {m.last4}
                </p>
                <p className="text-xs" style={{ color: '#8a857a' }}>
                  {m.holderName} · Expires {String(m.expMonth).padStart(2, '0')}/{String(m.expYear).slice(-2)}
                </p>
              </div>
              {m.isDefault && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}>
                  Default
                </span>
              )}
              <button
                onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                className="rounded p-1.5 hover:opacity-70 transition-opacity"
                aria-label="More options"
                aria-haspopup="menu"
                aria-expanded={openMenu === m.id}
              >
                <MoreVertical size={14} style={{ color: '#b8b3a7' }} />
              </button>
              {openMenu === m.id && (
                <div
                  role="menu"
                  className="absolute right-2 top-12 w-48 rounded-lg shadow-2xl py-1 z-10"
                  style={{ backgroundColor: '#22252b', border: '1px solid rgba(236,230,216,0.15)' }}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {!m.isDefault && (
                    <button
                      role="menuitem"
                      onClick={() => { dispatch({ type: 'SET_DEFAULT_PAYMENT_METHOD', id: m.id }); setOpenMenu(null); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors"
                      style={{ color: '#ece6d8' }}
                    >
                      <Star size={12} aria-hidden /> Set as default
                    </button>
                  )}
                  <button
                    role="menuitem"
                    onClick={() => { dispatch({ type: 'REMOVE_PAYMENT_METHOD', id: m.id }); setOpenMenu(null); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors"
                    style={{ color: '#c5897a' }}
                  >
                    <Trash2 size={12} aria-hidden /> Remove
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <AddPaymentMethodModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
