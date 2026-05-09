import type { DailyMinuteEntry } from '../types/dashboard';

/**
 * Computes the current streak as the count of consecutive days (ending today
 * or yesterday) with > 0 minutes logged. If neither today nor yesterday has
 * activity, the streak is 0.
 */
export function computeStreak(daily: DailyMinuteEntry[]): number {
  const byDate = new Map(daily.map(d => [d.date, d.minutes]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOffset =
    (byDate.get(toIso(today)) ?? 0) > 0 ? 0 :
    (byDate.get(toIso(addDays(today, -1))) ?? 0) > 0 ? 1 :
    -1;

  if (startOffset === -1) return 0;

  let streak = 0;
  let cursor = addDays(today, -startOffset);
  while ((byDate.get(toIso(cursor)) ?? 0) > 0) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function computeLongestStreak(daily: DailyMinuteEntry[]): number {
  const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));
  let best = 0, current = 0;
  let prevDate: Date | null = null;
  for (const entry of sorted) {
    if (entry.minutes <= 0) {
      current = 0;
      prevDate = null;
      continue;
    }
    const d = new Date(entry.date);
    if (prevDate && (d.getTime() - prevDate.getTime()) === 86_400_000) current += 1;
    else current = 1;
    best = Math.max(best, current);
    prevDate = d;
  }
  return best;
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}
function toIso(d: Date): string {
  return d.toISOString().split('T')[0];
}
