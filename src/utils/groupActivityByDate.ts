import type { ActivityEvent } from '../types/dashboard';

export interface ActivityGroup {
  label: string;
  events: ActivityEvent[];
}

const DAY_MS = 86_400_000;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function groupActivityByDate(events: ActivityEvent[]): ActivityGroup[] {
  const today = startOfDay(new Date()).getTime();
  const groups: Record<string, ActivityEvent[]> = {};

  for (const e of events) {
    const eventDay = startOfDay(new Date(e.timestamp)).getTime();
    const diffDays = Math.round((today - eventDay) / DAY_MS);
    let label: string;
    if (diffDays === 0)      label = 'Today';
    else if (diffDays === 1) label = 'Yesterday';
    else if (diffDays <= 7)  label = 'Last week';
    else if (diffDays <= 30) label = 'This month';
    else                     label = 'Earlier';
    (groups[label] ??= []).push(e);
  }

  // Preserve canonical ordering
  const order = ['Today', 'Yesterday', 'Last week', 'This month', 'Earlier'];
  return order
    .filter(l => groups[l])
    .map(label => ({ label, events: groups[label] }));
}
