export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((Date.now() - then) / 1000);
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) {
    const m = Math.floor(diffSec / 60);
    return `${m}m ago`;
  }
  if (diffSec < 86_400) {
    const h = Math.floor(diffSec / 3600);
    return `${h}h ago`;
  }
  if (diffSec < 7 * 86_400) {
    const d = Math.floor(diffSec / 86_400);
    return `${d}d ago`;
  }
  if (diffSec < 30 * 86_400) {
    const w = Math.floor(diffSec / (7 * 86_400));
    return `${w}w ago`;
  }
  const months = Math.floor(diffSec / (30 * 86_400));
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
