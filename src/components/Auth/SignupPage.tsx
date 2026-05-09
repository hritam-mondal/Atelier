import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { AuthField } from './AuthField';
import { useAuth } from '../../context/AuthContext';

const PERKS = [
  'Unlimited access to 1,240+ courses',
  'Live cohorts and instructor office hours',
  'Project reviews and feedback from instructors',
  '7-day free trial — no card required',
];

export function SignupPage() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agree, setAgree] = useState(true);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setSubmitting(true);
    setTimeout(() => {
      // Demo: any signup succeeds and signs you in as a student
      dispatch({ type: 'SIGN_IN', email: email || 'student@atelier.app', role: 'student' });
      navigate('/learning', { replace: true });
    }, 700);
  };

  const passwordStrength = scorePassword(password);

  return (
    <div className="px-4 py-16 lg:py-20 min-h-[calc(100vh-128px)]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left side — perks */}
        <aside className="hidden lg:block lg:pt-6">
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
            ✦ &nbsp; Begin the work
          </p>
          <h2 className="font-display text-4xl lg:text-5xl tracking-tight leading-tight mb-6" style={{ color: '#ece6d8' }}>
            One subscription. <br />
            <span className="italic font-light" style={{ color: '#b8b3a7' }}>The whole library.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: '#b8b3a7' }}>
            Join 180,000 engineers, designers, and operators learning the craft from people who do the work.
          </p>
          <ul className="space-y-4">
            {PERKS.map((perk, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(236, 230, 216, 0.10)' }}
                  aria-hidden
                >
                  <Check size={11} style={{ color: '#ece6d8' }} />
                </span>
                <span className="text-sm leading-relaxed" style={{ color: '#ece6d8' }}>{perk}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(236, 230, 216, 0.10)' }}>
            <p className="font-display text-xl italic leading-snug mb-3" style={{ color: '#ece6d8' }}>
              "Most courses teach you to copy. The instructors here teach you to think."
            </p>
            <p className="text-xs" style={{ color: '#8a857a' }}>
              Daniel R. — Founding Engineer
            </p>
          </div>
        </aside>

        {/* Right side — form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
          <p className="text-xs tracking-[0.2em] uppercase mb-3 lg:hidden" style={{ color: '#b8b3a7' }}>
            ✦ &nbsp; Begin the work
          </p>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight leading-tight mb-3" style={{ color: '#ece6d8' }}>
            Create an <span className="italic font-light" style={{ color: '#b8b3a7' }}>account</span>.
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#b8b3a7' }}>
            Free for seven days. Cancel any time — though most don't.
          </p>

          <form onSubmit={onSubmit} className="space-y-3" noValidate>
            <AuthField
              icon={<User size={14} aria-hidden />}
              type="text"
              placeholder="Your name"
              value={name}
              onChange={setName}
              autoComplete="name"
              required
            />
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
              placeholder="Choose a password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
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

            {/* Password strength */}
            {password && (
              <div className="px-1 pt-1">
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <span
                      key={i}
                      className="flex-1 h-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: i < passwordStrength.score
                          ? passwordStrength.color
                          : 'rgba(236, 230, 216, 0.10)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: '#8a857a' }}>
                  {passwordStrength.label}
                </p>
              </div>
            )}

            <label className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mt-0.5 accent-[#ece6d8]"
              />
              <span className="text-[11px] leading-relaxed" style={{ color: '#8a857a' }}>
                By continuing you agree to the{' '}
                <a href="#" className="underline underline-offset-2" style={{ color: '#ece6d8' }}>terms</a>
                {' '}and{' '}
                <a href="#" className="underline underline-offset-2" style={{ color: '#ece6d8' }}>privacy policy</a>.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting || !agree}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              {submitting ? 'Creating your account…' : <>Begin <ArrowRight className="w-4 h-4" aria-hidden /></>}
            </button>
          </form>

          <div
            className="mt-8 pt-6 border-t text-sm flex items-center justify-between"
            style={{ borderColor: 'rgba(236, 230, 216, 0.10)' }}
          >
            <span style={{ color: '#b8b3a7' }}>Already have an account?</span>
            <Link to="/login" className="font-medium hover:opacity-60 transition-opacity" style={{ color: '#ece6d8' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
