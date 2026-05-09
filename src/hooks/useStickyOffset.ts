import { useEffect, useState } from 'react';

/**
 * Returns the current vertical scroll position. Consumers can use this
 * to compute custom offsets for sticky elements that need to dodge the hero.
 */
export function useStickyOffset(navHeight = 64): { scrollY: number; pastHero: (heroHeight: number) => boolean; topOffset: number } {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return {
    scrollY,
    pastHero: (heroHeight: number) => scrollY > heroHeight - navHeight,
    topOffset: navHeight + 16,
  };
}
