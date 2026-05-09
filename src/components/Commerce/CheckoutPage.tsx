import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useBilling } from '../../context/BillingContext';
import { useUser } from '../../context/UserContext';
import { PaymentMethodForm, type PaymentDraft } from './PaymentMethodForm';
import { BillingAddressForm } from './BillingAddressForm';
import { ExpressCheckoutButtons } from './ExpressCheckoutButtons';
import { CouponInput } from './CouponInput';
import { formatMoney, brandLabel, nextInvoiceNumber } from '../../utils/formatInvoice';
import type { Address, Order, OrderLine, PaymentMethod } from '../../types/commerce';
import rawCatalog from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';

const allCourses = rawCatalog as CatalogCourse[];

const BLANK_PAYMENT: PaymentDraft = {
  number: '', expMonth: 0, expYear: 0, cvc: '', zip: '', holderName: '', brand: 'unknown',
};

const BLANK_ADDRESS: Address = {
  line1: '', city: '', state: '', postalCode: '', country: 'US',
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { state: cart, totals, dispatch: cartDispatch, resolvedItems } = useCart();
  const { state: billing, dispatch: billingDispatch } = useBilling();
  const { dispatch: userDispatch } = useUser();

  const [savedMethodId, setSavedMethodId] = useState<string>(billing.paymentMethods.find(m => m.isDefault)?.id ?? '');
  const [useNewCard, setUseNewCard] = useState(billing.paymentMethods.length === 0);
  const [payment, setPayment] = useState<PaymentDraft>(BLANK_PAYMENT);
  const [address, setAddress] = useState<Address>(billing.defaultBillingAddress ?? BLANK_ADDRESS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);

  const items = resolvedItems(allCourses);
  const t = totals(address.state || 'NY');

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
          Nothing to checkout.
        </h1>
        <p className="text-sm mb-8" style={{ color: '#b8b3a7' }}>
          Add a course to your cart first.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Browse catalog
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (useNewCard) {
      if (!payment.holderName.trim()) e.holderName = 'Required';
      if (payment.number.length < 13) e.number = 'Card number incomplete';
      if (!payment.expMonth || payment.expMonth < 1 || payment.expMonth > 12) e.expMonth = 'Invalid';
      if (!payment.expYear || payment.expYear < new Date().getFullYear()) e.expMonth = 'Card expired';
      if (payment.cvc.length < 3) e.cvc = 'Invalid';
      if (payment.zip.length < 5) e.zip = 'Invalid';
    }
    if (!address.line1.trim()) e.line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state.trim()) e.state = 'Required';
    if (!address.postalCode.trim()) e.postalCode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleExpressCheckout = (provider: 'apple' | 'google' | 'paypal') => {
    // Simulated express checkout: jump straight to confirmation with express-pay flag
    if (!address.line1) setAddress({ ...address, line1: '1 Express Way', city: 'New York', state: 'NY', postalCode: '10001' });
    // Reuse default payment method or insert a stub
    const fauxPayment: PaymentMethod = {
      id: `pm_express_${provider}`,
      brand: 'visa',
      last4: provider === 'apple' ? '4567' : provider === 'google' ? '8901' : '0000',
      expMonth: 12, expYear: 2030,
      isDefault: false,
      holderName: provider === 'paypal' ? 'PayPal' : 'Express',
    };
    completeOrder(fauxPayment);
  };

  const completeOrder = (paymentMethod: PaymentMethod) => {
    setSubmitting(true);

    // Simulated 1-in-5 failure rate via known test card
    if (useNewCard && payment.number === '4000000000000002') {
      setTimeout(() => {
        setSubmitting(false);
        setErrors({ number: 'Your card was declined. Try another card.' });
      }, 800);
      return;
    }

    setTimeout(() => {
      const lines: OrderLine[] = items.map(({ item, course }) => ({
        courseId: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        instructorName: course.instructor.name,
        price: item.priceAtAdd,
        discount: item.priceAtAdd - (item.discountPriceAtAdd ?? item.priceAtAdd),
      }));
      const order: Order = {
        id: `ord_${Date.now()}`,
        items: lines,
        subtotal: t.subtotal,
        discount: t.discount,
        tax: t.tax,
        total: t.total,
        currency: 'USD',
        status: 'paid',
        paymentMethodId: paymentMethod.id,
        paymentBrand: paymentMethod.brand,
        paymentLast4: paymentMethod.last4,
        billingAddress: address,
        placedAt: new Date().toISOString(),
        invoiceNumber: nextInvoiceNumber(),
        appliedCouponCode: cart.appliedCoupon?.code,
      };
      billingDispatch({ type: 'ADD_ORDER', order });
      if (useNewCard && savePaymentMethod) {
        billingDispatch({ type: 'ADD_PAYMENT_METHOD', method: paymentMethod });
      }
      billingDispatch({ type: 'SET_BILLING_ADDRESS', address });
      // Enroll courses
      items.forEach(({ course }) => userDispatch({ type: 'ENROLL_COURSE', courseId: course.id }));
      // Empty cart
      cartDispatch({ type: 'CLEAR' });
      // Navigate
      navigate(`/checkout/success?order=${order.id}`);
    }, 1100);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let paymentMethod: PaymentMethod;
    if (useNewCard) {
      paymentMethod = {
        id: `pm_${Date.now()}`,
        brand: payment.brand === 'unknown' ? 'visa' : payment.brand,
        last4: payment.number.slice(-4),
        expMonth: payment.expMonth,
        expYear: payment.expYear,
        isDefault: billing.paymentMethods.length === 0 || savePaymentMethod,
        holderName: payment.holderName,
      };
    } else {
      const existing = billing.paymentMethods.find(m => m.id === savedMethodId);
      if (!existing) {
        setErrors({ savedMethod: 'Pick a card or add a new one' });
        return;
      }
      paymentMethod = existing;
    }

    completeOrder(paymentMethod);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity mb-4"
        style={{ color: '#b8b3a7' }}
      >
        <ArrowLeft size={11} aria-hidden /> Back to cart
      </Link>
      <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
        ✦ &nbsp; Checkout
      </p>
      <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-8" style={{ color: '#ece6d8' }}>
        Almost <span className="italic font-light" style={{ color: '#b8b3a7' }}>there</span>.
      </h1>

      <form onSubmit={handleCardSubmit} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-10">
        <div className="space-y-8">
          {/* Express checkout */}
          <section>
            <h2 className="font-display text-xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
              Express checkout
            </h2>
            <ExpressCheckoutButtons onSelect={handleExpressCheckout} />
            <div className="mt-6 flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8a857a' }}>
              <span className="flex-1 h-px" style={{ backgroundColor: 'rgba(236,230,216,0.10)' }} />
              Or pay with card
              <span className="flex-1 h-px" style={{ backgroundColor: 'rgba(236,230,216,0.10)' }} />
            </div>
          </section>

          {/* Saved methods */}
          {billing.paymentMethods.length > 0 && (
            <section>
              <h2 className="font-display text-xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
                Payment method
              </h2>
              <div className="space-y-2">
                {billing.paymentMethods.map(m => (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer"
                    style={{
                      border: !useNewCard && savedMethodId === m.id ? '1px solid rgba(236,230,216,0.5)' : '1px solid rgba(236,230,216,0.15)',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={!useNewCard && savedMethodId === m.id}
                      onChange={() => { setUseNewCard(false); setSavedMethodId(m.id); }}
                      className="accent-[#ece6d8]"
                    />
                    <span className="text-sm flex-1" style={{ color: '#ece6d8' }}>
                      {brandLabel(m.brand)} ending in {m.last4}
                    </span>
                    <span className="text-xs" style={{ color: '#8a857a' }}>
                      {String(m.expMonth).padStart(2, '0')}/{String(m.expYear).slice(-2)}
                    </span>
                    {m.isDefault && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}>
                        Default
                      </span>
                    )}
                  </label>
                ))}
                <label
                  className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer"
                  style={{
                    border: useNewCard ? '1px solid rgba(236,230,216,0.5)' : '1px solid rgba(236,230,216,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={useNewCard}
                    onChange={() => setUseNewCard(true)}
                    className="accent-[#ece6d8]"
                  />
                  <span className="text-sm" style={{ color: '#ece6d8' }}>
                    Pay with new card
                  </span>
                </label>
              </div>
            </section>
          )}

          {/* New card form */}
          {useNewCard && (
            <section>
              {billing.paymentMethods.length === 0 && (
                <h2 className="font-display text-xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
                  Card details
                </h2>
              )}
              <PaymentMethodForm
                value={payment}
                onChange={setPayment}
                errors={errors as Partial<Record<keyof PaymentDraft, string>>}
              />
              <label className="mt-3 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={savePaymentMethod}
                  onChange={e => setSavePaymentMethod(e.target.checked)}
                  className="accent-[#ece6d8]"
                />
                <span className="text-xs" style={{ color: '#b8b3a7' }}>Save this card for future purchases</span>
              </label>
              <p className="mt-2 text-[11px]" style={{ color: '#8a857a' }}>
                <Lock size={9} className="inline mr-1" aria-hidden />
                Tip: use card <span className="font-mono">4000 0000 0000 0002</span> to test a decline.
              </p>
            </section>
          )}

          {/* Billing address */}
          <section>
            <h2 className="font-display text-xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
              Billing address
            </h2>
            <BillingAddressForm
              value={address}
              onChange={setAddress}
              errors={errors as Partial<Record<keyof Address, string>>}
            />
          </section>
        </div>

        {/* Order summary */}
        <aside
          className="rounded-xl p-6 self-start lg:sticky lg:top-24"
          style={{
            backgroundColor: 'rgba(236,230,216,0.04)',
            border: '1px solid rgba(236,230,216,0.10)',
          }}
        >
          <h2 className="font-display text-xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
            Order summary
          </h2>

          <ul className="space-y-3 mb-5">
            {items.map(({ course, item }) => (
              <li key={course.id} className="flex gap-3">
                <div className="shrink-0 w-12 aspect-video rounded overflow-hidden bg-black">
                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug truncate" style={{ color: '#ece6d8' }}>{course.title}</p>
                  <p className="text-[11px]" style={{ color: '#8a857a' }}>{course.instructor.name}</p>
                </div>
                <div className="text-xs tabular-nums shrink-0" style={{ color: '#ece6d8' }}>
                  {formatMoney(item.discountPriceAtAdd ?? item.priceAtAdd)}
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t space-y-2 text-sm" style={{ color: '#b8b3a7', borderColor: 'rgba(236,230,216,0.10)' }}>
            <Row label="Subtotal" value={formatMoney(t.subtotal)} />
            {t.discount > 0 && <Row label="Discount" value={`−${formatMoney(t.discount)}`} accent />}
            <Row label={`Tax (${address.state || '—'})`} value={formatMoney(t.tax)} />
          </div>

          <div className="mt-4 mb-5">
            <CouponInput />
          </div>

          <div className="pt-4 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-display text-base" style={{ color: '#ece6d8' }}>Total</span>
              <span className="font-display text-2xl" style={{ color: '#ece6d8' }}>{formatMoney(t.total)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              {submitting ? 'Processing…' : <>Pay {formatMoney(t.total)}</>}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: '#8a857a' }}>
            <ShieldCheck size={11} aria-hidden /> 30-day money-back guarantee
          </div>
        </aside>
      </form>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="tabular-nums" style={{ color: accent ? '#a8c08a' : '#ece6d8' }}>{value}</span>
    </div>
  );
}
