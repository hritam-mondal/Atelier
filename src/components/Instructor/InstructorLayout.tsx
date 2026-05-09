import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, BarChart3, DollarSign, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TopNav } from '../shared/TopNav';

interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean }

const NAV: NavItem[] = [
  { to: '/instructor',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/instructor/courses',    label: 'Courses',    icon: BookOpen },
  { to: '/instructor/qa',         label: 'Q&A',        icon: MessageSquare },
  { to: '/instructor/analytics',  label: 'Analytics',  icon: BarChart3 },
  { to: '/instructor/earnings',   label: 'Earnings',   icon: DollarSign },
  { to: '/instructor/profile',    label: 'Profile',    icon: User },
];

export function InstructorLayout() {
  return (
    <>
      <TopNav />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; Instructor studio
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Studio navigation">
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
