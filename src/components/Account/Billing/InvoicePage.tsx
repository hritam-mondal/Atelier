import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Receipt } from 'lucide-react';
import { useBilling } from '../../../context/BillingContext';
import { useUser } from '../../../context/UserContext';
import { formatMoney, formatInvoiceDate, brandLabel, isWithinRefundWindow } from '../../../utils/formatInvoice';

export function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useBilling();
  const { dispatch: userDispatch } = useUser();
  const order = state.orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl mb-3" style={{ color: '#ece6d8' }}>Invoice not found</h1>
        <Link
          to="/account/billing"
          className="inline-flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
          style={{ color: '#ece6d8' }}
        >
          <ArrowLeft size={13} aria-hidden /> Back to billing
        </Link>
      </div>
    );
  }

  const refundable = isWithinRefundWindow(order);

  const refund = () => {
    if (!confirm('Refund this order? Your enrollment will be removed.')) return;
    dispatch({ type: 'REFUND_ORDER', orderId: order.id });
    order.items.forEach(line => userDispatch({ type: 'REMOVE_ENROLLMENT', courseId: line.courseId }));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 lg:py-14">
      <Link
        to="/account/billing"
        className="inline-flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity mb-6 print:hidden"
        style={{ color: '#b8b3a7' }}
      >
        <ArrowLeft size={11} aria-hidden /> Back to billing
      </Link>

      <div
        className="rounded-xl p-8 lg:p-10 print:p-12 print:rounded-none print:shadow-none"
        style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}
      >
        <header className="flex items-start justify-between flex-wrap gap-4 mb-8 pb-6 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
          <div>
            <p className="font-display text-2xl tracking-tight" style={{ color: '#ece6d8' }}>
              Atelier<span style={{ color: '#8a857a' }}>.</span>
            </p>
            <p className="text-xs mt-1" style={{ color: '#8a857a' }}>
              247 Hooper Street · Brooklyn, NY 11206
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: '#b8b3a7' }}>
              Invoice
            </p>
            <p className="font-mono text-sm" style={{ color: '#ece6d8' }}>{order.invoiceNumber}</p>
            <p className="text-xs mt-1" style={{ color: '#8a857a' }}>
              {formatInvoiceDate(order.placedAt)}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#b8b3a7' }}>Billed to</p>
            <p className="text-sm" style={{ color: '#ece6d8' }}>{order.items[0]?.instructorName ? 'Sarah Mitchell' : 'Customer'}</p>
            <p className="text-sm" style={{ color: '#ece6d8' }}>{order.billingAddress.line1}</p>
            {order.billingAddress.line2 && <p className="text-sm" style={{ color: '#ece6d8' }}>{order.billingAddress.line2}</p>}
            <p className="text-sm" style={{ color: '#ece6d8' }}>
              {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#b8b3a7' }}>Payment</p>
            <p className="text-sm" style={{ color: '#ece6d8' }}>
              {brandLabel(order.paymentBrand)} •••• {order.paymentLast4}
            </p>
            <p className="text-sm mt-1" style={{ color: order.status === 'refunded' ? '#c5897a' : '#a8c08a' }}>
              {order.status === 'paid' ? 'Paid' : order.status === 'refunded' ? `Refunded ${order.refundedAt ? formatInvoiceDate(order.refundedAt) : ''}` : order.status}
            </p>
          </div>
        </div>

        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'rgba(236,230,216,0.20)' }}>
              <th className="text-left py-2 text-xs tracking-[0.18em] uppercase" style={{ color: '#b8b3a7' }}>Course</th>
              <th className="text-right py-2 text-xs tracking-[0.18em] uppercase" style={{ color: '#b8b3a7' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(line => (
              <tr key={line.courseId} className="border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
                <td className="py-3" style={{ color: '#ece6d8' }}>
                  {line.title}
                  <p className="text-xs" style={{ color: '#8a857a' }}>by {line.instructorName}</p>
                </td>
                <td className="py-3 text-right tabular-nums" style={{ color: '#ece6d8' }}>
                  {formatMoney(line.price - line.discount)}
                  {line.discount > 0 && (
                    <p className="text-xs line-through" style={{ color: '#8a857a' }}>{formatMoney(line.price)}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="space-y-1 text-sm max-w-xs ml-auto">
          <Row label="Subtotal" value={formatMoney(order.subtotal)} />
          {order.discount > 0 && <Row label={order.appliedCouponCode ?? 'Discount'} value={`−${formatMoney(order.discount)}`} accent />}
          <Row label="Tax" value={formatMoney(order.tax)} />
          <div className="h-px my-2" style={{ backgroundColor: 'rgba(236,230,216,0.10)' }} />
          <div className="flex items-center justify-between pt-1">
            <dt className="font-display text-base" style={{ color: '#ece6d8' }}>Total</dt>
            <dd className="font-display text-xl tabular-nums" style={{ color: '#ece6d8' }}>{formatMoney(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-10 pt-6 border-t flex items-center justify-between flex-wrap gap-3 print:hidden" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#8a857a' }}>
            <Receipt size={11} aria-hidden /> Thank you for learning with us.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
              style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
            >
              <Printer size={11} aria-hidden /> Print / save PDF
            </button>
            {refundable && order.status === 'paid' && (
              <button
                onClick={refund}
                className="px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#c5897a' }}
              >
                Request refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt style={{ color: '#b8b3a7' }}>{label}</dt>
      <dd className="tabular-nums" style={{ color: accent ? '#a8c08a' : '#ece6d8' }}>{value}</dd>
    </div>
  );
}
