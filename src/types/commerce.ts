export interface CartItem {
  courseId: string;
  addedAt: string;
  priceAtAdd: number;
  discountPriceAtAdd?: number;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  holderName: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderLine {
  courseId: string;
  title: string;
  thumbnail: string;
  instructorName: string;
  price: number;
  discount: number;
}

export type OrderStatus = 'paid' | 'refunded' | 'failed';

export interface Order {
  id: string;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: 'USD';
  status: OrderStatus;
  paymentMethodId: string;
  paymentBrand: CardBrand;
  paymentLast4: string;
  billingAddress: Address;
  placedAt: string;
  refundedAt?: string;
  invoiceNumber: string;
  appliedCouponCode?: string;
}

export interface Subscription {
  id: string;
  plan: 'monthly' | 'annual' | 'team';
  status: 'active' | 'paused' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  pricePerPeriod: number;
}

export interface Coupon {
  code: string;
  kind: 'percent' | 'amount';
  value: number;
  validUntil?: string;
  minSubtotal?: number;
  appliesTo?: string[];
  description: string;
}

export interface AppliedCoupon {
  code: string;
  amount: number;
}

export interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  appliedCoupon: AppliedCoupon | null;
}

export type CartAction =
  | { type: 'ADD'; courseId: string; price: number; discountPrice?: number }
  | { type: 'REMOVE'; courseId: string }
  | { type: 'CLEAR' }
  | { type: 'MOVE_TO_SAVED'; courseId: string }
  | { type: 'MOVE_TO_CART'; courseId: string }
  | { type: 'APPLY_COUPON'; code: string; amount: number }
  | { type: 'REMOVE_COUPON' }
  | { type: 'HYDRATE'; state: Partial<CartState> };

export interface BillingState {
  paymentMethods: PaymentMethod[];
  orders: Order[];
  subscription: Subscription | null;
  defaultBillingAddress: Address | null;
}

export type BillingAction =
  | { type: 'ADD_PAYMENT_METHOD'; method: PaymentMethod }
  | { type: 'REMOVE_PAYMENT_METHOD'; id: string }
  | { type: 'SET_DEFAULT_PAYMENT_METHOD'; id: string }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'REFUND_ORDER'; orderId: string }
  | { type: 'UPDATE_SUBSCRIPTION'; subscription: Subscription | null }
  | { type: 'SET_BILLING_ADDRESS'; address: Address }
  | { type: 'HYDRATE'; state: Partial<BillingState> };
