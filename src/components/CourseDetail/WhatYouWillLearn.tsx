import { Check } from 'lucide-react';

interface Props {
  items: string[];
}

export function WhatYouWillLearn({ items }: Props) {
  return (
    <section
      className="rounded-xl border border-white/10 p-6"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-4">What you'll learn</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
            <Check size={16} className="text-violet-400 shrink-0 mt-0.5" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
