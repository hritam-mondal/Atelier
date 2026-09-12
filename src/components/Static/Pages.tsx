import { Link } from 'react-router-dom';
import { Mail, Search, FileQuestion, ArrowRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { StaticPage, H2 } from './StaticPage';
import { useState } from 'react';

export function TermsPage() {
  return (
    <StaticPage
      kicker="Legal"
      title="Terms of"
      italicSuffix="service."
      toc={[
        { id: 'eligibility', label: 'Eligibility' },
        { id: 'accounts',    label: 'Your account' },
        { id: 'content',     label: 'Course content' },
        { id: 'payments',    label: 'Payments' },
        { id: 'conduct',     label: 'Acceptable conduct' },
        { id: 'liability',   label: 'Limitation of liability' },
      ]}
    >
      <p>These terms govern your use of Atelier. By creating an account or using the service, you agree to them.</p>

      <H2 id="eligibility">Eligibility</H2>
      <p>You must be at least 13 years old to use Atelier. If you're between 13 and 18, you'll need a parent or guardian's permission for paid content.</p>

      <H2 id="accounts">Your account</H2>
      <p>You're responsible for keeping your password secure. Notify us immediately if you suspect unauthorised access. Use strong passwords. Enable two-factor authentication.</p>

      <H2 id="content">Course content</H2>
      <p>Courses, lectures, and resources are licensed to you for personal learning. You may not redistribute, resell, or extract them for use outside the platform.</p>

      <H2 id="payments">Payments and refunds</H2>
      <p>Course purchases are charged immediately. We offer a 30-day money-back guarantee on most courses. Subscriptions renew automatically until cancelled.</p>

      <H2 id="conduct">Acceptable conduct</H2>
      <p>Be kind. No harassment, spam, illegal content, or attempts to circumvent platform safeguards. We may suspend accounts for repeated violations.</p>

      <H2 id="liability">Limitation of liability</H2>
      <p>Atelier is provided "as is". We do our best to keep things running but make no guarantees about outcomes. Our liability is limited to the amount you've paid us in the past 12 months.</p>
    </StaticPage>
  );
}

export function PrivacyPage() {
  return (
    <StaticPage
      kicker="Legal"
      title="Privacy"
      italicSuffix="policy."
      toc={[
        { id: 'collect',  label: 'What we collect' },
        { id: 'use',      label: 'How we use it' },
        { id: 'share',    label: 'Sharing' },
        { id: 'retain',   label: 'Retention' },
        { id: 'rights',   label: 'Your rights' },
      ]}
    >
      <p>This page explains what data we collect, why, and what control you have over it.</p>
      <H2 id="collect">What we collect</H2>
      <p>Your name, email, profile details, learning progress, payment metadata (we never see card numbers), and usage analytics.</p>
      <H2 id="use">How we use it</H2>
      <p>To deliver the courses you've enrolled in, recommend new ones, send notifications you've opted into, and improve the platform.</p>
      <H2 id="share">Sharing</H2>
      <p>We don't sell your data. We share with payment processors (Stripe), email infrastructure, and analytics providers, all under data-processing agreements.</p>
      <H2 id="retain">Retention</H2>
      <p>We keep account data while your account is active and for 60 days after deletion (so you can recover it). Anonymised analytics may be retained longer.</p>
      <H2 id="rights">Your rights</H2>
      <p>You can <Link to="/account/danger" className="underline" style={{ color: '#ece6d8' }}>export or delete your data</Link> at any time. EU and UK users have additional rights under GDPR.</p>
    </StaticPage>
  );
}

export function CookiesPage() {
  return (
    <StaticPage kicker="Legal" title="Cookies." italicSuffix="">
      <p>We use a small number of cookies to keep you signed in, run the cart, and (with permission) measure how the site is used.</p>
      <H2 id="essential">Essential</H2>
      <p>Sign-in, cart, security tokens. Cannot be disabled.</p>
      <H2 id="analytics">Analytics</H2>
      <p>Page views, performance metrics, A/B test buckets. You can decline these.</p>
      <H2 id="marketing">Marketing</H2>
      <p>Ad attribution. Off by default.</p>
    </StaticPage>
  );
}

export function AboutPage() {
  return (
    <StaticPage kicker="Studio" title="About" italicSuffix="Atelier.">
      <p>Atelier is a learning studio for engineers, designers, and operators who want to build serious skills — taught by people who actually do the work.</p>
      <p>We started in 2019 as a small newsletter. Five years later we are a team of fourteen, headquartered in Lisbon and Brooklyn, serving 180,000 learners worldwide.</p>
      <p>Our editorial standards are uncompromising. We say no to most pitches. The courses you see have all been worked over by an editor and a peer reviewer before publication.</p>
      <p>We believe most courses are too long, too generic, and too eager to please. We make the opposite: short, specific, and willing to challenge you.</p>
    </StaticPage>
  );
}

export function TeamsPage() {
  return (
    <StaticPage kicker="For teams" title="Atelier" italicSuffix="for teams.">
      <p>Train your engineering and design teams on the same platform you trust for personal learning.</p>
      <H2 id="features">Features</H2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Single sign-on (SAML, Okta, Google Workspace)</li>
        <li>Custom learning paths assigned by managers</li>
        <li>Team analytics and progress reports</li>
        <li>Volume pricing starting at 10 seats</li>
        <li>Dedicated success manager for plans of 50+ seats</li>
      </ul>
      <H2 id="pricing">Pricing</H2>
      <p>Starts at $19/seat/month, billed annually. Volume discounts available.</p>
      <p>
        <Link to="/contact" className="inline-flex items-center gap-1 underline underline-offset-2" style={{ color: '#ece6d8' }}>
          Contact sales <ArrowRight size={11} aria-hidden />
        </Link>
      </p>
    </StaticPage>
  );
}

export function AffiliatePage() {
  return (
    <StaticPage kicker="Programs" title="Affiliate" italicSuffix="program.">
      <p>Earn 30% on every Atelier sale you refer. No tiers, no minimums, no quotas — just a fair share of what you bring in.</p>
      <H2 id="works">How it works</H2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Apply with a short note about your audience.</li>
        <li>We respond within 5 business days.</li>
        <li>You get a unique link and a dashboard.</li>
        <li>Payouts the first week of every month.</li>
      </ol>
      <H2 id="cookie">Cookie window</H2>
      <p>30 days. Last-click attribution.</p>
    </StaticPage>
  );
}

const HELP_ARTICLES = [
  { slug: 'getting-started', category: 'Getting started', title: 'How do I enroll in a course?', body: 'Browse the catalog, click the course, then "Add to cart" or "Buy now" on the course detail page.' },
  { slug: 'reset-password',  category: 'Account',         title: 'I forgot my password',          body: 'Use the Forgot password link on the sign-in page. We\'ll email you a reset link valid for 60 minutes.' },
  { slug: 'cancel-sub',      category: 'Billing',         title: 'How do I cancel my subscription?', body: 'Go to Account → Billing → Cancel. You keep access until the end of your current billing period.' },
  { slug: 'refund',          category: 'Billing',         title: 'Can I get a refund?',           body: 'We offer a 30-day money-back guarantee on most courses. Visit your invoice page to request a refund.' },
  { slug: 'offline',         category: 'Learning',        title: 'Can I download lectures?',      body: 'Offline downloads are available on iOS and Android. Web lectures stream live.' },
  { slug: 'instructor',      category: 'Instructors',     title: 'How do I become an instructor?', body: 'Email us at instructors@atelier.app with a course pitch, an outline, and a sample lesson.' },
];

export function HelpHomePage() {
  const [query, setQuery] = useState('');
  const filtered = query.trim()
    ? HELP_ARTICLES.filter(a => (a.title + a.body).toLowerCase().includes(query.toLowerCase()))
    : HELP_ARTICLES;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <Link to="/" className="text-xs hover:opacity-70" style={{ color: '#b8b3a7' }}>← Home</Link>
      <p className="text-xs tracking-[0.2em] uppercase mt-6 mb-3" style={{ color: '#b8b3a7' }}>✦ &nbsp; Help</p>
      <h1 className="font-display text-4xl lg:text-6xl tracking-tight leading-tight mb-8" style={{ color: '#ece6d8' }}>
        How can we <span className="italic font-light" style={{ color: '#b8b3a7' }}>help</span>?
      </h1>

      <div className="relative mb-8">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8a857a' }} aria-hidden />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles"
          className="w-full pl-9 pr-3 py-3 rounded-lg outline-none text-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.20)', color: '#ece6d8' }}
        />
      </div>

      <ul className="space-y-2">
        {filtered.map(a => (
          <li key={a.slug}>
            <Link
              to={`/help/${a.slug}`}
              className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-white/[0.02] transition-colors"
              style={{ border: '1px solid rgba(236,230,216,0.10)' }}
            >
              <FileQuestion size={14} style={{ color: '#b8b3a7' }} aria-hidden className="shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8a857a' }}>{a.category}</p>
                <p className="text-sm" style={{ color: '#ece6d8' }}>{a.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HelpArticlePage() {
  const slug = window.location.pathname.split('/').pop();
  const article = HELP_ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl mb-4" style={{ color: '#ece6d8' }}>Article not found.</h1>
        <Link to="/help" className="text-sm hover:opacity-70" style={{ color: '#ece6d8' }}>Back to help center</Link>
      </div>
    );
  }

  return (
    <StaticPage kicker={article.category} title={article.title}>
      <p>{article.body}</p>
      <div className="mt-12 pt-6 border-t" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <p className="text-xs mb-3" style={{ color: '#8a857a' }}>Was this helpful?</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80" style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}>👍 Yes</button>
          <button className="px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80" style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}>👎 No</button>
        </div>
        <p className="text-xs mt-4" style={{ color: '#b8b3a7' }}>
          Still stuck? <Link to="/contact" className="underline" style={{ color: '#ece6d8' }}>Contact support</Link>.
        </p>
      </div>
    </StaticPage>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 400);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-5" style={{ backgroundColor: 'rgba(168,192,138,0.15)' }} aria-hidden>
          <CheckCircle2 size={26} style={{ color: '#a8c08a' }} />
        </div>
        <h1 className="font-display text-3xl mb-2" style={{ color: '#ece6d8' }}>Message sent.</h1>
        <p className="text-sm" style={{ color: '#b8b3a7' }}>We'll get back to you within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <StaticPage kicker="Get in touch" title="Contact" italicSuffix="us.">
      <p className="mb-8">For help, partnerships, press inquiries, or anything else.</p>
      <form onSubmit={submit} className="space-y-3 max-w-lg">
        <Input label="Name" value={name} onChange={setName} required />
        <Input label="Email" type="email" value={email} onChange={setEmail} required />
        <Input label="Subject" value={subject} onChange={setSubject} required />
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b8b3a7' }}>Message</label>
          <textarea
            rows={6}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg outline-none text-sm leading-relaxed resize-y"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.20)', color: '#ece6d8' }}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          <Mail size={13} aria-hidden /> Send message
        </button>
      </form>
    </StaticPage>
  );
}

function Input({ label, type = 'text', value, onChange, required }: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b8b3a7' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 rounded-lg outline-none text-sm"
        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.20)', color: '#ece6d8' }}
      />
    </div>
  );
}

