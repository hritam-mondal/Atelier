import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Status = 'verifying' | 'success' | 'invalid';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const { state, dispatch } = useAuth();
  const [status, setStatus] = useState<Status>('verifying');

  useEffect(() => {
    if (!token || token.length < 6) {
      setStatus('invalid');
      return;
    }
    if (state.emailVerified) {
      setStatus('success');
      return;
    }
    const t = setTimeout(() => {
      dispatch({ type: 'VERIFY_EMAIL' });
      setStatus('success');
    }, 900);
    return () => clearTimeout(t);
  }, [token, dispatch, state.emailVerified]);

  return (
    <div className="px-4 py-16 lg:py-24 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md mx-auto text-center">
        {status === 'verifying' && (
          <>
            <Loader2 size={36} className="mx-auto mb-6 animate-spin" style={{ color: '#ece6d8' }} aria-hidden />
            <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
              ✦ &nbsp; Hold tight
            </p>
            <h1 className="font-display text-3xl tracking-tight mb-2" style={{ color: '#ece6d8' }}>
              Verifying your <span className="italic font-light" style={{ color: '#b8b3a7' }}>email</span>…
            </h1>
          </>
        )}
        {status === 'success' && (
          <>
            <div
              className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(168,192,138,0.15)' }}
              aria-hidden
            >
              <CheckCircle2 size={26} style={{ color: '#a8c08a' }} />
            </div>
            <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
              ✦ &nbsp; Verified
            </p>
            <h1 className="font-display text-4xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
              You're all <span className="italic font-light" style={{ color: '#b8b3a7' }}>set</span>.
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#b8b3a7' }}>
              Your email is verified. You can now enroll in courses and earn certificates.
            </p>
            <button
              onClick={() => navigate('/learning')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              Go to your learning <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </>
        )}
        {status === 'invalid' && (
          <>
            <div
              className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(197,137,122,0.15)' }}
              aria-hidden
            >
              <AlertCircle size={26} style={{ color: '#c5897a' }} />
            </div>
            <h1 className="font-display text-4xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
              That link is <span className="italic font-light" style={{ color: '#b8b3a7' }}>invalid</span>.
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#b8b3a7' }}>
              Verification links expire after 24 hours. We can send you another one.
            </p>
            <Link
              to="/account/security"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              Go to account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
