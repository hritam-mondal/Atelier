import { useState } from 'react';
import { Shield, ShieldCheck, Copy, Check, X, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SECRET = 'JBSWY3DPEHPK3PXP'; // demo TOTP secret

function generateRecoveryCodes(): string[] {
  return Array.from({ length: 10 }, () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 11; i++) {
      if (i === 5) code += '-';
      else code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  });
}

// Tiny SVG QR-code placeholder (random pattern based on secret) — stand-in for a real QR
function QrPlaceholder({ data }: { data: string }) {
  // Deterministic 21x21 grid
  const cells: boolean[] = [];
  let h = 0;
  for (let i = 0; i < data.length; i++) h = (h * 31 + data.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 21 * 21; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push((h >>> 16) % 2 === 0);
  }
  // Force corner finders
  const cornerOn = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  return (
    <svg viewBox="0 0 21 21" className="w-44 h-44" aria-hidden>
      <rect width="21" height="21" fill="#ece6d8" />
      {Array.from({ length: 21 }).map((_, y) =>
        Array.from({ length: 21 }).map((_, x) => {
          const onPattern = cells[y * 21 + x];
          const isCornerArea = cornerOn(x, y);
          if (isCornerArea) {
            const localX = x < 7 ? x : x > 13 ? x - 14 : x;
            const localY = y < 7 ? y : y > 13 ? y - 14 : y;
            const onCorner = (localX === 0 || localX === 6) || (localY === 0 || localY === 6) ||
              (localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4);
            return onCorner ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#15171a" /> : null;
          }
          return onPattern ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#15171a" /> : null;
        })
      )}
    </svg>
  );
}

