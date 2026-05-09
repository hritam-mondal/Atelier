import type { Coupon } from '../types/commerce';

export const mockCoupons: Coupon[] = [
  { code: 'WELCOME10',    kind: 'percent', value: 10, description: '10% off your first order' },
  { code: 'SPRING25',     kind: 'percent', value: 25, minSubtotal: 30, description: '25% off orders over $30' },
  { code: 'BLACKFRIDAY',  kind: 'percent', value: 50, description: '50% off everything · limited time' },
  { code: 'BUNDLE5',      kind: 'amount',  value: 5,  description: '$5 off your bundle' },
  { code: 'FRIEND15',     kind: 'percent', value: 15, description: 'Friend referral · 15% off' },
];

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return mockCoupons.find(c => c.code === normalized);
}
