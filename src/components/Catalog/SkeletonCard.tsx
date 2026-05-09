export function SkeletonCard({ view }: { view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="flex gap-4 p-4 rounded-xl border border-white/10 animate-pulse" style={{ backgroundColor: '#1d2025' }}>
        <div className="shrink-0 w-40 h-[90px] rounded-lg bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-800 rounded w-1/2" />
          <div className="h-3 bg-gray-800 rounded w-1/4" />
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden animate-pulse" style={{ backgroundColor: '#1d2025' }}>
      <div className="aspect-video bg-gray-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
        <div className="h-3 bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  );
}
