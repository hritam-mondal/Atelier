import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function InstructorProfilePage() {
  const { state } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Public profile.</h1>
      <p className="text-sm leading-relaxed max-w-prose" style={{ color: '#b8b3a7' }}>
        Your public instructor profile is sourced from the <Link to="/account" className="underline underline-offset-2" style={{ color: '#ece6d8' }}>Account · Profile</Link> page.
        Edit your headline, bio, and social links there.
      </p>

      <div className="rounded-xl p-5" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}>
        <p className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b8b3a7' }}>Headline</p>
        <p className="text-sm mb-4" style={{ color: '#ece6d8' }}>{state.profile.headline || '—'}</p>
        <p className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b8b3a7' }}>Bio</p>
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#ece6d8' }}>{state.profile.bio || '—'}</p>
      </div>

      <Link
        to="/u/sarah-chen"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
      >
        View public page <ExternalLink size={13} aria-hidden />
      </Link>
    </div>
  );
}
