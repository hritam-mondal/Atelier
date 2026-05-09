export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(price);
}

export function formatDiscount(original: number, discounted: number): number {
  if (original === 0) return 0;
  return Math.round((1 - discounted / original) * 100);
}
