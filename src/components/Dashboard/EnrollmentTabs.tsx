import type { DashboardTab } from '../../types/dashboard';

interface Props {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  counts: Record<DashboardTab, number>;
}

export function EnrollmentTabs({ active, onChange, counts }: Props) {
  const tabs = Object.entries(counts) as Array<[DashboardTab, number]>;

  return (
    <div className="flex gap-2">
      {tabs.map(([tab, count]) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className="rounded-full px-3 py-1.5 text-xs font-medium transition-opacity"
          style={{
            backgroundColor: active === tab ? 'rgba(236,230,216,0.10)' : 'transparent',
            color: active === tab ? '#ece6d8' : '#8a857a',
          }}
        >
          {tab} ({count})
        </button>
      ))}
    </div>
  );
}
