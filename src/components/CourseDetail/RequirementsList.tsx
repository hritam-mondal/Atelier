interface Props {
  title: string;
  items: string[];
}

export function RequirementsList({ title, items }: Props) {
  return (
    <section>
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-3">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
            <span className="text-slate-500 mt-1.5 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
