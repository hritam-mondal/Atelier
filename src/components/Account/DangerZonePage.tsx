import { useState } from 'react';
import { Download, AlertOctagon, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { useBilling } from '../../context/BillingContext';

const CONFIRM_TEXT = 'delete my account';

export function DangerZonePage() {
  const { state: auth } = useAuth();
  const { state: user } = useUser();
  const { state: cart } = useCart();
  const { state: billing } = useBilling();
  const [confirm, setConfirm] = useState('');
  const [password, setPassword] = useState('');

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ auth, user, cart, billing, exportedAt: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `atelier-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    if (confirm.trim().toLowerCase() !== CONFIRM_TEXT || !password) return;
    alert('In a real app, your account would be deleted. Mock environment.');
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display tracking-tight text-xl mb-1" style={{ color: '#ece6d8' }}>
          Export your data
        </h2>
        <p className="text-xs mb-4" style={{ color: '#b8b3a7' }}>
          Download a JSON archive of your profile, enrollments, notes, and orders.
        </p>
        <button
          onClick={exportData}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
        >
          <Download size={13} aria-hidden /> Download my data
        </button>
      </section>

      <section
        className="p-5 rounded-xl"
        style={{ border: '1px solid rgba(197,137,122,0.30)', backgroundColor: 'rgba(197,137,122,0.04)' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertOctagon size={20} style={{ color: '#c5897a' }} aria-hidden />
          <div>
            <h2 className="font-display tracking-tight text-xl mb-1" style={{ color: '#ece6d8' }}>
              Delete account
            </h2>
            <p className="text-xs" style={{ color: '#b8b3a7' }}>
              This action is permanent. We'll delete your profile, enrollments, notes, certificates, and Q&A activity. Refunds for any active subscription will be issued.
            </p>
          </div>
        </div>

        <div className="space-y-3 max-w-sm">
          <div>
            <label className="block text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b8b3a7' }}>
              Type <span className="font-mono">{CONFIRM_TEXT}</span> to confirm
            </label>
            <input
              type="text"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none text-sm font-mono"
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(236,230,216,0.20)',
                color: '#ece6d8',
              }}
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b8b3a7' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-lg outline-none text-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(236,230,216,0.20)',
                color: '#ece6d8',
              }}
            />
          </div>
          <button
            onClick={deleteAccount}
            disabled={confirm.trim().toLowerCase() !== CONFIRM_TEXT || !password}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#c5897a', color: '#15171a' }}
          >
            <Trash2 size={13} aria-hidden /> Permanently delete account
          </button>
        </div>
      </section>
    </div>
  );
}
