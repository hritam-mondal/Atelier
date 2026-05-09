import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Mail, Receipt } from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { formatMoney, formatInvoiceDate, brandLabel } from '../../utils/formatInvoice';

export function OrderConfirmationPage() {
  const [params] = useSearchParams();
  const orderId = params.get('order');
  const { state } = useBilling();
  const order = state.orders.find(o => o.id === orderId);

  // Confetti spans (CSS-only)
  const confetti = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      key: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 1.5,
      hue: ['#ece6d8', '#d6cfbe', '#a8c08a', '#c5897a', '#d8c594'][i % 5],
    })),
    []
  );

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
          We couldn't find that order.
        </h1>
        <Link
          to="/learning"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          Go to your courses <ArrowRight size={13} aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Confetti layer */}
      <div className="absolute inset-x-0 top-0 h-[80vh] pointer-events-none overflow-hidden" aria-hidden>
        {confetti.map(c => (
          <span
            key={c.key}
            className="absolute block"
            style={{
              top: '-20px',
              left: `${c.left}%`,
              width: 6, height: 14,
              backgroundColor: c.hue,
              borderRadius: 1,
              animation: `fall ${c.duration}s ${c.delay}s ease-in forwards`,
              opacity: 0,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(85vh) rotate(540deg); opacity: 0; }
        }
      `}</style>

      <div className="relative max-w-3xl mx-auto px-6 py-16 lg:py-24 text-center">
        <div
          className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(168,192,138,0.15)' }}
          aria-hidden
        >
          <CheckCircle2 size={32} style={{ color: '#a8c08a' }} />
        </div>
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; You're in
        </p>
        <h1 className="font-display text-4xl lg:text-6xl tracking-tight leading-tight mb-4" style={{ color: '#ece6d8' }}>
          Welcome to <span className="italic font-light" style={{ color: '#b8b3a7' }}>the work</span>.
        </h1>
        <p className="text-base lg:text-lg leading-relaxed mb-2 max-w-xl mx-auto" style={{ color: '#b8b3a7' }}>
          Your order is confirmed and your courses are ready.
        </p>
        <p className="text-xs flex items-center justify-center gap-2" style={{ color: '#8a857a' }}>
          <Mail size={11} aria-hidden /> A receipt is in your inbox.
        </p>
      </div>

      {/* Course list */}
      <div className="relative max-w-3xl mx-auto px-6 pb-16">
        <h2 className="font-display tracking-tight text-2xl mb-5 text-center" style={{ color: '#ece6d8' }}>
          Start with your first lecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {order.items.map(item => (
            <Link
              key={item.courseId}
              to="/player"
              className="rounded-xl p-4 hover:opacity-90 transition-opacity flex gap-3"
              style={{
                border: '1px solid rgba(236,230,216,0.10)',
                backgroundColor: 'rgba(236,230,216,0.04)',
              }}
            >
              <div className="shrink-0 w-20 aspect-video rounded overflow-hidden bg-black">
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug truncate" style={{ color: '#ece6d8' }}>{item.title}</p>
                <p className="text-xs" style={{ color: '#8a857a' }}>{item.instructorName}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#ece6d8' }}>
                  Begin lecture <ArrowRight size={11} aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Receipt summary */}
        <div
          className="mt-10 rounded-xl p-6"
          style={{
            border: '1px solid rgba(236,230,216,0.10)',
            backgroundColor: 'rgba(236,230,216,0.02)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display tracking-tight text-lg" style={{ color: '#ece6d8' }}>
              Order details
            </h3>
            <Link
              to={`/account/billing/invoices/${order.id}`}
              className="inline-flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
              style={{ color: '#ece6d8' }}
            >
              <Receipt size={11} aria-hidden /> View invoice
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt style={{ color: '#8a857a' }}>Order number</dt>
            <dd className="text-right font-mono" style={{ color: '#ece6d8' }}>{order.invoiceNumber}</dd>
            <dt style={{ color: '#8a857a' }}>Placed</dt>
            <dd className="text-right" style={{ color: '#ece6d8' }}>{formatInvoiceDate(order.placedAt)}</dd>
            <dt style={{ color: '#8a857a' }}>Payment</dt>
            <dd className="text-right" style={{ color: '#ece6d8' }}>
              {brandLabel(order.paymentBrand)} •••• {order.paymentLast4}
            </dd>
            <dt style={{ color: '#8a857a' }}>Total charged</dt>
            <dd className="text-right font-display text-base" style={{ color: '#ece6d8' }}>
              {formatMoney(order.total)}
            </dd>
          </dl>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/learning"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            Go to my learning <ArrowRight size={14} aria-hidden />
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
          >
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
