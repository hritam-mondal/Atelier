import { useState } from 'react';
import { CalendarClock, AlertCircle, X } from 'lucide-react';
import { useBilling } from '../../../context/BillingContext';
import { formatMoney, formatInvoiceDate } from '../../../utils/formatInvoice';
import type { Subscription } from '../../../types/commerce';

const REASONS = [
  'Too expensive',
  'I finished what I came to learn',
  'Not enough content in my area',
  'Quality not what I expected',
  'Switching to another platform',
  'Just taking a break',
  'Other',
];

export function SubscriptionCard() {
  const { state, dispatch } = useBilling();
  const sub = state.subscription;
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState('');

  if (!sub) {
    return (
      <div
        className="rounded-xl p-6"
        style={{
          border: '1px solid rgba(236,230,216,0.10)',
          backgroundColor: 'rgba(236,230,216,0.04)',
        }}
      >
        <h3 className="font-display tracking-tight text-lg mb-2" style={{ color: '#ece6d8' }}>
          No active subscription
        </h3>
        <p className="text-sm mb-4" style={{ color: '#b8b3a7' }}>
          Get unlimited access to every course on Atelier.
        </p>
        <button
          onClick={() => dispatch({ type: 'UPDATE_SUBSCRIPTION', subscription: { id: `sub_${Date.now()}`, plan: 'monthly', status: 'active', currentPeriodEnd: new Date(Date.now() + 30 * 86_400_000).toISOString(), cancelAtPeriodEnd: false, pricePerPeriod: 24 } })}
          className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Start membership
        </button>
      </div>
    );
  }

  const planLabel = sub.plan === 'monthly' ? 'Monthly' : sub.plan === 'annual' ? 'Annual' : 'Team';
  const statusColor = sub.status === 'active' ? '#a8c08a' : sub.status === 'paused' ? '#d8c594' : '#c5897a';

  const cancelNow = () => {
    dispatch({
      type: 'UPDATE_SUBSCRIPTION',
      subscription: { ...sub, cancelAtPeriodEnd: true } as Subscription,
    });
    setCancelOpen(false);
    setReason('');
  };

  const resume = () => {
    dispatch({ type: 'UPDATE_SUBSCRIPTION', subscription: { ...sub, cancelAtPeriodEnd: false } });
  };

  const togglePause = () => {
    dispatch({
      type: 'UPDATE_SUBSCRIPTION',
      subscription: { ...sub, status: sub.status === 'paused' ? 'active' : 'paused' } as Subscription,
    });
  };

  return (
    <>
      <div
        className="rounded-xl p-6"
        style={{
          border: '1px solid rgba(236,230,216,0.10)',
          backgroundColor: 'rgba(236,230,216,0.04)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: '#b8b3a7' }}>Membership</p>
            <h3 className="font-display tracking-tight text-2xl" style={{ color: '#ece6d8' }}>
              {planLabel} plan
            </h3>
          </div>
          <span
            className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ backgroundColor: `${statusColor}1a`, color: statusColor, border: `1px solid ${statusColor}66` }}
          >
            {sub.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs mb-1" style={{ color: '#8a857a' }}>Price</p>
            <p className="font-display text-lg" style={{ color: '#ece6d8' }}>
              {formatMoney(sub.pricePerPeriod)} <span className="text-xs" style={{ color: '#b8b3a7' }}>/ {sub.plan === 'annual' ? 'year' : 'month'}</span>
            </p>
          </div>
          <div>
            <p className="text-xs mb-1 flex items-center gap-1" style={{ color: '#8a857a' }}>
              <CalendarClock size={11} aria-hidden /> {sub.cancelAtPeriodEnd ? 'Ends on' : 'Renews on'}
            </p>
            <p className="font-display text-lg" style={{ color: '#ece6d8' }}>
              {formatInvoiceDate(sub.currentPeriodEnd)}
            </p>
          </div>
        </div>

        {sub.cancelAtPeriodEnd && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg mb-5 text-xs"
            style={{ backgroundColor: 'rgba(216,197,148,0.08)', border: '1px solid rgba(216,197,148,0.30)', color: '#d8c594' }}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden />
            <span>
              Your membership ends on {formatInvoiceDate(sub.currentPeriodEnd)}. You'll keep access until then.{' '}
              <button onClick={resume} className="underline hover:opacity-70">Resume now</button>
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
          >
            Switch plan
          </button>
          <button
            onClick={togglePause}
            className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
          >
            {sub.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          {!sub.cancelAtPeriodEnd && (
            <button
              onClick={() => setCancelOpen(true)}
              className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#c5897a' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {cancelOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setCancelOpen(false)} aria-hidden />
          <div
            className="relative w-full max-w-md rounded-xl shadow-2xl"
            style={{ backgroundColor: '#1d2025', border: '1px solid rgba(236,230,216,0.20)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
              <h2 className="font-display text-lg" style={{ color: '#ece6d8' }}>Why are you leaving?</h2>
              <button onClick={() => setCancelOpen(false)} aria-label="Close" className="rounded p-1 hover:opacity-70 transition-opacity">
                <X size={18} style={{ color: '#b8b3a7' }} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm mb-4" style={{ color: '#b8b3a7' }}>
                We're sorry to see you go. Help us improve.
              </p>
              <div className="space-y-2 mb-5">
                {REASONS.map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cancel-reason"
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-[#ece6d8]"
                    />
                    <span className="text-sm" style={{ color: '#ece6d8' }}>{r}</span>
                  </label>
                ))}
              </div>
              <p className="text-[11px]" style={{ color: '#8a857a' }}>
                Your access continues until {formatInvoiceDate(sub.currentPeriodEnd)}.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
              <button
                onClick={() => setCancelOpen(false)}
                className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#b8b3a7' }}
              >
                Never mind
              </button>
              <button
                onClick={cancelNow}
                disabled={!reason}
                className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#c5897a', color: '#15171a' }}
              >
                Cancel membership
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