export function TwoFactorSetup() {
  const { state, dispatch } = useAuth();
  const [step, setStep] = useState<'idle' | 'password' | 'qr' | 'verify' | 'codes'>('idle');
  const [password, setPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  const start = () => { setStep('password'); setPassword(''); };
  const cancel = () => { setStep('idle'); setVerifyCode(''); setVerifyError(null); };

  const confirmPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 1) return;
    setStep('qr');
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(verifyCode)) {
      setVerifyError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    // Mock: accept any 6-digit code
    const codes = generateRecoveryCodes();
    dispatch({ type: 'ENABLE_2FA', recoveryCodes: codes });
    setStep('codes');
  };

  const disable = () => {
    if (!confirm('Disable two-factor authentication? Your account will be less secure.')) return;
    dispatch({ type: 'DISABLE_2FA' });
  };

  const copySecret = async () => {
    try { await navigator.clipboard.writeText(SECRET); setSecretCopied(true); setTimeout(() => setSecretCopied(false), 1500); } catch { /* noop */ }
  };

  const recoveryCodes = state.pendingRecoveryCodes;
  const downloadCodes = () => {
    if (!recoveryCodes) return;
    const blob = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'atelier-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedAcknowledge = () => {
    dispatch({ type: 'CLEAR_RECOVERY_CODES' });
    setStep('idle');
  };

  // Recovery codes view (after enabling)
  if (recoveryCodes) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(168,192,138,0.10)', border: '1px solid rgba(168,192,138,0.30)' }}>
          <ShieldCheck size={18} className="shrink-0 mt-0.5" style={{ color: '#a8c08a' }} aria-hidden />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#ece6d8' }}>Two-factor authentication enabled.</p>
            <p className="text-xs mt-1" style={{ color: '#b8b3a7' }}>
              Save these recovery codes somewhere safe. Each can be used once if you lose access to your authenticator.
            </p>
          </div>
        </div>
        <ul
          className="grid grid-cols-2 gap-2 p-4 rounded-lg font-mono text-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.10)' }}
        >
          {recoveryCodes.map(code => (
            <li key={code} style={{ color: '#ece6d8' }}>{code}</li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadCodes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
          >
            <Download size={11} aria-hidden /> Download
          </button>
          <button
            onClick={completedAcknowledge}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            <Check size={11} aria-hidden /> I've saved these
          </button>
        </div>
      </div>
    );
  }

  // Already enabled view
  if (state.twoFactorEnabled && step === 'idle') {
    return (
      <div className="flex items-center justify-between gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(168,192,138,0.08)', border: '1px solid rgba(168,192,138,0.25)' }}>
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} style={{ color: '#a8c08a' }} aria-hidden />
          <div>
            <p className="text-sm font-medium" style={{ color: '#ece6d8' }}>Two-factor is on.</p>
            <p className="text-xs" style={{ color: '#b8b3a7' }}>You'll need a code from your authenticator app to sign in.</p>
          </div>
        </div>
        <button
          onClick={disable}
          className="text-xs hover:opacity-70 transition-opacity"
          style={{ color: '#c5897a' }}
        >
          Disable
        </button>
      </div>
    );
  }

  if (step === 'idle') {
    return (
      <div className="flex items-center justify-between gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.15)' }}>
        <div className="flex items-center gap-3">
          <Shield size={18} style={{ color: '#b8b3a7' }} aria-hidden />
          <div>
            <p className="text-sm" style={{ color: '#ece6d8' }}>Two-factor authentication</p>
            <p className="text-xs" style={{ color: '#b8b3a7' }}>Add an extra layer of security to your account.</p>
          </div>
        </div>
        <button
          onClick={start}
          className="px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Set up
        </button>
      </div>
    );
  }

  // Password step
  if (step === 'password') {
    return (
      <form onSubmit={confirmPassword} className="p-5 rounded-lg space-y-3" style={{ border: '1px solid rgba(236,230,216,0.15)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold" style={{ color: '#ece6d8' }}>Step 1 of 3 · Confirm your password</p>
          <button type="button" onClick={cancel} aria-label="Cancel" className="p-1 hover:opacity-70 transition-opacity">
            <X size={14} style={{ color: '#b8b3a7' }} />
          </button>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Current password"
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-lg outline-none text-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.20)', color: '#ece6d8' }}
          required
        />
        <button
          type="submit"
          disabled={!password}
          className="px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Continue
        </button>
      </form>
    );
  }

  // QR step
  if (step === 'qr') {
    return (
      <div className="p-5 rounded-lg space-y-4" style={{ border: '1px solid rgba(236,230,216,0.15)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: '#ece6d8' }}>Step 2 of 3 · Scan the QR code</p>
          <button type="button" onClick={cancel} aria-label="Cancel" className="p-1 hover:opacity-70 transition-opacity">
            <X size={14} style={{ color: '#b8b3a7' }} />
          </button>
        </div>
        <p className="text-xs" style={{ color: '#b8b3a7' }}>
          Open your authenticator app (1Password, Authy, Google Authenticator) and scan this code.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 items-start">
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#ece6d8' }}>
            <QrPlaceholder data={SECRET} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
              Or enter manually
            </p>
            <button
              type="button"
              onClick={copySecret}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
              aria-label="Copy secret"
            >
              {secretCopied ? <Check size={12} style={{ color: '#a8c08a' }} aria-hidden /> : <Copy size={12} style={{ color: '#b8b3a7' }} aria-hidden />}
              <span className="font-mono">{SECRET}</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setStep('verify')}
          className="px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          I've added it
        </button>
      </div>
    );
  }

  // Verify step
  return (
    <form onSubmit={verify} className="p-5 rounded-lg space-y-3" style={{ border: '1px solid rgba(236,230,216,0.15)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold" style={{ color: '#ece6d8' }}>Step 3 of 3 · Enter the 6-digit code</p>
        <button type="button" onClick={cancel} aria-label="Cancel" className="p-1 hover:opacity-70 transition-opacity">
          <X size={14} style={{ color: '#b8b3a7' }} />
        </button>
      </div>
      <p className="text-xs" style={{ color: '#b8b3a7' }}>
        Enter the current 6-digit code shown in your authenticator app.
      </p>
      <input
        type="text"
        inputMode="numeric"
        value={verifyCode}
        onChange={e => { setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setVerifyError(null); }}
        placeholder="123 456"
        autoComplete="one-time-code"
        className="w-full px-4 py-3 rounded-lg outline-none text-2xl font-mono text-center tracking-[0.5em]"
        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.20)', color: '#ece6d8' }}
        maxLength={6}
        required
      />
      {verifyError && <p className="text-xs text-rose-400">{verifyError}</p>}
      <button
        type="submit"
        disabled={verifyCode.length < 6}
        className="px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
        style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
      >
        Verify and enable
      </button>
    </form>
  );
}
