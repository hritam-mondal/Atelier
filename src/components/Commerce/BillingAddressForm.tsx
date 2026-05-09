import type { Address } from '../../types/commerce';

interface Props {
  value: Address;
  onChange: (next: Address) => void;
  errors?: Partial<Record<keyof Address, string>>;
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
  'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA',
  'RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

export function BillingAddressForm({ value, onChange, errors = {} }: Props) {
  return (
    <div className="space-y-3">
      <Field label="Address line 1" error={errors.line1}>
        <input
          type="text"
          value={value.line1}
          onChange={e => onChange({ ...value, line1: e.target.value })}
          autoComplete="address-line1"
          placeholder="247 Hooper Street"
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: '#ece6d8' }}
        />
      </Field>
      <Field label="Address line 2 (optional)">
        <input
          type="text"
          value={value.line2 ?? ''}
          onChange={e => onChange({ ...value, line2: e.target.value })}
          autoComplete="address-line2"
          placeholder="Apt 4B"
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: '#ece6d8' }}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-3">
        <Field label="City" error={errors.city}>
          <input
            type="text"
            value={value.city}
            onChange={e => onChange({ ...value, city: e.target.value })}
            autoComplete="address-level2"
            placeholder="Brooklyn"
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: '#ece6d8' }}
          />
        </Field>
        <Field label="State" error={errors.state}>
          <select
            value={value.state}
            onChange={e => onChange({ ...value, state: e.target.value })}
            autoComplete="address-level1"
            className="w-full bg-transparent outline-none text-sm appearance-none cursor-pointer"
            style={{ color: '#ece6d8' }}
          >
            <option value="" style={{ backgroundColor: '#1d2025' }}>—</option>
            {US_STATES.map(s => (
              <option key={s} value={s} style={{ backgroundColor: '#1d2025' }}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="ZIP" error={errors.postalCode}>
          <input
            type="text"
            value={value.postalCode}
            onChange={e => onChange({ ...value, postalCode: e.target.value.slice(0, 10) })}
            autoComplete="postal-code"
            placeholder="11206"
            className="w-full bg-transparent outline-none text-sm font-mono"
            style={{ color: '#ece6d8' }}
          />
        </Field>
      </div>
      <Field label="Country">
        <select
          value={value.country}
          onChange={e => onChange({ ...value, country: e.target.value })}
          autoComplete="country"
          className="w-full bg-transparent outline-none text-sm appearance-none cursor-pointer"
          style={{ color: '#ece6d8' }}
        >
          <option value="US" style={{ backgroundColor: '#1d2025' }}>United States</option>
          <option value="CA" style={{ backgroundColor: '#1d2025' }}>Canada</option>
          <option value="UK" style={{ backgroundColor: '#1d2025' }}>United Kingdom</option>
        </select>
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
