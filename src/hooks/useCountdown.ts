import { useEffect, useState } from 'react';

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  expired: boolean;
  isUrgent: boolean; // < 24h remaining
}

function compute(target: number): CountdownValue {
  const totalMs = Math.max(0, target - Date.now());
  const expired = totalMs <= 0;
  const days = Math.floor(totalMs / 86_400_000);
  const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  const isUrgent = !expired && totalMs < 86_400_000;
  return { days, hours, minutes, seconds, totalMs, expired, isUrgent };
}

export function useCountdown(targetIso?: string): CountdownValue {
  const target = targetIso ? new Date(targetIso).getTime() : 0;
  const [value, setValue] = useState<CountdownValue>(() => compute(target));

  useEffect(() => {
    if (!targetIso) return;
    setValue(compute(target));
    const id = setInterval(() => {
      const next = compute(target);
      setValue(next);
      if (next.expired) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target, targetIso]);

  return value;
}
