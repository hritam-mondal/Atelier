import type { Order } from '../types/commerce';

export function formatInvoiceDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
}

export function isWithinRefundWindow(order: Order, days = 30): boolean {
  if (order.status !== 'paid') return false;
  const placed = new Date(order.placedAt).getTime();
  const elapsedDays = (Date.now() - placed) / 86_400_000;
  return elapsedDays <= days;
}

export function brandLabel(brand: string): string {
  switch (brand) {
    case 'visa': return 'Visa';
    case 'mastercard': return 'Mastercard';
    case 'amex': return 'American Express';
    case 'discover': return 'Discover';
    default: return 'Card';
  }
}

let invoiceCounter = 9000;
export function nextInvoiceNumber(): string {
  invoiceCounter += 1;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(invoiceCounter).padStart(6, '0')}`;
}
    