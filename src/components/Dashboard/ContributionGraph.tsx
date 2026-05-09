import { useMemo, useState } from 'react';
import type { DailyMinuteEntry } from '../../types/dashboard';

interface Props {
  daily: DailyMinuteEntry[];
}

const WEEKS = 12;
const DAYS = 7;

function bucket(minutes: number): number {
  if (minutes <= 0) return 0;
  if (minutes <= 15) return 1;
  if (minutes <= 45) return 2;
  if (minutes <= 90) return 3;
  return 4;
}

const COLORS = [
  'rgba(236,230,216,0.06)',  // 0 — barely visible
  'rgba(236,230,216,0.20)',  // 1
  'rgba(236,230,216,0.40)',  // 2
  'rgba(236,230,216,0.65)',  // 3
  '#ece6d8',                 // 4 — full cream
];

const WEEKDAY_LABELS = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];

function monthShort(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'short' });
}

export function ContributionGraph({ daily }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  const grid = useMemo(() => {
    // Build a 7Ã—WEEKS grid where columns are weeks (left = oldest, right = newest)
    // ending on the latest available day. Align rows to the day-of-week (Sun=0).
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = WEEKS * DAYS;
    // Find the most recent Saturday so the rightmost column ends on Sat for a clean grid
    const lastDayOffset = (6 - today.getDay() + 7) % 7; // days to next Saturday
    const lastDate = new Date(today);
    lastDate.setDate(lastDate.getDate() + lastDayOffset);

    const cells: { date: string; minutes: number; col: number; row: number; isFuture: boolean }[] = [];
    const monthLabels: { col: number; label: string }[] = [];
    const byDate = new Map(daily.map(d => [d.date, d.minutes]));

    let lastMonth = -1;
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(lastDate);
      d.setDate(d.getDate() - i);
      const idx = totalDays - 1 - i;
      const col = Math.floor(idx / DAYS);
      const row = d.getDay();
      const iso = d.toISOString().split('T')[0];
      const minutes = byDate.get(iso) ?? 0;
      const isFuture = d.getTime() > today.getTime();
      cells.push({ date: iso, minutes, col, row, isFuture });
      if (row === 0 && d.getMonth() !== lastMonth) {
        monthLabels.push({ col, label: monthShort(d) });
        lastMonth = d.getMonth();
      }
    }

    return { cells, monthLabels };
  }, [daily]);

  const cellSize = 14;
  const gap = 3;
  const offsetX = 30;
  const offsetY = 18;
  const width = offsetX + WEEKS * (cellSize + gap);
  const height = offsetY + DAYS * (cellSize + gap);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        className="block"
        role="img"
        aria-label="Daily learning activity for the past 12 weeks"
      >
        {/* Month labels */}
        {grid.monthLabels.map(m => (
          <text
            key={`${m.col}-${m.label}`}
            x={offsetX + m.col * (cellSize + gap)}
            y={11}
            fill="#b8b3a7"
            fontSize="9"
            fontFamily="inherit"
          >
            {m.label}
          </text>
        ))}

        {/* Weekday labels */}
        {WEEKDAY_LABELS.map((label, row) => (
          label && (
            <text
              key={row}
              x={0}
              y={offsetY + row * (cellSize + gap) + cellSize - 3}
              fill="#b8b3a7"
              fontSize="9"
              fontFamily="inherit"
            >
              {label}
            </text>
          )
        ))}

        {/* Cells */}
        {grid.cells.map(cell => {
          const x = offsetX + cell.col * (cellSize + gap);
          const y = offsetY + cell.row * (cellSize + gap);
          const fill = cell.isFuture ? 'transparent' : COLORS[bucket(cell.minutes)];
          const label = cell.isFuture
            ? `${cell.date}: future`
            : `${cell.date}: ${cell.minutes} minute${cell.minutes === 1 ? '' : 's'}`;
          return (
            <rect
              key={cell.date}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={fill}
              stroke={cell.isFuture ? 'rgba(255,255,255,0.05)' : 'transparent'}
              tabIndex={cell.isFuture ? -1 : 0}
              aria-label={label}
              onMouseEnter={(e) => {
                if (cell.isFuture) return;
                const rect = (e.target as SVGRectElement).getBoundingClientRect();
                const parentRect = (e.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect());
                setTooltip({
                  x: rect.left - (parentRect?.left ?? 0) + cellSize / 2,
                  y: rect.top - (parentRect?.top ?? 0) - 6,
                  label,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              onFocus={(e) => {
                if (cell.isFuture) return;
                const rect = (e.target as SVGRectElement).getBoundingClientRect();
                const parentRect = (e.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect());
                setTooltip({
                  x: rect.left - (parentRect?.left ?? 0) + cellSize / 2,
                  y: rect.top - (parentRect?.top ?? 0) - 6,
                  label,
                });
              }}
              onBlur={() => setTooltip(null)}
              style={{ cursor: cell.isFuture ? 'default' : 'pointer', outline: 'none' }}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full px-2 py-1 rounded text-[11px] text-white whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, backgroundColor: 'rgba(34,37,43,0.96)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
        >
          {tooltip.label}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400">
        <span>Less</span>
        {COLORS.map((c, i) => (
          <span key={i} className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c }} aria-hidden />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
