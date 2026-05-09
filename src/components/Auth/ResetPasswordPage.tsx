import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthField } from './AuthField';
import { useAuth } from '../../context/AuthContext';

function scorePassword(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: '', color: '#8a857a' };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const labels = ['Too weak', 'Weak', 'Decent', 'Strong', 'Excellent'];
  const colors = ['#c5897a', '#d8c594', '#d8c594', '#a8c08a', '#8fa874'];
  return { score, label: labels[score], color: colors[score] };
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');
  const { dispatch } = useAuth();
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const tokenValid = token && token.length >= 8;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== confirm || pwd.length < 8) return;
    setSubmitting(true);
    setTimeout(() => {
      dispatch({ type: 'RECORD_PASSWORD_CHANGE' });
      setDone(true);
      setSubmitting(false);
      setTimeout(() => navigate('/login'), 1800);
    }, 700);
  };

  if (!tokenValid) {
    return (
      <div className="px-4 py-16 lg:py-24 min-h-[calc(100vh-128px)]">
        <div className="w-full max-w-md mx-auto text-center">
          <div
            className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: 'rgba(197,137,122,0.15)' }}
            aria-hidden
          >
            <AlertCircle size={26} style={{ color: '#c5897a' }} />
          </div>
          <h1 className="font-display text-4xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
            Link invalid or <span className="italic font-light" style={{ color: '#b8b3a7' }}>expired</span>.
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#b8b3a7' }}>
            Reset links expire after 60 minutes. Request a fresh one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            Request new link <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
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
          <h1 className="font-display text-4xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
            Password <span className="italic font-light" style={{ color: '#b8b3a7' }}>updated</span>.
          </h1>
          <p className="text-sm" style={{ color: '#b8b3a7' }}>
            Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

  const strength = scorePassword(pwd);
  const mismatch = confirm.length > 0 && pwd !== confirm;

  return (
    <div className="px-4 py-16 lg:py-24 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; New password
        </p>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight leading-tight mb-3" style={{ color: '#ece6d8' }}>
          Choose a <span className="italic font-light" style={{ color: '#b8b3a7' }}>new one</span>.
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: '#b8b3a7' }}>
          Pick something memorable but hard to guess.
        </p>

        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <AuthField
            icon={<Lock size={14} aria-hidden />}
            type={showPwd ? 'text' : 'password'}
            placeholder="New password"
            value={pwd}
            onChange={setPwd}
            autoComplete="new-password"
            required
            trailing={
              <button type="button" onClick={() => setShowPwd(p => !p)} className="opacity-60 hover:opacity-100 transition-opacity" aria-label={showPwd ? 'Hide' : 'Show'}>
                {showPwd ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
              </button>
            }
          />
          {pwd && (
            <div className="px-1">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map(i => (
                  <span
                    key={i}
                    className="flex-1 h-1 rounded-full transition-colors"
                    style={{ backgroundColor: i < strength.score ? strength.color : 'rgba(236, 230, 216, 0.10)' }}
                  />
                ))}
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: '#8a857a' }}>{strength.label}</p>
            </div>
          )}
          <AuthField
            icon={<Lock size={14} aria-hidden />}
            type={showPwd ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            required
          />
          {mismatch && <p className="text-xs text-rose-400 px-1">Passwords don't match.</p>}

          <button
            type="submit"
            disabled={submitting || mismatch || pwd.length < 8 || !confirm}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            {submitting ? 'Updating…' : <>Set new password <ArrowRight className="w-4 h-4" aria-hidden /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
