import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AuthField } from './AuthField';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 700);
  };

  if (submitted) {
    return (
      <div className="px-4 py-16 lg:py-24 min-h-[calc(100vh-128px)]">
        <div className="w-full max-w-md mx-auto text-center">
          <div
            className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: 'rgba(168,192,138,0.15)' }}
            aria-hidden
          >
            <CheckCircle2 size={26} style={{ color: '#a8c08a' }} />
          </div>
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
            ✦ &nbsp; Check your inbox
          </p>
          <h1 className="font-display text-4xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
            Almost <span className="italic font-light" style={{ color: '#b8b3a7' }}>there</span>.
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#b8b3a7' }}>
            If an account exists for <span style={{ color: '#ece6d8' }}>{email}</span>, we've sent a link to reset your password. Click the link within the next 60 minutes.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#ece6d8' }}
          >
            <ArrowLeft size={13} aria-hidden /> Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-16 lg:py-24 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; Recover access
        </p>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight leading-tight mb-3" style={{ color: '#ece6d8' }}>
          Forgot your <span className="italic font-light" style={{ color: '#b8b3a7' }}>password</span>?
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: '#b8b3a7' }}>
          Enter your email and we'll send you a link to set a new one.
        </p>

        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <AuthField
            icon={<Mail size={14} aria-hidden />}
            type="email"
            placeholder="you@somewhere.com"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <button
            type="submit"
            disabled={submitting || !email}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            {submitting ? 'Sending…' : <>Send reset link <ArrowRight className="w-4 h-4" aria-hidden /></>}
          </button>
        </form>

        <div
          className="mt-8 pt-6 border-t text-sm flex items-center justify-between"
          style={{ borderColor: 'rgba(236,230,216,0.10)' }}
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            style={{ color: '#b8b3a7' }}
          >
            <ArrowLeft size={12} aria-hidden /> Back to sign in
          </Link>
          <Link to="/signup" className="font-medium hover:opacity-70 transition-opacity" style={{ color: '#ece6d8' }}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
