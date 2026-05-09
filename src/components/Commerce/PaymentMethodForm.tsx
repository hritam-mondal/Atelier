import { useState, useEffect } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import type { CardBrand } from '../../types/commerce';

export interface PaymentDraft {
  number: string;          // raw digits
  expMonth: number;
  expYear: number;
  cvc: string;
  zip: string;
  holderName: string;
  brand: CardBrand;
}

interface Props {
  value: PaymentDraft;
  onChange: (next: PaymentDraft) => void;
  errors?: Partial<Record<keyof PaymentDraft, string>>;
}

function detectBrand(rawDigits: string): CardBrand {
  if (/^4/.test(rawDigits)) return 'visa';
  if (/^5[1-5]/.test(rawDigits) || /^2[2-7]/.test(rawDigits)) return 'mastercard';
  if (/^3[47]/.test(rawDigits)) return 'amex';
  if (/^6(?:011|5)/.test(rawDigits)) return 'discover';
  return 'unknown';
}

function formatCardNumber(digits: string, brand: CardBrand): string {
  const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4];
  let result = '';
  let cursor = 0;
  for (const size of groups) {
    if (cursor >= digits.length) break;
    if (cursor > 0) result += ' ';
    result += digits.slice(cursor, cursor + size);
    cursor += size;
  }
  return result;
}

function formatExpiry(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function PaymentMethodForm({ value, onChange, errors = {} }: Props) {
  const [displayNumber, setDisplayNumber] = useState(formatCardNumber(value.number, value.brand));
  const [displayExp, setDisplayExp] = useState(value.expMonth ? `${String(value.expMonth).padStart(2, '0')}/${String(value.expYear).slice(-2)}` : '');

  useEffect(() => {
    setDisplayNumber(formatCardNumber(value.number, value.brand));
  }, [value.number, value.brand]);

  const handleNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    const brand = detectBrand(digits);
    onChange({ ...value, number: digits, brand });
    setDisplayNumber(formatCardNumber(digits, brand));
  };

  const handleExp = (raw: string) => {
    const formatted = formatExpiry(raw);
    setDisplayExp(formatted);
    const [m, y] = formatted.split('/');
    const expMonth = m ? parseInt(m, 10) : 0;
    const expYear = y ? 2000 + parseInt(y, 10) : 0;
    onChange({ ...value, expMonth, expYear });
  };

  const brandIconColor = {
    visa: '#1a1f71',
    mastercard: '#eb001b',
    amex: '#006fcf',
    discover: '#ff6000',
    unknown: '#b8b3a7',
  }[value.brand];

  return (
    <div className="space-y-3">
      <Field label="Cardholder name" error={errors.holderName}>
        <input
          type="text"
          value={value.holderName}
          onChange={e => onChange({ ...value, holderName: e.target.value })}
          autoComplete="cc-name"
          placeholder="Name on card"
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: '#ece6d8' }}
        />
      </Field>

      <Field label="Card number" error={errors.number}>
        <span className="flex items-center gap-2 w-full">
          <CreditCard size={14} aria-hidden style={{ color: brandIconColor }} />
          <input
            type="text"
            inputMode="numeric"
            value={displayNumber}
            onChange={e => handleNumber(e.target.value)}
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            className="flex-1 bg-transparent outline-none text-sm font-mono tracking-wider"
            style={{ color: '#ece6d8' }}
            aria-label="Card number"
          />
          {value.brand !== 'unknown' && (
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}
              aria-live="polite"
            >
              {value.brand}
            </span>
          )}
        </span>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry" error={errors.expMonth}>
          <input
            type="text"
            inputMode="numeric"
            value={displayExp}
            onChange={e => handleExp(e.target.value)}
            autoComplete="cc-exp"
            placeholder="MM/YY"
            className="w-full bg-transparent outline-none text-sm font-mono tracking-wider"
            style={{ color: '#ece6d8' }}
            aria-label="Expiry"
          />
        </Field>
        <Field label="CVC" error={errors.cvc}>
          <span className="flex items-center gap-2 w-full">
            <Lock size={12} aria-hidden style={{ color: '#8a857a' }} />
            <input
              type="text"
              inputMode="numeric"
              value={value.cvc}
              onChange={e => onChange({ ...value, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              autoComplete="cc-csc"
              placeholder={value.brand === 'amex' ? '4 digits' : '3 digits'}
              maxLength={4}
              className="flex-1 bg-transparent outline-none text-sm font-mono tracking-wider"
              style={{ color: '#ece6d8' }}
              aria-label="CVC"
            />
          </span>
        </Field>
      </div>

      <Field label="ZIP / Postal code" error={errors.zip}>
        <input
          type="text"
          value={value.zip}
          onChange={e => onChange({ ...value, zip: e.target.value.slice(0, 10) })}
          autoComplete="postal-code"
          placeholder="11206"
          className="w-full bg-transparent outline-none text-sm font-mono"
          style={{ color: '#ece6d8' }}
        />
      </Field>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b8b3a7' }}>
        {label}
      </label>
      <div
        className="px-4 py-3 rounded-lg transition-colors focus-within:border-[rgba(236,230,216,0.5)]"
        style={{
          border: error ? '1px solid #c5897a' : '1px solid rgba(236,230,216,0.20)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        {children}
      </div>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
}
