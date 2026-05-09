import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { OAuthProvider } from '../../types/account';

const PROVIDER_NAMES: Record<OAuthProvider, string> = {
  google: 'Google',
  github: 'GitHub',
  apple: 'Apple',
};

function isProvider(p: string | undefined): p is OAuthProvider {
  return p === 'google' || p === 'github' || p === 'apple';
}

export function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const safeProvider = isProvider(provider) ? provider : null;

  useEffect(() => {
    if (!safeProvider) {
      navigate('/login', { replace: true });
      return;
    }
    const t = setTimeout(() => {
      dispatch({
        type: 'CONNECT_OAUTH',
        connection: {
          provider: safeProvider,
          email: 'sarah@example.com',
          connectedAt: new Date().toISOString(),
        },
      });
      navigate('/learning', { replace: true });
    }, 1100);
    return () => clearTimeout(t);
  }, [safeProvider, dispatch, navigate]);

  return (
    <div className="px-4 py-24 min-h-[calc(100vh-128px)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={36} className="mx-auto mb-6 animate-spin" style={{ color: '#ece6d8' }} aria-hidden />
        <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; One moment
        </p>
        <h1 className="font-display text-2xl tracking-tight" style={{ color: '#ece6d8' }}>
          Connecting with <span className="italic font-light">{safeProvider ? PROVIDER_NAMES[safeProvider] : '…'}</span>
        </h1>
      </div>
    </div>
  );
}
