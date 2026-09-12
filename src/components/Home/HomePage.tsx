import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Star,
} from "lucide-react";

type Category = "Engineering" | "Design" | "Product" | "Data & AI" | "Leadership" | "Marketing";
type ThemeKey = "light" | "dark";

interface CourseEntry {
  num: string;
  title: string;
  author: string;
  duration: string;
  level: string;
  initials: string;
}

interface Theme {
  bg: string;
  bgWarm: string;
  bgAlt: string;
  ink: string;
  inkSoft: string;
  inkMuted: string;
  line: string;
  lineStrong: string;
  invertBg: string;
  invertInk: string;
  cardBg: string;
  chipBorder: string;
  navBg: string;
  track2Bg: string;
  track1Bg: string;
  invertSoft: string;
  invertMuted: string;
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Engineering");
  const theme: ThemeKey = "dark";
  const isDark = theme === "dark";

  const categories: Category[] = ["Engineering", "Design", "Product", "Data & AI", "Leadership", "Marketing"];

  const featuredCourses: Record<Category, CourseEntry[]> = {
    Engineering: [
      { num: "01", title: "Systems Design at Scale", author: "Maya Reinhardt", duration: "12 hr", level: "Advanced", initials: "MR" },
      { num: "02", title: "Distributed Architectures", author: "Tomás Oliveira", duration: "8 hr", level: "Intermediate", initials: "TO" },
      { num: "03", title: "The Pragmatic Engineer", author: "Hye-jin Park", duration: "16 hr", level: "All levels", initials: "HP" },
    ],
    Design: [
      { num: "01", title: "Type as Architecture", author: "Eleanor Voss", duration: "9 hr", level: "Intermediate", initials: "EV" },
      { num: "02", title: "Designing for Calm", author: "Idris Mahmoud", duration: "6 hr", level: "All levels", initials: "IM" },
      { num: "03", title: "Color, Light, Form", author: "Anouk Lefèvre", duration: "11 hr", level: "Beginner", initials: "AL" },
    ],
    Product: [
      { num: "01", title: "The Discovery Habit", author: "Priya Bhattacharya", duration: "7 hr", level: "All levels", initials: "PB" },
      { num: "02", title: "Strategy Without Slides", author: "Marcus Whitfield", duration: "5 hr", level: "Intermediate", initials: "MW" },
      { num: "03", title: "Roadmaps That Work", author: "Lin Yuhan", duration: "9 hr", level: "Beginner", initials: "LY" },
    ],
    "Data & AI": [
      { num: "01", title: "Foundations of ML", author: "Dr. Samira Khoury", duration: "18 hr", level: "Intermediate", initials: "SK" },
      { num: "02", title: "Working with LLMs", author: "Felix Andersen", duration: "10 hr", level: "Advanced", initials: "FA" },
      { num: "03", title: "The Numerate Mind", author: "Helena Castro", duration: "14 hr", level: "Beginner", initials: "HC" },
    ],
    Leadership: [
      { num: "01", title: "Quiet Authority", author: "Robert Achebe", duration: "8 hr", level: "All levels", initials: "RA" },
      { num: "02", title: "Hard Conversations", author: "Yuki Tanabe", duration: "6 hr", level: "Intermediate", initials: "YT" },
      { num: "03", title: "The First 90 Days", author: "Eleanor Voss", duration: "5 hr", level: "Beginner", initials: "EV" },
    ],
    Marketing: [
      { num: "01", title: "Brand as Behavior", author: "Sebastián Cruz", duration: "9 hr", level: "All levels", initials: "SC" },
      { num: "02", title: "Writing That Sells", author: "Mira Halevi", duration: "7 hr", level: "Beginner", initials: "MH" },
      { num: "03", title: "Channels & Craft", author: "Joseph Okonkwo", duration: "11 hr", level: "Intermediate", initials: "JO" },
    ],
  };

