import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, X, ShoppingBag, Menu, ChevronRight,
  User, BookOpen, Heart, Award, Settings, CreditCard,
  GraduationCap, HelpCircle, LogOut,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { CartDrawer } from '../Commerce/CartDrawer';
import { NotificationBell } from '../Notifications/NotificationBell';
import { SearchModal } from './SearchModal';
import type { UserRole } from '../../types/account';

// ─── Primary nav — built dynamically per auth state ─────────────────────

interface NavLink { to: string; label: string }

function buildPrimaryNav(signedIn: boolean, role: UserRole): NavLink[] {
  const links: NavLink[] = [{ to: '/catalog', label: 'Catalog' }];
  if (signedIn) {
    links.push({ to: '/learning', label: 'My Learning' });
    if (role === 'instructor' || role === 'admin') {
      links.push({ to: '/instructor', label: 'Teach' });
    }
    if (role === 'admin') {
      links.push({ to: '/admin', label: 'Admin' });
    }
  }
  return links;
}

// ─── Search index ───────────────────────────────────────────────────────
function initialsOf(name: string): string {
  return name.split(' ').map(p => p[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();
}

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { state: cartState } = useCart();
  const { state: user } = useUser();
  const { state: auth, dispatch: authDispatch } = useAuth();
  const cartCount = cartState.items.length;
  const signedIn = auth.signedIn;

  const signOut = () => {
    authDispatch({ type: 'SIGN_OUT' });
    navigate('/');
  };

  // ⌘K toggle (open/close handled by SearchModal internally; we just track state)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close avatar menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Close mobile sheet on route change
  useEffect(() => { setMobileOpen(false); setMenuOpen(false); }, [path]);

  const isActive = (to: string) => path.startsWith(to);

  return (
    <>
      {/* Main chrome */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-md"
        style={{ borderColor: 'rgba(236, 230, 216, 0.10)', backgroundColor: 'rgba(21, 23, 26, 0.85)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="font-display text-xl sm:text-2xl font-medium tracking-tight shrink-0" style={{ color: '#ece6d8' }}>
            Atelier<span style={{ color: '#8a857a' }}>.</span>
          </Link>

          {/* Primary nav (lg+) — built per auth state and role */}
          <nav className="hidden lg:flex items-center gap-7 text-sm" aria-label="Primary">
            {buildPrimaryNav(signedIn, auth.role).map(link => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:opacity-60 transition-opacity"
                  style={{ color: active ? '#ece6d8' : '#b8b3a7', fontWeight: active ? 500 : 400 }}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (⌘K)"
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:opacity-80 transition-opacity"
              style={{ color: '#b8b3a7', border: '1px solid rgba(236, 230, 216, 0.15)' }}
            >
              <Search className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
              <span className="text-xs hidden xl:inline">Search</span>
              <kbd className="hidden xl:inline text-[10px] font-mono px-1 rounded" style={{ backgroundColor: 'rgba(236, 230, 216, 0.10)', color: '#ece6d8' }}>⌘K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-md hover:opacity-80 transition-opacity"
              style={{ color: '#ece6d8' }}
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden />
            </button>

            {signedIn ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* Cart */}
                <button
                  onClick={() => setCartOpen(true)}
                  aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
                  className="relative inline-flex items-center justify-center w-9 h-9 rounded-md hover:opacity-80 transition-opacity"
                  style={{ color: '#ece6d8' }}
                >
                  <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums"
                      style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Avatar dropdown (lg+) */}
                <div ref={menuRef} className="relative hidden lg:block ml-1">
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Account menu"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-all hover:opacity-80"
                    style={{ backgroundColor: 'rgba(236,230,216,0.10)', border: '1px solid rgba(236,230,216,0.20)' }}
                  >
                    {user.user.avatar ? (
                      <img src={user.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-xs italic" style={{ color: '#ece6d8' }}>
                        {initialsOf(user.user.name)}
                      </span>
                    )}
                  </button>
                  {menuOpen && (
                    <AvatarMenu
                      name={user.user.name}
                      email={auth.email || user.user.email}
                      role={auth.role}
                      onNavigate={() => setMenuOpen(false)}
                      onSignOut={() => { setMenuOpen(false); signOut(); }}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={`/login${location.pathname !== '/' ? `?next=${encodeURIComponent(location.pathname)}` : ''}`}
                  className="hidden sm:inline text-sm hover:opacity-60 transition-opacity"
                  style={{ color: '#ece6d8' }}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
                >
                  Begin
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md hover:opacity-80 transition-opacity"
              style={{ color: '#ece6d8' }}
            >
              <Menu className="w-[18px] h-[18px]" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile menu sheet */}
      {mobileOpen && (
        <MobileMenuSheet
          signedIn={signedIn}
          name={user.user.name}
          email={auth.email || user.user.email}
          role={auth.role}
          avatar={user.user.avatar}
          onClose={() => setMobileOpen(false)}
          onSignOut={() => { setMobileOpen(false); signOut(); }}
        />
      )}

      {/* Search modal */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        signedIn={signedIn}
        role={auth.role}
      />
    </>
  );
}

// ─── Avatar dropdown ────────────────────────────────────────────────────
function AvatarMenu({ name, email, role, onNavigate, onSignOut }: { name: string; email: string; role: UserRole; onNavigate: () => void; onSignOut: () => void }) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: '#1d2025', border: '1px solid rgba(236,230,216,0.15)' }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <p className="text-sm font-medium truncate" style={{ color: '#ece6d8' }}>{name}</p>
        <p className="text-xs truncate" style={{ color: '#8a857a' }}>{email}</p>
        <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: '#8a857a' }}>
          Signed in as <span style={{ color: '#ece6d8' }}>{role}</span>
        </p>
      </div>

      <div className="py-1">
        <MenuLink to="/learning"               icon={BookOpen}        label="My Learning"         onClick={onNavigate} />
        <MenuLink to="/learning?tab=wishlist"  icon={Heart}           label="Wishlist"            onClick={onNavigate} />
        <MenuLink to="/learning?tab=certificates" icon={Award}        label="Achievements"        onClick={onNavigate} />
      </div>

      <div className="py-1 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <MenuLink to="/account"           icon={User}        label="Profile"        onClick={onNavigate} />
        <MenuLink to="/account/billing"   icon={CreditCard}  label="Billing"        onClick={onNavigate} />
        <MenuLink to="/account/security"  icon={Settings}    label="Settings"       onClick={onNavigate} />
      </div>

      <div className="py-1 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        {(role === 'instructor' || role === 'admin') && (
          <MenuLink to="/instructor" icon={GraduationCap} label="Instructor studio" onClick={onNavigate} highlight />
        )}
        {role === 'admin' && (
          <MenuLink to="/admin" icon={Settings} label="Admin" onClick={onNavigate} highlight />
        )}
        <MenuLink to="/help" icon={HelpCircle} label="Help & support" onClick={onNavigate} />
      </div>

      <div className="py-1 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <button
          role="menuitem"
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-white/[0.04] transition-colors text-left"
          style={{ color: '#b8b3a7' }}
        >
          <LogOut size={14} aria-hidden /> Sign out
        </button>
      </div>
    </div>
  );
}

interface MenuLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}

