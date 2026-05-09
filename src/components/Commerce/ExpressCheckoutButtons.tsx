interface Props {
  onSelect: (provider: 'apple' | 'google' | 'paypal') => void;
}

export function ExpressCheckoutButtons({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onSelect('apple')}
        className="py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#000', color: '#fff' }}
      >
         Pay
      </button>
      <button
        type="button"
        onClick={() => onSelect('google')}
        className="py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#fff', color: '#3c4043', border: '1px solid #dadce0' }}
      >
        G Pay
      </button>
      <button
        type="button"
        onClick={() => onSelect('paypal')}
        className="py-3 rounded-lg text-sm font-bold italic hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#ffc439', color: '#003087' }}
      >
        PayPal
      </button>
    </div>
  );
}
