import { useEffect, useRef, useState } from 'react';

export function useInfiniteScroll(pageSize: number, totalItems: number) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(n => Math.min(n + pageSize, totalItems));
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageSize, totalItems]);

  // Reset when total changes (new filter applied)
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [totalItems, pageSize]);

  return { visibleCount, sentinelRef };
}
