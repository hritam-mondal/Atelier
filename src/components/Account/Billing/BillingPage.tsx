import { SubscriptionCard } from './SubscriptionCard';
import { PaymentMethodList } from './PaymentMethodList';
import { InvoiceList } from './InvoiceList';

export function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
        ✦ &nbsp; Account
      </p>
      <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-8" style={{ color: '#ece6d8' }}>
        Billing.
      </h1>

      <div className="space-y-12">
        <SubscriptionCard />
        <PaymentMethodList />
        <InvoiceList />
      </div>
    </div>
  );
}
