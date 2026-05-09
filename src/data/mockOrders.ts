import type { Order, Subscription, PaymentMethod, Address } from '../types/commerce';

const DAY_MS = 86_400_000;

function isoDate(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * DAY_MS).toISOString();
}

export const mockBillingAddress: Address = {
  line1: '247 Hooper Street',
  line2: 'Apt 4B',
  city: 'Brooklyn',
  state: 'NY',
  postalCode: '11206',
  country: 'US',
};

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2027,
    isDefault: true,
    holderName: 'Sarah Mitchell',
  },
  {
    id: 'pm_2',
    brand: 'mastercard',
    last4: '5555',
    expMonth: 8,
    expYear: 2026,
    isDefault: false,
    holderName: 'Sarah Mitchell',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord_001',
    items: [
      { courseId: 'c001', title: 'Complete React Developer in 2024', thumbnail: 'https://picsum.photos/seed/react2024/120/68', instructorName: 'Sarah Chen', price: 89.99, discount: 75 },
    ],
    subtotal: 89.99, discount: 75, tax: 1.34, total: 16.33, currency: 'USD',
    status: 'paid', paymentMethodId: 'pm_1', paymentBrand: 'visa', paymentLast4: '4242',
    billingAddress: mockBillingAddress, placedAt: isoDate(45), invoiceNumber: 'INV-2025-001247',
    appliedCouponCode: 'WELCOME10',
  },
  {
    id: 'ord_002',
    items: [
      { courseId: 'c020', title: 'Next.js 14 Full-Stack Development', thumbnail: 'https://picsum.photos/seed/nextjs/120/68', instructorName: 'Sarah Chen', price: 94.99, discount: 80 },
    ],
    subtotal: 94.99, discount: 80, tax: 1.27, total: 16.26, currency: 'USD',
    status: 'paid', paymentMethodId: 'pm_1', paymentBrand: 'visa', paymentLast4: '4242',
    billingAddress: mockBillingAddress, placedAt: isoDate(60), invoiceNumber: 'INV-2025-000892',
  },
  {
    id: 'ord_003',
    items: [
      { courseId: 'c042', title: 'TypeScript: Advanced Patterns', thumbnail: 'https://picsum.photos/seed/typescript/120/68', instructorName: 'Sarah Chen', price: 79.99, discount: 67 },
      { courseId: 'c027', title: 'Power BI: Business Analytics', thumbnail: 'https://picsum.photos/seed/powerbi/120/68', instructorName: 'Rachel Torres', price: 79.99, discount: 67 },
    ],
    subtotal: 159.98, discount: 134, tax: 2.31, total: 28.29, currency: 'USD',
    status: 'paid', paymentMethodId: 'pm_1', paymentBrand: 'visa', paymentLast4: '4242',
    billingAddress: mockBillingAddress, placedAt: isoDate(70), invoiceNumber: 'INV-2025-000731',
  },
  {
    id: 'ord_004',
    items: [
      { courseId: 'c011', title: 'Vue.js – The Complete Guide', thumbnail: 'https://picsum.photos/seed/vue3/120/68', instructorName: 'Maximilian Müller', price: 84.99, discount: 71 },
    ],
    subtotal: 84.99, discount: 71, tax: 1.24, total: 15.23, currency: 'USD',
    status: 'paid', paymentMethodId: 'pm_2', paymentBrand: 'mastercard', paymentLast4: '5555',
    billingAddress: mockBillingAddress, placedAt: isoDate(28), invoiceNumber: 'INV-2025-002104',
  },
  {
    id: 'ord_005',
    items: [
      { courseId: 'c003', title: 'Python for Data Science Bootcamp', thumbnail: 'https://picsum.photos/seed/pydata/120/68', instructorName: 'Priya Sharma', price: 94.99, discount: 79 },
    ],
    subtotal: 94.99, discount: 79, tax: 1.42, total: 17.41, currency: 'USD',
    status: 'paid', paymentMethodId: 'pm_1', paymentBrand: 'visa', paymentLast4: '4242',
    billingAddress: mockBillingAddress, placedAt: isoDate(32), invoiceNumber: 'INV-2025-001892',
  },
];

export const mockSubscription: Subscription = {
  id: 'sub_001',
  plan: 'monthly',
  status: 'active',
  currentPeriodEnd: isoDate(-12), // 12 days from now
  cancelAtPeriodEnd: false,
  pricePerPeriod: 24,
};
