import { useState } from 'react';
import { X } from 'lucide-react';
import { PaymentMethodForm, type PaymentDraft } from '../../Commerce/PaymentMethodForm';
import { useBilling } from '../../../context/BillingContext';
import type { PaymentMethod } from '../../../types/commerce';

interface Props {
  open: boolean;
  onClose: () => void;
}

const BLANK: PaymentDraft = { number: '', expMonth: 0, expYear: 0, cvc: '', zip: '', holderName: '', brand: 'unknown' };

export function AddPaymentMethodModal({ open, onClose }: Props) {
  const { dispatch, state } = useBilling();
  const [draft, setDraft] = useState<PaymentDraft>(BLANK);
  const [setDefault, setSetDefault] = useState(state.paymentMethods.length === 0);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.number.length < 13 || !draft.expMonth || !draft.expYear || draft.cvc.length < 3 || !draft.holderName) return;
    const method: PaymentMethod = {
      id: `pm_${Date.now()}`,
      brand: draft.brand === 'unknown' ? 'visa' : draft.brand,
      last4: draft.number.slice(-4),
      expMonth: draft.expMonth,
      expYear: draft.expYear,
      isDefault: setDefault,
      holderName: draft.holderName,
    };
    dispatch({ type: 'ADD_PAYMENT_METHOD', method });
    setDraft(BLANK);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add payment method"
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose} aria-hidden />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-xl shadow-2xl"
        style={{ backgroundColor: '#1d2025', border: '1px solid rgba(236,230,216,0.20)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
          <h2 className="font-display text-lg" style={{ color: '#ece6d8' }}>Add payment method</h2>
          <button onClick={onClose} type="button" aria-label="Close" className="rounded p-1 hover:opacity-70 transition-opacity">
            <X size={18} style={{ color: '#b8b3a7' }} />
          </button>
        </div>
        <div className="p-5">
          <PaymentMethodForm value={draft} onChange={setDraft} />
          <label className="mt-3 flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={setDefault} onChange={e => setSetDefault(e.target.checked)} className="accent-[#ece6d8]" />
            <span className="text-xs" style={{ color: '#b8b3a7' }}>Set as default payment method</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#b8b3a7' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            Add card
          </button>
        </div>
      </form>
    </div>
  );
}
