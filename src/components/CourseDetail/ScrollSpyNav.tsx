import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
  visible: boolean;
  topOffset: number;
}

export function ScrollSpyNav({ sections, visible, topOffset }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      // Find the section whose top is closest to (but past) topOffset+1
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - topOffset - 1;
        if (top <= 0) current = s.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections, topOffset]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - topOffset - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div
      className="sticky border-b transition-all duration-200"
      style={{
        top: 64,
        zIndex: 40,
        borderColor: 'rgba(236,230,216,0.10)',
        backgroundColor: 'rgba(21,23,26,0.92)',
        backdropFilter: 'blur(8px)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-hidden={!visible}
    >
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <ul className="flex items-center gap-1 overflow-x-auto" role="tablist">
          {sections.map(s => {
            const active = activeId === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={handleClick(s.id)}
                  className="inline-block px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                  style={{
                    color: active ? '#ece6d8' : '#b8b3a7',
                    borderColor: active ? '#ece6d8' : 'transparent',
                  }}
                  aria-current={active ? 'true' : undefined}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
