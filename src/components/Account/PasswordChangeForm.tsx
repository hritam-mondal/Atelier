import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function PasswordChangeForm() {
  const { dispatch } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8 || next !== confirm) return;
    setSubmitting(true);
    setTimeout(() => {
      dispatch({ type: 'RECORD_PASSWORD_CHANGE' });
      setSubmitting(false);
      setSuccess(true);
      setCurrent(''); setNext(''); setConfirm('');
      setTimeout(() => setSuccess(false), 2400);
    }, 600);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field icon={<Lock size={14} aria-hidden />} type={show ? 'text' : 'password'}
        placeholder="Current password" value={current} onChange={setCurrent}
        autoComplete="current-password"
      />
      <Field icon={<Lock size={14} aria-hidden />} type={show ? 'text' : 'password'}
        placeholder="New password" value={next} onChange={setNext}
        autoComplete="new-password"
      />
      <Field icon={<Lock size={14} aria-hidden />} type={show ? 'text' : 'password'}
        placeholder="Confirm new password" value={confirm} onChange={setConfirm}
        autoComplete="new-password"
        trailing={
          <button type="button" onClick={() => setShow(s => !s)} className="opacity-60 hover:opacity-100 transition-opacity" aria-label={show ? 'Hide' : 'Show'}>
            {show ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
          </button>
        }
      />

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || !current || next.length < 8 || next !== confirm}
          className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          {submitting ? 'Updating…' : 'Change password'}
        </button>
        {success && (
          <span className="inline-flex items-center gap-1 text-xs" style={{ color: '#a8c08a' }}>
            <CheckCircle2 size={12} aria-hidden /> Updated
          </span>
        )}
      </div>
    </form>
  );
}

function Field({ icon, type, placeholder, value, onChange, autoComplete, trailing }: {
  icon: React.ReactNode; type: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  autoComplete?: string; trailing?: React.ReactNode;
}) {
  return (
    <label
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-within:border-[rgba(236,230,216,0.5)]"
      style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      <span style={{ color: '#8a857a' }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: '#ece6d8' }}
      />
      {trailing && <span style={{ color: '#ece6d8' }}>{trailing}</span>}
    </label>
  );
}
