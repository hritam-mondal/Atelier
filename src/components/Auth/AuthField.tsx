interface Props {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  trailing?: React.ReactNode;
}

export function AuthField({ icon, type, placeholder, value, onChange, autoComplete, required, trailing }: Props) {
  return (
    <label
      className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors focus-within:border-[rgba(236,230,216,0.5)]"
      style={{ borderColor: 'rgba(236, 230, 216, 0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      <span style={{ color: '#8a857a' }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-60"
        style={{ color: '#ece6d8' }}
      />
      {trailing && <span style={{ color: '#ece6d8' }}>{trailing}</span>}
    </label>
  );
}
