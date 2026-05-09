import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

interface Consent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

const STORAGE_KEY = 'cookie-consent-v1';

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(c: Consent) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch { /* noop */ }
}

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent | null>(() => read());
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<Omit<Consent, 'decidedAt'>>({ essential: true, analytics: true, marketing: false });

  useEffect(() => {
    if (consent) save(consent);
  }, [consent]);

  if (consent) return null;

  const acceptAll = () => setConsent({ essential: true, analytics: true, marketing: true, decidedAt: new Date().toISOString() });
  const essentialOnly = () => setConsent({ essential: true, analytics: false, marketing: false, decidedAt: new Date().toISOString() });
  const saveCustom = () => setConsent({ ...draft, decidedAt: new Date().toISOString() });

  if (customizing) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Cookie preferences">
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} aria-hidden />
        <div
          className="relative w-full max-w-md rounded-xl shadow-2xl p-5"
          style={{ backgroundColor: '#1d2025', border: '1px solid rgba(236,230,216,0.20)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl tracking-tight" style={{ color: '#ece6d8' }}>Cookie preferences</h2>
            <button onClick={() => setCustomizing(false)} aria-label="Close" className="rounded p-1 hover:opacity-70">
              <X size={18} style={{ color: '#b8b3a7' }} />
            </button>
          </div>
          <p className="text-sm mb-4" style={{ color: '#b8b3a7' }}>Choose which categories you'll allow.</p>
          <div className="space-y-3 mb-5">
            <Toggle label="Essential" description="Required for sign-in, cart, and basic functionality." value={true} disabled />
            <Toggle label="Analytics" description="Helps us understand how the site is used." value={draft.analytics} onChange={v => setDraft({ ...draft, analytics: v })} />
            <Toggle label="Marketing" description="Used for personalised offers and promotions." value={draft.marketing} onChange={v => setDraft({ ...draft, marketing: v })} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setCustomizing(false)} className="px-4 py-2 rounded-full text-sm hover:opacity-70" style={{ color: '#b8b3a7' }}>Cancel</button>
            <button onClick={saveCustom} className="px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80" style={{ backgroundColor: '#ece6d8', color: '#15171a' }}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-[60]" role="dialog" aria-label="Cookie consent">
      <div
        className="rounded-xl p-4 shadow-2xl"
        style={{ backgroundColor: '#1d2025', border: '1px solid rgba(236,230,216,0.20)' }}
      >
        <div className="flex items-start gap-2 mb-3">
          <Cookie size={16} style={{ color: '#d8c594' }} className="shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm leading-snug" style={{ color: '#ece6d8' }}>
            We use cookies to remember sign-in, run the cart, and (with your permission) measure how the site is used.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={acceptAll} className="px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80" style={{ backgroundColor: '#ece6d8', color: '#15171a' }}>
            Accept all
          </button>
          <button onClick={essentialOnly} className="px-3 py-1.5 rounded-full text-xs hover:opacity-80" style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}>
            Essential only
          </button>
          <button onClick={() => setCustomizing(true)} className="px-3 py-1.5 rounded-full text-xs hover:opacity-70" style={{ color: '#b8b3a7' }}>
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, description, value, onChange, disabled }: { label: string; description: string; value: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <button
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange?.(!value)}
        className="relative inline-block w-9 h-5 rounded-full mt-0.5 shrink-0 transition-colors disabled:opacity-50"
        style={{ backgroundColor: value ? '#a8c08a' : 'rgba(236,230,216,0.15)' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          style={{ backgroundColor: value ? '#15171a' : '#ece6d8', left: value ? '18px' : '2px' }}
        />
      </button>
      <div>
        <p className="text-sm" style={{ color: '#ece6d8' }}>{label}</p>
        <p className="text-xs" style={{ color: '#8a857a' }}>{description}</p>
      </div>
    </div>
  );
}
