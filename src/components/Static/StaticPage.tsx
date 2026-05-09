import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Props {
  kicker: string;
  title: string;
  italicSuffix?: string;
  children: ReactNode;
  toc?: { id: string; label: string }[];
}

export function StaticPage({ kicker, title, italicSuffix, children, toc }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs hover:opacity-70 transition-opacity mb-6"
        style={{ color: '#b8b3a7' }}
      >
        <ArrowLeft size={11} aria-hidden /> Home
      </Link>

      <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
        ✦ &nbsp; {kicker}
      </p>
      <h1 className="font-display text-4xl lg:text-6xl tracking-tight leading-[1.05] mb-12 max-w-3xl" style={{ color: '#ece6d8' }}>
        {title}
        {italicSuffix && <> <span className="italic font-light" style={{ color: '#b8b3a7' }}>{italicSuffix}</span></>}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] gap-10">
        <article
          className="max-w-3xl text-base leading-relaxed space-y-5"
          style={{ color: '#b8b3a7' }}
        >
          {children}
        </article>
        {toc && (
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start text-sm">
            <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: '#8a857a' }}>
              On this page
            </p>
            <ul className="space-y-1">
              {toc.map(t => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="hover:opacity-70 transition-opacity block py-1 text-xs" style={{ color: '#b8b3a7' }}>
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display text-2xl tracking-tight mt-10 mb-3 scroll-mt-24" style={{ color: '#ece6d8' }}>
      {children}
    </h2>
  );
}