const SYSTEMS = [
  { name: 'Web app',     status: 'operational' },
  { name: 'Video player',status: 'operational' },
  { name: 'API',         status: 'operational' },
  { name: 'Payments',    status: 'operational' },
  { name: 'Mobile apps', status: 'degraded' },
] as const;

const INCIDENTS = [
  { id: 'i1', date: '2026-04-12', title: 'Brief slowness on video CDN (Europe)', resolved: true,  duration: '17 min' },
  { id: 'i2', date: '2026-03-28', title: 'Login latency spike',                   resolved: true,  duration: '8 min' },
  { id: 'i3', date: '2026-03-04', title: 'Search index rebuild',                  resolved: true,  duration: '42 min' },
];

export function StatusPage() {
  const allOperational = SYSTEMS.every(s => s.status === 'operational');
  return (
    <StaticPage kicker="Status" title="System" italicSuffix="status.">
      <div
        className="rounded-xl p-5 mb-8 not-prose"
        style={{
          border: `1px solid ${allOperational ? 'rgba(168,192,138,0.40)' : 'rgba(216,197,148,0.40)'}`,
          backgroundColor: allOperational ? 'rgba(168,192,138,0.06)' : 'rgba(216,197,148,0.05)',
        }}
      >
        <div className="flex items-center gap-3">
          {allOperational ? <CheckCircle2 size={20} style={{ color: '#a8c08a' }} aria-hidden /> : <AlertCircle size={20} style={{ color: '#d8c594' }} aria-hidden />}
          <div>
            <p className="font-display text-lg" style={{ color: '#ece6d8' }}>
              {allOperational ? 'All systems operational' : 'Some systems degraded'}
            </p>
            <p className="text-xs" style={{ color: '#b8b3a7' }}>Last checked just now</p>
          </div>
        </div>
      </div>

      <H2 id="systems">Systems</H2>
      <ul className="space-y-2 list-none pl-0 not-prose">
        {SYSTEMS.map(s => {
          const Icon = s.status === 'operational' ? CheckCircle2 : s.status === 'degraded' ? AlertCircle : XCircle;
          const color = s.status === 'operational' ? '#a8c08a' : s.status === 'degraded' ? '#d8c594' : '#c5897a';
          return (
            <li key={s.name} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ border: '1px solid rgba(236,230,216,0.10)' }}>
              <Icon size={14} style={{ color }} aria-hidden />
              <span style={{ color: '#ece6d8' }} className="flex-1">{s.name}</span>
              <span className="text-xs capitalize" style={{ color }}>{s.status}</span>
            </li>
          );
        })}
      </ul>

      <H2 id="incidents">Past 90 days</H2>
      <ul className="space-y-2 list-none pl-0 not-prose">
        {INCIDENTS.map(i => (
          <li key={i.id} className="px-4 py-3 rounded-lg" style={{ border: '1px solid rgba(236,230,216,0.08)' }}>
            <p className="text-sm" style={{ color: '#ece6d8' }}>{i.title}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#8a857a' }}>{i.date} · resolved · {i.duration}</p>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}

export function BlogIndexPage() {
  const posts = [
    { slug: 'shipping-the-new-player', title: 'Shipping the new video player', date: '2026-04-22', author: 'Maya Reinhardt', excerpt: 'A look at how we rebuilt the player around web standards instead of fighting them.' },
    { slug: 'on-instructor-fees',      title: 'On instructor fees',            date: '2026-03-30', author: 'Sarah Chen',     excerpt: 'Why we changed our revenue split — and what it means for the courses on the platform.' },
    { slug: 'designing-for-calm',      title: 'Designing for calm',            date: '2026-03-12', author: 'Aiko Tanaka',    excerpt: 'A few principles we follow when designing learning interfaces.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <Link to="/" className="text-xs hover:opacity-70" style={{ color: '#b8b3a7' }}>← Home</Link>
      <p className="text-xs tracking-[0.2em] uppercase mt-6 mb-3" style={{ color: '#b8b3a7' }}>✦ &nbsp; Journal</p>
      <h1 className="font-display text-4xl lg:text-6xl tracking-tight leading-tight mb-12" style={{ color: '#ece6d8' }}>
        Notes from the <span className="italic font-light" style={{ color: '#b8b3a7' }}>studio</span>.
      </h1>
      <ul className="space-y-8">
        {posts.map(p => (
          <li key={p.slug}>
            <Link to={`/blog/${p.slug}`} className="block hover:opacity-80 transition-opacity">
              <p className="text-xs mb-2" style={{ color: '#8a857a' }}>{p.date} · {p.author}</p>
              <h2 className="font-display text-2xl tracking-tight mb-2" style={{ color: '#ece6d8' }}>{p.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#b8b3a7' }}>{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlogPostPage() {
  const slug = window.location.pathname.split('/').pop();
  return (
    <StaticPage kicker="Journal" title={slug?.replace(/-/g, ' ') ?? 'Post'}>
      <p>This is a placeholder for the blog post body. In a real deployment we'd render Markdown from `src/data/content/blog/{slug}.md`.</p>
      <p>The Atelier journal covers craft, taste, and the unromantic parts of building a learning platform.</p>
    </StaticPage>
  );
}

export function SitemapPage() {
  const groups = [
    { title: 'Learn',    links: [['Home', '/'], ['Catalog', '/catalog'], ['Course detail', '/course'], ['Player', '/player'], ['Cohort', '/cohort']] },
    { title: 'Account',  links: [['My learning', '/learning'], ['Profile', '/account'], ['Security', '/account/security'], ['Notifications', '/account/notifications'], ['Billing', '/account/billing'], ['Connections', '/account/connections']] },
    { title: 'Commerce', links: [['Cart', '/cart'], ['Checkout', '/checkout']] },
    { title: 'Studio',   links: [['Instructor dashboard', '/instructor'], ['Courses', '/instructor/courses'], ['Earnings', '/instructor/earnings']] },
    { title: 'Studio info',  links: [['About', '/about'], ['Teams', '/teams'], ['Affiliate', '/affiliate'], ['Help', '/help'], ['Contact', '/contact'], ['Status', '/status'], ['Blog', '/blog']] },
    { title: 'Legal',    links: [['Terms', '/terms'], ['Privacy', '/privacy'], ['Cookies', '/cookies']] },
  ] as const;

  return (
    <StaticPage kicker="Index" title="Sitemap.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 not-prose">
        {groups.map(g => (
          <div key={g.title}>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: '#8a857a' }}>{g.title}</p>
            <ul className="space-y-1.5">
              {g.links.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#ece6d8' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}