function MenuLink({ to, icon: Icon, label, onClick, highlight }: MenuLinkProps) {
  return (
    <Link
      role="menuitem"
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/[0.04] transition-colors"
      style={{ color: highlight ? '#ece6d8' : '#b8b3a7' }}
    >
      <Icon size={14} aria-hidden />
      {label}
    </Link>
  );
}

// ─── Mobile menu sheet ──────────────────────────────────────────────────
interface MobileMenuSheetProps {
  signedIn: boolean;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  onClose: () => void;
  onSignOut: () => void;
}

function MobileMenuSheet({ signedIn, name, email, role, avatar, onClose, onSignOut }: MobileMenuSheetProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="absolute right-0 top-0 bottom-0 w-full max-w-xs flex flex-col shadow-2xl"
        style={{ backgroundColor: '#15171a', borderLeft: '1px solid rgba(236,230,216,0.10)' }}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
          <span className="font-display text-xl tracking-tight" style={{ color: '#ece6d8' }}>
            Atelier<span style={{ color: '#8a857a' }}>.</span>
          </span>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:opacity-70 transition-opacity">
            <X size={18} style={{ color: '#b8b3a7' }} />
          </button>
        </header>

        {signedIn ? (
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
            <div
              className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(236,230,216,0.10)', border: '1px solid rgba(236,230,216,0.20)' }}
            >
              {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : (
                <span className="font-display italic text-sm" style={{ color: '#ece6d8' }}>{initialsOf(name)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#ece6d8' }}>{name}</p>
              <p className="text-xs truncate" style={{ color: '#8a857a' }}>{email}</p>
              <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: '#8a857a' }}>
                {role}
              </p>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 border-b flex gap-2" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
            <Link
              to="/login"
              onClick={onClose}
              className="flex-1 py-2 rounded-full text-sm font-medium text-center hover:opacity-80 transition-opacity"
              style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="flex-1 py-2 rounded-full text-sm font-medium text-center hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              Begin
            </Link>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2">
          <SheetSection title="Learn">
            <SheetLink to="/catalog"    label="Catalog" />
            {signedIn && <SheetLink to="/learning"   label="My Learning" />}
            {signedIn && (role === 'instructor' || role === 'admin') && <SheetLink to="/instructor" label="Teach" />}
          </SheetSection>

          {signedIn && (
            <SheetSection title="You">
              <SheetLink to="/account"          label="Profile" />
              <SheetLink to="/account/billing"  label="Billing" />
              <SheetLink to="/account/security" label="Settings" />
              <SheetLink to="/learning?tab=wishlist" label="Wishlist" />
              <SheetLink to="/learning?tab=certificates" label="Achievements" />
              <SheetLink to="/notifications"    label="Notifications" />
            </SheetSection>
          )}

          {signedIn && role === 'admin' && (
            <SheetSection title="Admin">
              <SheetLink to="/admin"             label="Overview" />
              <SheetLink to="/admin/moderation"  label="Moderation" />
              <SheetLink to="/admin/flags"       label="Feature flags" />
            </SheetSection>
          )}

          <SheetSection title="More">
            <SheetLink to="/help"     label="Help & support" />
            <SheetLink to="/about"    label="About Atelier" />
            <SheetLink to="/teams"    label="For teams" />
            <SheetLink to="/blog"     label="Journal" />
          </SheetSection>

          {signedIn && (
            <div className="px-2 py-2">
              <button
                onClick={onSignOut}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-white/[0.04] transition-colors"
                style={{ color: '#ece6d8' }}
              >
                Sign out
                <ChevronRight size={14} style={{ color: '#8a857a' }} aria-hidden />
              </button>
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
}

function SheetSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-2 py-2">
      {title && (
        <p className="px-3 pb-2 text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8a857a' }}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function SheetLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-white/[0.04] transition-colors"
      style={{ color: '#ece6d8' }}
    >
      {label}
      <ChevronRight size={14} style={{ color: '#8a857a' }} aria-hidden />
    </Link>
  );
}
