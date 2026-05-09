import { Link } from 'react-router-dom';
import { Code2, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { OAuthProvider } from '../../types/account';

interface ProviderInfo {
  id: OAuthProvider;
  name: string;
  description: string;
}

const PROVIDERS: ProviderInfo[] = [
  { id: 'google', name: 'Google', description: 'Sign in with your Google account.' },
  { id: 'github', name: 'GitHub', description: 'Useful if you take engineering courses.' },
  { id: 'apple', name: 'Apple', description: 'Sign in with your Apple ID.' },
];

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path d="M21.6 12.227c0-.81-.073-1.59-.21-2.34H12v4.43h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.97-4.32 2.97-7.62z" fill="#4285F4" />
      <path d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.59A10 10 0 0 0 12 22z" fill="#34A853" />
      <path d="M6.4 13.9a6 6 0 0 1 0-3.81V7.51H3.06a10 10 0 0 0 0 8.97L6.4 13.9z" fill="#FBBC05" />
      <path d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.97 2.99 14.7 2.05 12 2.05a10 10 0 0 0-8.94 5.46L6.4 10.1C7.19 7.72 9.4 5.95 12 5.95z" fill="#EA4335" />
    </svg>
  );
}

export function ConnectionsPage() {
  const { state, dispatch } = useAuth();

  const isOnlyProvider = state.oauthConnections.length === 1;

  return (
    <div className="space-y-2">
      <h2 className="font-display tracking-tight text-xl mb-1" style={{ color: '#ece6d8' }}>
        Connected accounts
      </h2>
      <p className="text-xs mb-5" style={{ color: '#b8b3a7' }}>
        Use any of these to sign in to your Atelier account.
      </p>

      {PROVIDERS.map(p => {
        const connection = state.oauthConnections.find(c => c.provider === p.id);
        const Icon = p.id === 'google' ? GoogleMark : p.id === 'github' ? Code2 : Smartphone;

        return (
          <div
            key={p.id}
            className="flex items-center gap-4 px-4 py-3 rounded-lg"
            style={{ border: '1px solid rgba(236,230,216,0.10)' }}
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}>
              <Icon className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: '#ece6d8' }}>{p.name}</p>
              <p className="text-xs" style={{ color: '#8a857a' }}>
                {connection ? `Connected as ${connection.email}` : p.description}
              </p>
            </div>
            {connection ? (
              <button
                onClick={() => {
                  if (isOnlyProvider && !confirm('This is your only sign-in method. Disconnecting may lock you out. Continue?')) return;
                  dispatch({ type: 'DISCONNECT_OAUTH', provider: p.id });
                }}
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: '#c5897a' }}
              >
                Disconnect
              </button>
            ) : (
              <Link
                to={`/oauth/callback/${p.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
              >
                Connect
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
