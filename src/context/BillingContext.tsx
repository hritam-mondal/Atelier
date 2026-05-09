import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { BillingState, BillingAction } from '../types/commerce';
import { mockPaymentMethods, mockOrders, mockSubscription, mockBillingAddress } from '../data/mockOrders';

const STORAGE_KEY = 'billing-state-v1';

const initial: BillingState = {
  paymentMethods: mockPaymentMethods,
  orders: mockOrders,
  subscription: mockSubscription,
  defaultBillingAddress: mockBillingAddress,
};

function reducer(state: BillingState, action: BillingAction): BillingState {
  switch (action.type) {
    case 'ADD_PAYMENT_METHOD': {
      const method = action.method;
      // If new method is default, demote others
      const existing = method.isDefault
        ? state.paymentMethods.map(m => ({ ...m, isDefault: false }))
        : state.paymentMethods;
      // If there are no methods yet, force default
      const isOnly = existing.length === 0;
      return {
        ...state,
        paymentMethods: [...existing, { ...method, isDefault: method.isDefault || isOnly }],
      };
    }
    case 'REMOVE_PAYMENT_METHOD': {
      const remaining = state.paymentMethods.filter(m => m.id !== action.id);
      // Promote first to default if we removed the default
      if (state.paymentMethods.find(m => m.id === action.id)?.isDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return { ...state, paymentMethods: remaining };
    }
    case 'SET_DEFAULT_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethods: state.paymentMethods.map(m => ({ ...m, isDefault: m.id === action.id })),
      };
    case 'ADD_ORDER':
      return { ...state, orders: [action.order, ...state.orders] };
    case 'REFUND_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.orderId ? { ...o, status: 'refunded' as const, refundedAt: new Date().toISOString() } : o
        ),
      };
    case 'UPDATE_SUBSCRIPTION':
      return { ...state, subscription: action.subscription };
    case 'SET_BILLING_ADDRESS':
      return { ...state, defaultBillingAddress: action.address };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface ContextValue {
  state: BillingState;
  dispatch: React.Dispatch<BillingAction>;
}

const BillingContext = createContext<ContextValue | null>(null);

export function BillingProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling() {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error('useBilling must be used within BillingProvider');
  return ctx;
}
