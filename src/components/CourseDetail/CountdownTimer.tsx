import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

interface Props {
  endsAt?: string;
}

export function CountdownTimer({ endsAt }: Props) {
  const { days, hours, minutes, seconds, expired, isUrgent } = useCountdown(endsAt);

  if (!endsAt || expired) return null;

  const display = days > 0
    ? `${days}d ${hours}h ${minutes}m`
    : `${hours}h ${minutes}m ${seconds}s`;

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-medium ${isUrgent ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}
      role="timer"
      aria-live="polite"
      aria-label={`Discount ends in ${display}`}
    >
      <Clock size={13} aria-hidden />
      <span>{display} left at this price!</span>
    </div>
  );
}