  const testimonials = [
    { quote: "I came back to learning after a decade away. The pace, the depth — it met me where I was and pulled me forward.", name: "Amara Okafor", role: "Senior PM, fintech", track: "Product Strategy" },
    { quote: "Most courses teach you to copy. The instructors here teach you to think. That is the entire difference.", name: "Daniel Reinholt", role: "Founding Engineer", track: "Distributed Systems" },
    { quote: "Three months in and I'd shipped two features I'd previously have outsourced. Quietly transformative.", name: "Saoirse Bellamy", role: "Design Lead", track: "Frontend Foundations" },
  ];

  const t: Theme = isDark
    ? {
        bg: "#15171a",
        bgWarm: "#22252b",
        bgAlt: "#1d2025",
        ink: "#ece6d8",
        inkSoft: "#b8b3a7",
        inkMuted: "#8a857a",
        line: "rgba(236, 230, 216, 0.10)",
        lineStrong: "rgba(236, 230, 216, 0.25)",
        invertBg: "#ece6d8",
        invertInk: "#15171a",
        cardBg: "rgba(236, 230, 216, 0.04)",
        chipBorder: "rgba(236, 230, 216, 0.18)",
        navBg: "rgba(21, 23, 26, 0.85)",
        track2Bg: "#2a2d34",
        track1Bg: "#1d2025",
        invertSoft: "#8a857a",
        invertMuted: "#b8b3a7",
      }
    : {
        bg: "#f5f1ea",
        bgWarm: "#ebe4d4",
        bgAlt: "#faf6ee",
        ink: "#1c1917",
        inkSoft: "#57534e",
        inkMuted: "#a8a29e",
        line: "rgba(28, 25, 23, 0.10)",
        lineStrong: "rgba(28, 25, 23, 0.25)",
        invertBg: "#1c1917",
        invertInk: "#f5f1ea",
        cardBg: "rgba(255, 255, 255, 0.6)",
        chipBorder: "rgba(28, 25, 23, 0.15)",
        navBg: "rgba(245, 241, 234, 0.85)",
        track2Bg: "#ebe4d4",
        track1Bg: "#faf6ee",
        invertSoft: "#a8a29e",
        invertMuted: "#d6d3d1",
      };

