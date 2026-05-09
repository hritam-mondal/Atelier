interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (n: number) => string;
}

export function LineChart({ data, height = 140, formatValue }: LineChartProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value), 0);
  const range = Math.max(max - min, 1);
  const w = 600;
  const h = height;
  const padX = 24;
  const padY = 12;
  const stepX = (w - padX * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padY + (1 - (d.value - min) / range) * (h - padY * 2),
  }));

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${points[points.length - 1].x} ${h - padY} L ${padX} ${h - padY} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ece6d8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ece6d8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#line-fill)" />
      <path d={path} fill="none" stroke="#ece6d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill="#ece6d8" opacity={0.7} />
          <title>{`${data[i].label}: ${formatValue ? formatValue(data[i].value) : data[i].value}`}</title>
        </g>
      ))}
    </svg>
  );
}

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (n: number) => string;
}

export function BarChart({ data, height = 200, formatValue }: BarChartProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  const w = 600;
  const h = height;
  const padX = 28;
  const padY = 24;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const barW = innerW / data.length - 6;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const barH = (d.value / max) * innerH;
        const x = padX + i * (barW + 6);
        const y = padY + (innerH - barH);
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={2} fill="#ece6d8" opacity={0.8}>
              <title>{`${d.label}: ${formatValue ? formatValue(d.value) : d.value}`}</title>
            </rect>
            <text x={x + barW / 2} y={h - 6} textAnchor="middle" fontSize="9" fill="#8a857a">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
