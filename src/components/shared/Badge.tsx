interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid';
  color?: 'accent' | 'success' | 'muted';
  className?: string;
}

const colorMap = {
  accent: {
    outline: 'border border-violet-500 text-violet-400',
    solid: 'bg-violet-700 text-white',
  },
  success: {
    outline: 'border border-green-600 text-green-500',
    solid: 'bg-green-700 text-white',
  },
  muted: {
    outline: 'border border-slate-600 text-slate-400',
    solid: 'bg-slate-700 text-slate-200',
  },
};

export function Badge({ children, variant = 'outline', color = 'accent', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none
        ${colorMap[color][variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
