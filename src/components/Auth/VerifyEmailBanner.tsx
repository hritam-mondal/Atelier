import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function VerifyEmailBanner() {
  const { state } = useAuth();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('verify-banner-dismissed') === '1');
  const [resentAt, setResentAt] = useState<number | null>(null);

  if (state.emailVerified || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem('verify-banner-dismissed', '1'); } catch { /* noop */ }
  };

  const resend = () => {
    setResentAt(Date.now());
    setTimeout(() => setResentAt(null), 4000);
  };

  return (
    <div
      className="border-b"
      style={{
        backgroundColor: 'rgba(216, 197, 148, 0.10)',
        borderColor: 'rgba(216, 197, 148, 0.30)',
      }}
      role="status"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-2.5 flex items-center gap-3 text-xs">
        <Mail size={13} style={{ color: '#d8c594' }} aria-hidden />
        <span style={{ color: '#ece6d8' }}>
          Verify your email to enroll in courses and earn certificates.
        </span>
        {resentAt ? (
          <span className="text-[11px]" style={{ color: '#a8c08a' }}>Verification email sent.</span>
        ) : (
          <button
            onClick={resend}
            className="font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: '#d8c594' }}
          >
            Resend link
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="ml-auto rounded p-1 hover:opacity-70 transition-opacity"
        >
          <X size={13} style={{ color: '#b8b3a7' }} />
        </button>
      </div>
    </div>
  );
}
