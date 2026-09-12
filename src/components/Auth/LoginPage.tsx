import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { AuthField } from './AuthField';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CREDENTIALS, findCredential } from '../../data/demoCredentials';

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/learning';
  const { dispatch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fillCredential = (e: string, p: string) => {
    setEmail(e); setPassword(p); setError(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setTimeout(() => {
      const cred = findCredential(email, password);
      if (!cred) {
        setSubmitting(false);
        setError('Email or password is incorrect. Try one of the demo accounts below.');
        return;
      }
      dispatch({ type: 'SIGN_IN', email: cred.email, role: cred.role });
      // Routes the user came from take precedence
      navigate(next, { replace: true });
    }, 500);
  };

  return (
    <div className="px-4 py-16 lg:py-24 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; Welcome back
        </p>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight leading-tight mb-3" style={{ color: '#ece6d8' }}>
          Sign in to <span className="italic font-light" style={{ color: '#b8b3a7' }}>continue</span>.
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#b8b3a7' }}>
          Pick up where you left off. Your courses, progress, and notes are waiting.
        </p>

        {/* Demo credentials banner */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ border: '1px dashed rgba(216,197,148,0.40)', backgroundColor: 'rgba(216,197,148,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={13} style={{ color: '#d8c594' }} aria-hidden />
            <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#d8c594' }}>
              Demo accounts
            </p>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#b8b3a7' }}>
            This is a demo. Pick a role below — password is{' '}
            <span className="font-mono" style={{ color: '#ece6d8' }}>atelier2025</span>.
          </p>
          <div className="space-y-1.5">
            {DEMO_CREDENTIALS.map(cred => (
              <button
                key={cred.email}
                type="button"
                onClick={() => fillCredential(cred.email, cred.password)}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                style={{ border: '1px solid rgba(236,230,216,0.10)' }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold shrink-0"
                  style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}
                >
                  {cred.label}
                </span>
                <span className="font-mono text-xs truncate" style={{ color: '#ece6d8' }}>
                  {cred.email}
                </span>
                <span className="text-[10px] ml-auto hidden sm:inline" style={{ color: '#8a857a' }}>
                  {cred.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="flex items-start gap-2 rounded-lg px-3 py-2 mb-3 text-xs"
            style={{ border: '1px solid rgba(197,137,122,0.40)', backgroundColor: 'rgba(197,137,122,0.08)', color: '#c5897a' }}
            role="alert"
          >
            <AlertCircle size={13} className="shrink-0 mt-0.5" aria-hidden />
            {error}
          </div>
        )}

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
          <AuthField
            icon={<Lock size={14} aria-hidden />}
            type={showPwd ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
            trailing={
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="accent-[#ece6d8]"
              />
              <span style={{ color: '#b8b3a7' }}>Remember me</span>
            </label>
            <Link to="/forgot-password" className="hover:opacity-60 transition-opacity" style={{ color: '#ece6d8' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            {submitting ? 'Signing in…' : <>Continue <ArrowRight className="w-4 h-4" aria-hidden /></>}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8a857a' }}>
          <span className="flex-1 h-px" style={{ backgroundColor: 'rgba(236, 230, 216, 0.10)' }} />
          Or
          <span className="flex-1 h-px" style={{ backgroundColor: 'rgba(236, 230, 216, 0.10)' }} />
        </div>

        {/* SSO placeholders */}
        <div className="grid grid-cols-2 gap-3">
          <SsoButton label="Google"  to="/oauth/callback/google" />
          <SsoButton label="GitHub"  to="/oauth/callback/github" />
        </div>

        <div
          className="mt-8 pt-6 border-t text-sm flex items-center justify-between"
          style={{ borderColor: 'rgba(236, 230, 216, 0.10)' }}
        >
          <span style={{ color: '#b8b3a7' }}>New to Atelier?</span>
          <Link to="/signup" className="font-medium hover:opacity-60 transition-opacity inline-flex items-center gap-1" style={{ color: '#ece6d8' }}>
            Begin <ArrowRight className="w-3 h-3" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SsoButton({ label, to }: { label: string; to: string }) {
  return (
    <Link
      to={to}
      className="py-2.5 text-center rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
      style={{ color: '#ece6d8', border: '1px solid rgba(236, 230, 216, 0.20)' }}
    >
      Continue with {label}
    </Link>
  );
}
