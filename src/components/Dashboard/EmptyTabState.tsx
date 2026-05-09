import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: { label: string; to: string };
}

export function EmptyTabState({ icon: Icon, title, description, cta }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(236,230,216,0.12)' }}
        aria-hidden
      >
        <Icon size={36} className="text-violet-400" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-5">{description}</p>
      {cta && (
        <Link
          to={cta.to}
          className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