  return (
    <div
      className="min-h-screen relative transition-colors duration-500"
      style={{ backgroundColor: t.bg, color: t.ink, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 40s linear infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; }
        .reveal.in { animation: fadeUp 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-panel { animation: modalIn 0.22s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
        .modal-overlay { animation: overlayIn 0.2s ease-out forwards; }
      `}</style>
      <div className="relative z-[2]">
        {/* Hero */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20">
          <div className="grid grid-cols-12 gap-6 lg:gap-10">
            <div className="col-span-12 lg:col-span-8">
              <Reveal delay={0}>
                <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: t.inkSoft }}>
                  ✦ &nbsp; A school for the working professional
                </p>
              </Reveal>
              <h1 className="font-display text-[44px] sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
                <Reveal as="span" delay={100} className="block">Learn the craft</Reveal>
                <Reveal as="span" delay={250} className="block">
                  <span className="italic font-light" style={{ color: t.inkSoft }}>behind</span> the work
                </Reveal>
                <Reveal as="span" delay={400} className="block">you admire.</Reveal>
              </h1>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:pt-6 flex flex-col justify-end">
              <Reveal delay={550}>
                <p className="text-base lg:text-lg leading-relaxed mb-6 max-w-md" style={{ color: t.inkSoft }}>
                  Atelier is a learning studio for engineers, designers, and operators who want to build serious skills — taught by people who actually do the work.
                </p>
              </Reveal>
              <Reveal delay={700}>
                <div className="flex flex-wrap gap-3">
                  <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: t.invertBg, color: t.invertInk }}>
                    Browse the catalog <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 border px-6 py-3 rounded-full text-sm font-medium hover:opacity-60 transition-opacity"
                    style={{ borderColor: t.lineStrong }}>
                    How it works
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="mt-20 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 border-t pt-10" style={{ borderColor: t.line }}>
            {[
              { n: "1,240", l: "Courses, hand-curated" },
              { n: "180k", l: "Active learners worldwide" },
              { n: "94%", l: "Finish what they start" },
              { n: "4.8", l: "Average instructor rating" },
            ].map((s, i) => (
              <Reveal key={i} delay={800 + i * 80}>
                <div>
                  <div className="font-display text-4xl lg:text-5xl tracking-tight mb-2">{s.n}</div>
                  <div className="text-sm" style={{ color: t.inkSoft }}>{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Marquee */}
        <section className="border-y py-6 overflow-hidden transition-colors duration-500"
          style={{ borderColor: t.line, backgroundColor: t.invertBg, color: t.invertInk }}>
          <div className="flex marquee-track whitespace-nowrap">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex items-center shrink-0">
                {["Cognition Labs", "Linear", "Notion", "Figma", "Anthropic", "Vercel", "Stripe", "Arc", "Ramp", "Linear"].map((b, i) => (
                  <span key={`${k}-${i}`} className="font-display text-2xl px-10 italic font-light opacity-80">
                    {b}<span className="opacity-40 not-italic mx-2">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Tracks */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 pb-16">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: t.inkSoft }}>
                ✦ &nbsp; Featured this season
              </p>
              <h2 className="font-display text-4xl lg:text-5xl tracking-tight max-w-2xl leading-tight">
                Three tracks. <span className="italic" style={{ color: t.inkSoft }}>No filler.</span>
              </h2>
            </div>
            <a href="#" className="text-sm inline-flex items-center gap-1 hover:opacity-60 transition-opacity underline underline-offset-4">
              See all 24 tracks <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border rounded-lg overflow-hidden"
            style={{ backgroundColor: t.line, borderColor: t.line }}>
            {[
              { kicker: "Track 01", title: "The Engineering Path", body: "Systems thinking, architecture, and the discipline of writing code that lasts. Six modules, fourteen instructors.", meta: "120 hours · Intermediate to advanced", bg: t.track1Bg, fg: t.ink, muted: t.inkSoft },
              { kicker: "Track 02", title: "The Design Path", body: "Typography, color, hierarchy, and the deeper craft of making things people want to use. Four cohorts a year.", meta: "80 hours · All levels", bg: t.track2Bg, fg: t.ink, muted: t.inkSoft },
              { kicker: "Track 03", title: "The Operator Path", body: "Strategy, leadership, and the unromantic mechanics of running things. For founders and senior ICs alike.", meta: "60 hours · Mid to senior", bg: t.invertBg, fg: t.invertInk, muted: t.invertSoft },
            ].map((card, i) => (
              <div key={i} className="p-8 lg:p-10 flex flex-col group cursor-pointer min-h-[420px] transition-all duration-300"
                style={{ backgroundColor: card.bg, color: card.fg }}>
                <div className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: card.muted }}>{card.kicker}</div>
                <h3 className="font-display text-3xl lg:text-[34px] leading-[1.05] tracking-tight mb-5">{card.title}</h3>
                <p className="text-[15px] leading-relaxed mb-8" style={{ color: card.muted }}>{card.body}</p>
                <div className="mt-auto">
                  <div className="text-xs mb-5" style={{ color: card.muted }}>{card.meta}</div>
                  <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                    Explore the track <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Catalog */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: t.inkSoft }}>
                ✦ &nbsp; Browse by discipline
              </p>
              <h2 className="font-display text-4xl lg:text-5xl tracking-tight">The full catalog.</h2>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map((c) => {
              const active = activeCategory === c;
              return (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className="px-4 py-2 rounded-full text-sm border transition-all duration-300"
                  style={active
                    ? { backgroundColor: t.invertBg, color: t.invertInk, borderColor: t.invertBg }
                    : { borderColor: t.chipBorder, color: t.inkSoft, backgroundColor: "transparent" }}>
                  {c}
                </button>
              );
            })}
          </div>

          <div className="border-t" style={{ borderColor: t.lineStrong }}>
            {featuredCourses[activeCategory].map((course, i) => (
              <a href="#" key={`${activeCategory}-${i}`}
                className="grid grid-cols-12 gap-4 py-7 border-b transition-colors group items-center"
                style={{ borderColor: t.line }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? "rgba(236,230,216,0.03)" : "rgba(28,25,23,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <div className="col-span-2 sm:col-span-1 font-display text-2xl italic" style={{ color: t.inkMuted }}>{course.num}</div>
                <div className="col-span-10 sm:col-span-6">
                  <div className="font-display text-2xl lg:text-3xl tracking-tight leading-tight group-hover:italic transition-all">
                    {course.title}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-2 flex items-center gap-2.5 text-sm" style={{ color: t.inkSoft }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                    style={{ backgroundColor: isDark ? "rgba(236,230,216,0.10)" : "rgba(28,25,23,0.08)", color: t.ink }}>
                    {course.initials}
                  </span>
                  <span className="truncate">{course.author}</span>
                </div>
                <div className="col-span-3 sm:col-span-1 text-sm" style={{ color: t.inkMuted }}>{course.duration}</div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: t.chipBorder, color: t.inkSoft }}>
                    {course.level}
                  </span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" style={{ color: t.inkMuted }} />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Pull quote */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-2">
              <p className="text-xs tracking-[0.2em] uppercase" style={{ color: t.inkSoft }}>✦ &nbsp; Our view</p>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <p className="font-display text-3xl lg:text-5xl leading-[1.15] tracking-tight">
                We believe most courses are too long, too generic, and too eager to please. We make the opposite of those —{" "}
                <span className="italic" style={{ color: t.inkSoft }}>short, specific, and willing to challenge you.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: t.inkSoft }}>✦ &nbsp; In their words</p>
            <h2 className="font-display text-4xl lg:text-5xl tracking-tight max-w-2xl">
              Learners <span className="italic" style={{ color: t.inkSoft }}>who finished.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tm, i) => (
              <figure key={i} className="border rounded-lg p-8 flex flex-col transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundColor: t.cardBg, borderColor: t.line }}>
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5" style={{ fill: t.ink, color: t.ink }} />
                  ))}
                </div>
                <blockquote className="font-display text-xl leading-[1.35] tracking-tight mb-8 flex-1">
                  &ldquo;{tm.quote}&rdquo;
                </blockquote>
                <figcaption className="pt-6 border-t" style={{ borderColor: t.line }}>
                  <div className="font-medium text-sm">{tm.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: t.inkSoft }}>{tm.role}</div>
                  <div className="text-xs mt-3 tracking-wide uppercase" style={{ color: t.inkMuted }}>{tm.track}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
          <div className="grid grid-cols-12 gap-px border rounded-lg overflow-hidden" style={{ backgroundColor: t.line, borderColor: t.line }}>
            <div className="col-span-12 lg:col-span-7 p-10 lg:p-14" style={{ backgroundColor: t.invertBg, color: t.invertInk }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: t.invertSoft }}>
                ✦ &nbsp; Membership
              </p>
              <h2 className="font-display text-4xl lg:text-6xl leading-[1] tracking-tight mb-8">
                One subscription.<br />
                <span className="italic font-light" style={{ color: t.invertSoft }}>The whole library.</span>
              </h2>
              <p className="max-w-md mb-10 leading-relaxed" style={{ color: t.invertMuted }}>
                Access every course, every track, every cohort. Cancel any time — though most don&rsquo;t.
              </p>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-display text-5xl">$24</span>
                <span style={{ color: t.invertSoft }}>/ month, billed annually</span>
              </div>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ backgroundColor: t.bg, color: t.ink }}>
                Start a free week <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="col-span-12 lg:col-span-5 p-10 lg:p-14 flex flex-col" style={{ backgroundColor: t.bgWarm }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: t.inkSoft }}>✦ &nbsp; What&rsquo;s included</p>
              <ul className="space-y-5 flex-1">
                {[
                  "Unlimited access to 1,240+ courses",
                  "Live cohorts and office hours",
                  "Project reviews from instructors",
                  "Certificates worth showing",
                  "A reading list, refreshed monthly",
                ].map((item, i, arr) => (
                  <li key={i} className={`flex items-start gap-3 pb-5 ${i < arr.length - 1 ? "border-b" : ""}`} style={{ borderColor: t.line }}>
                    <Plus className="w-4 h-4 mt-1 shrink-0" strokeWidth={1.5} style={{ color: t.inkSoft }} />
                    <span className="text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t mt-12" style={{ borderColor: t.line }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 pb-10">
            <div className="grid grid-cols-12 gap-8 mb-20">
              <div className="col-span-12 lg:col-span-5">
                <a href="#" className="font-display text-3xl tracking-tight">
                  Atelier<span style={{ color: t.inkMuted }}>.</span>
                </a>
                <p className="mt-6 max-w-sm leading-relaxed" style={{ color: t.inkSoft }}>
                  A learning studio, headquartered in Lisbon and Brooklyn. We believe in the work.
                </p>
                <div className="mt-10 max-w-md">
                  <label className="text-xs tracking-[0.2em] uppercase mb-3 block" style={{ color: t.inkSoft }}>
                    ✦ &nbsp; The newsletter
                  </label>
                  <div className="flex border-b" style={{ borderColor: t.lineStrong }}>
                    <input type="email" placeholder="you@somewhere.com"
                      className="flex-1 bg-transparent py-3 outline-none" style={{ color: t.ink }} />
                    <button type="button" className="font-medium text-sm">Subscribe →</button>
                  </div>
                </div>
              </div>

              <FooterCol theme={t} className="col-span-6 lg:col-span-2" title="Learn"
                items={["Catalog", "Paths", "Cohorts", "Free lessons"]} />
              <FooterCol theme={t} className="col-span-6 lg:col-span-2" title="Studio"
                items={["About", "Instructors", "Journal", "Press"]} />
              <FooterCol theme={t} className="col-span-6 lg:col-span-2" title="Business"
                items={["For teams", "For schools", "Affiliate", "Contact sales"]} />
              <FooterCol theme={t} className="col-span-6 lg:col-span-1" title="Help"
                items={["FAQ", "Support", "Refunds"]} />
            </div>

            <div className="font-display tracking-tight leading-none select-none"
              style={{ color: isDark ? "rgba(236,230,216,0.06)" : "rgba(28,25,23,0.06)" }}>
              <div className="text-[18vw] -mb-[3vw]">Atelier.</div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-10 border-t text-xs"
              style={{ borderColor: t.line, color: t.inkSoft }}>
              <div>Â© 2026 Atelier Learning Co. — Lisbon · Brooklyn</div>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:opacity-60">Privacy</a>
                <a href="#" className="hover:opacity-60">Terms</a>
                <a href="#" className="hover:opacity-60">Cookies</a>
                <span className="hidden sm:inline">EN · ES · PT · FR</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'span';
  className?: string;
}

function Reveal({ children, delay = 0, as = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const cls = `reveal ${shown ? "in" : ""} ${className}`;
  if (as === "span") {
    return <span ref={ref as React.RefObject<HTMLSpanElement>} className={cls}>{children}</span>;
  }
  return <div ref={ref as React.RefObject<HTMLDivElement>} className={cls}>{children}</div>;
}

interface FooterColProps {
  title: string;
  items: string[];
  className?: string;
  theme: Theme;
}

function FooterCol({ title, items, className = "", theme }: FooterColProps) {
  return (
    <div className={className}>
      <h4 className="text-xs tracking-[0.2em] uppercase mb-5" style={{ color: theme.inkSoft }}>{title}</h4>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="text-sm hover:opacity-60 transition-opacity">{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
