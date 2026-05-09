import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBilling } from '../../../context/BillingContext';
import { formatMoney, formatInvoiceDate } from '../../../utils/formatInvoice';

export function InvoiceList() {
  const { state } = useBilling();

  return (
    <div>
      <h3 className="font-display tracking-tight text-xl mb-4" style={{ color: '#ece6d8' }}>
        Order history
      </h3>
      {state.orders.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: '#b8b3a7' }}>
          You haven't placed any orders yet.
        </p>
      ) : (
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(236,230,216,0.10)' }}
        >
          {state.orders.map(order => (
            <Link
              key={order.id}
              to={`/account/billing/invoices/${order.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors border-b last:border-b-0"
              style={{ borderColor: 'rgba(236,230,216,0.10)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs" style={{ color: '#ece6d8' }}>
                  {order.invoiceNumber}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8a857a' }}>
                  {formatInvoiceDate(order.placedAt)} · {order.items.length} {order.items.length === 1 ? 'course' : 'courses'}
                </p>
              </div>
              <span
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: order.status === 'refunded' ? 'rgba(197,137,122,0.12)' : 'rgba(168,192,138,0.12)',
                  color: order.status === 'refunded' ? '#c5897a' : '#a8c08a',
                }}
              >
                {order.status}
              </span>
              <span className="font-display text-base shrink-0 tabular-nums" style={{ color: '#ece6d8' }}>
                {formatMoney(order.total)}
              </span>
              <ChevronRight size={14} style={{ color: '#8a857a' }} aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
