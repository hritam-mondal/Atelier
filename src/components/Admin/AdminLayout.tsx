import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Shield, Flag, ClipboardList, Megaphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TopNav } from '../shared/TopNav';

interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean }

const NAV: NavItem[] = [
  { to: '/admin',                label: 'Overview',        icon: LayoutDashboard, end: true },
  { to: '/admin/moderation',     label: 'Moderation',      icon: Shield },
  { to: '/admin/flags',          label: 'Feature flags',   icon: Flag },
  { to: '/admin/audit',          label: 'Audit log',       icon: ClipboardList },
  { to: '/admin/announcements',  label: 'Announcements',   icon: Megaphone },
];

export function AdminLayout() {
  return (
    <>
      <TopNav />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#c5897a' }}>
          ✦ &nbsp; Admin
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Admin navigation">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {NAV.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${isActive ? 'font-medium' : 'hover:bg-white/5'}`
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
