import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { CartState, CartAction, CartItem, AppliedCoupon } from '../types/commerce';
import type { CatalogCourse } from '../types/catalog';
import { findCoupon } from '../data/mockCoupons';
import { computeTax } from '../utils/computeTax';

const STORAGE_KEY = 'cart-state-v1';

const initial: CartState = {
  items: [],
  savedForLater: [],
  appliedCoupon: null,
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      if (state.items.some(i => i.courseId === action.courseId)) return state;
      const next: CartItem = {
        courseId: action.courseId,
        addedAt: new Date().toISOString(),
        priceAtAdd: action.price,
        discountPriceAtAdd: action.discountPrice,
      };
      // If it was in savedForLater, remove it from there
      return {
        ...state,
        items: [...state.items, next],
        savedForLater: state.savedForLater.filter(i => i.courseId !== action.courseId),
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.courseId !== action.courseId) };
    case 'CLEAR':
      return { ...state, items: [], appliedCoupon: null };
    case 'MOVE_TO_SAVED': {
      const item = state.items.find(i => i.courseId === action.courseId);
      if (!item) return state;
      return {
        ...state,
        items: state.items.filter(i => i.courseId !== action.courseId),
        savedForLater: state.savedForLater.some(i => i.courseId === item.courseId)
          ? state.savedForLater
          : [...state.savedForLater, item],
      };
    }
    case 'MOVE_TO_CART': {
      const item = state.savedForLater.find(i => i.courseId === action.courseId);
      if (!item) return state;
      return {
        ...state,
        savedForLater: state.savedForLater.filter(i => i.courseId !== action.courseId),
        items: state.items.some(i => i.courseId === item.courseId)
          ? state.items
          : [...state.items, item],
      };
    }
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: { code: action.code, amount: action.amount } };
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface CartTotals {
  subtotal: number;
  discount: number;          // sum of per-item discount + coupon
  itemDiscount: number;      // discount from per-item discountPrice (separate)
  couponDiscount: number;
  taxable: number;
  tax: number;
  total: number;
  itemCount: number;
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  has: (courseId: string) => boolean;
  isSaved: (courseId: string) => boolean;
  totals: (state2?: string) => CartTotals;
  applyCouponCode: (code: string) => { ok: true; amount: number } | { ok: false; reason: string };
  resolvedItems: (allCourses: CatalogCourse[]) => Array<{ item: CartItem; course: CatalogCourse }>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) });
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const has = (courseId: string) => state.items.some(i => i.courseId === courseId);
    const isSaved = (courseId: string) => state.savedForLater.some(i => i.courseId === courseId);

    const totals = (taxState?: string): CartTotals => {
      const subtotal = state.items.reduce((s, i) => s + i.priceAtAdd, 0);
      const itemDiscount = state.items.reduce((s, i) => s + (i.discountPriceAtAdd !== undefined ? (i.priceAtAdd - i.discountPriceAtAdd) : 0), 0);
      const couponDiscount = state.appliedCoupon?.amount ?? 0;
      const discount = itemDiscount + couponDiscount;
      const taxable = Math.max(0, subtotal - discount);
      const tax = taxState ? computeTax(taxable, taxState) : 0;
      const total = taxable + tax;
      return {
        subtotal,
        discount,
        itemDiscount,
        couponDiscount,
        taxable,
        tax,
        total,
        itemCount: state.items.length,
      };
    };

    const applyCouponCode = (raw: string): { ok: true; amount: number } | { ok: false; reason: string } => {
      const coupon = findCoupon(raw);
      if (!coupon) return { ok: false, reason: 'Coupon code not recognised.' };
      if (coupon.validUntil && new Date(coupon.validUntil).getTime() < Date.now()) {
        return { ok: false, reason: 'This coupon has expired.' };
      }
      const subtotalAfterItemDiscount = state.items.reduce((s, i) => s + (i.discountPriceAtAdd ?? i.priceAtAdd), 0);
      if (coupon.minSubtotal && subtotalAfterItemDiscount < coupon.minSubtotal) {
        return { ok: false, reason: `Minimum order of $${coupon.minSubtotal} required.` };
      }
      const amount = coupon.kind === 'percent'
        ? Math.round(subtotalAfterItemDiscount * (coupon.value / 100) * 100) / 100
        : Math.min(coupon.value, subtotalAfterItemDiscount);
      dispatch({ type: 'APPLY_COUPON', code: coupon.code, amount });
      return { ok: true, amount };
    };

    const resolvedItems = (allCourses: CatalogCourse[]) => {
      const byId = new Map(allCourses.map(c => [c.id, c]));
      return state.items
        .map(item => {
          const course = byId.get(item.courseId);
          return course ? { item, course } : null;
        })
        .filter((x): x is { item: CartItem; course: CatalogCourse } => x !== null);
    };

    return { state, dispatch, has, isSaved, totals, applyCouponCode, resolvedItems };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
