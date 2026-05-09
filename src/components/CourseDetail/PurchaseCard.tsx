import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, Gift, Tag, Check, Award, Tv, Smartphone, Download, Code2, Infinity as InfinityIcon, FileVideo, ChevronDown } from 'lucide-react';
import { PreviewVideoPlayer } from './PreviewVideoPlayer';
import { CountdownTimer } from './CountdownTimer';
import { PriceTag } from '../shared/PriceTag';
import { useCart } from '../../context/CartContext';
import type { CourseDetail } from '../../types/courseDetail';

interface Props {
  course: CourseDetail;
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  video: <FileVideo size={14} />,
  resources: <Download size={14} />,
  exercises: <Code2 size={14} />,
  lifetime: <InfinityIcon size={14} />,
  mobile: <Smartphone size={14} />,
  tv: <Tv size={14} />,
  certificate: <Award size={14} />,
};

function iconFor(feature: string) {
  const f = feature.toLowerCase();
  if (f.includes('video')) return FEATURE_ICONS.video;
  if (f.includes('resource')) return FEATURE_ICONS.resources;
  if (f.includes('exercise')) return FEATURE_ICONS.exercises;
  if (f.includes('lifetime')) return FEATURE_ICONS.lifetime;
  if (f.includes('mobile') && f.includes('tv')) return FEATURE_ICONS.mobile;
  if (f.includes('mobile')) return FEATURE_ICONS.mobile;
  if (f.includes('tv')) return FEATURE_ICONS.tv;
  if (f.includes('certificate')) return FEATURE_ICONS.certificate;
  return <Check size={14} />;
}

export function PurchaseCard({ course }: Props) {
  const navigate = useNavigate();
  const { dispatch: cartDispatch, has: cartHas } = useCart();
  const initialState = cartHas(course.id) ? 'in-cart' : 'idle';
  const [cartState, setCartState] = useState<'idle' | 'added' | 'in-cart'>(initialState);
  const [wishlisted, setWishlisted] = useState<boolean>(() => {
    try { return localStorage.getItem(`wishlist:${course.id}`) === '1'; } catch { return false; }
  });
  const [bounce, setBounce] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Persist wishlist
  useEffect(() => {
    try { localStorage.setItem(`wishlist:${course.id}`, wishlisted ? '1' : '0'); } catch { /* noop */ }
  }, [wishlisted, course.id]);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAddToCart = () => {
    if (cartState === 'in-cart') {
      navigate('/cart');
      return;
    }
    cartDispatch({ type: 'ADD', courseId: course.id, price: course.price, discountPrice: course.discountPrice });
    setCartState('added');
    setToast('Added to cart');
    setTimeout(() => setCartState('in-cart'), 1500);
  };

  const handleBuyNow = () => {
    if (!cartHas(course.id)) {
      cartDispatch({ type: 'ADD', courseId: course.id, price: course.price, discountPrice: course.discountPrice });
    }
    navigate('/checkout');
  };

  const handleWishlist = () => {
    const next = !wishlisted;
    setWishlisted(next);
    if (next) {
      setBounce(true);
      setToast('Added to wishlist');
      setTimeout(() => setBounce(false), 350);
    } else {
      setToast('Removed from wishlist');
    }
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponApplied(true);
    setToast(`"${couponCode.toUpperCase()}" — 10% off applied`);
    setCouponCode('');
  };

  return (
    <div
      className="rounded-xl border border-white/10 overflow-hidden shadow-2xl"
      style={{ backgroundColor: '#22252b' }}
    >
      {/* Preview video */}
      <PreviewVideoPlayer videoUrl={course.previewVideoUrl} thumbnail={course.previewThumbnail} rounded />

      <div className="p-5">
        {/* Price */}
        <div className="mb-2">
          <PriceTag price={course.price} discountPrice={course.discountPrice} size="lg" />
        </div>
        <CountdownTimer endsAt={course.discountEndsAt} />

        {/* Primary CTA */}
        <button
          onClick={handleAddToCart}
          disabled={cartState === 'added'}
          className="mt-4 w-full py-3 rounded-full font-semibold text-sm transition-all hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none disabled:opacity-80"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          {cartState === 'idle' && 'Add to Cart'}
          {cartState === 'added' && (
            <span className="inline-flex items-center justify-center gap-1.5">
              <Check size={16} /> Added
            </span>
          )}
          {cartState === 'in-cart' && 'Go to cart →'}
        </button>

        {/* Secondary CTA + heart */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 rounded-full font-semibold text-sm hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
            style={{ border: '1px solid rgba(236,230,216,0.30)', color: '#ece6d8' }}
          >
            Buy Now
          </button>
          <button
            onClick={handleWishlist}
            className={`shrink-0 w-12 h-12 rounded-lg border border-white/30 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none ${bounce ? 'scale-110' : 'scale-100'}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wishlisted}
          >
            <Heart
              size={18}
              className={wishlisted ? 'text-rose-500' : 'text-white'}
              fill={wishlisted ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <p className="mt-3 text-xs text-center text-slate-400">
          30-Day Money-Back Guarantee
        </p>
        <p className="text-xs text-center text-slate-500">Full Lifetime Access</p>

        {/* Features */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">This course includes:</h3>
          <ul className="space-y-2">
            {course.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="text-slate-500 shrink-0">{iconFor(feature)}</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Share / Gift */}
        <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-around text-xs text-slate-300">
          <button className="flex items-center gap-1.5 hover:text-white transition-colors" aria-label="Share this course">
            <Share2 size={13} aria-hidden /> Share
          </button>
          <button className="flex items-center gap-1.5 hover:text-white transition-colors" aria-label="Gift this course">
            <Gift size={13} aria-hidden /> Gift this course
          </button>
        </div>

        {/* Coupon */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <button
            onClick={() => setCouponOpen(o => !o)}
            className="flex items-center gap-1.5 text-xs text-violet-300 hover:text-violet-200 font-medium"
            aria-expanded={couponOpen}
          >
            <Tag size={13} aria-hidden />
            Apply Coupon
            <ChevronDown size={13} className={`transition-transform ${couponOpen ? 'rotate-180' : ''}`} />
          </button>
          {couponOpen && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') applyCoupon(); }}
                placeholder="Enter coupon"
                className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 border border-white/20 focus:border-violet-500 focus:outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                aria-label="Coupon code"
              />
              <button
                onClick={applyCoupon}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-white/30 text-white hover:bg-white/5 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
          {couponApplied && (
            <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
              <Check size={12} aria-hidden /> Coupon applied successfully
            </p>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm shadow-2xl pointer-events-none"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
