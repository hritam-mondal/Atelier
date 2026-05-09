import { formatPrice, formatDiscount } from '../../utils/formatPrice';

interface PriceTagProps {
  price: number;
  discountPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({ price, discountPrice, size = 'md' }: PriceTagProps) {
  const isFree = price === 0;
  const hasDiscount = discountPrice !== undefined && discountPrice < price;
  const effective = hasDiscount ? discountPrice! : price;
  const discount = hasDiscount ? formatDiscount(price, discountPrice!) : 0;

  const mainCls = size === 'sm' ? 'text-sm font-bold' : size === 'lg' ? 'text-2xl font-bold' : 'text-base font-bold';
  const strikeClx = size === 'sm' ? 'text-xs' : 'text-sm';

  if (isFree) {
    return <span className={`${mainCls} text-emerald-400`}>Free</span>;
  }

  return (
    <div className="flex items-baseline gap-1.5 flex-wrap">
      <span className={`${mainCls} text-white`}>{formatPrice(effective)}</span>
      {hasDiscount && (
        <>
          <span className={`${strikeClx} text-gray-400 line-through`}>{formatPrice(price)}</span>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-medium">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
