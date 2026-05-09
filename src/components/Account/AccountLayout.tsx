import { NavLink, Outlet } from 'react-router-dom';
import { User, Lock, Bell, Link as LinkIcon, CreditCard, AlertOctagon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TopNav } from '../shared/TopNav';
import { VerifyEmailBanner } from '../Auth/VerifyEmailBanner';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/security', label: 'Security', icon: Lock },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
  { to: '/account/connections', label: 'Connections', icon: LinkIcon },
  { to: '/account/billing', label: 'Billing', icon: CreditCard },
  { to: '/account/danger', label: 'Danger zone', icon: AlertOctagon },
];

export function AccountLayout() {
  return (
    <>
      <TopNav />
      <VerifyEmailBanner />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; Account
        </p>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-8" style={{ color: '#ece6d8' }}>
          Settings.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Account navigation">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {NAV.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive ? 'font-medium' : 'hover:bg-white/5'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#ece6d8' : '#b8b3a7',
                    backgroundColor: isActive ? 'rgba(236,230,216,0.08)' : 'transparent',
                  })}
                >
                  <item.icon size={14} aria-hidden />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
