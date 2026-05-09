# Atelier — Learning Platform UI Template

A complete, production-grade UI template for a modern online learning platform. Built end-to-end with React, TypeScript, and Tailwind CSS, with no external UI library — every component is hand-built around a cohesive editorial design system.

This is a UI template, not a backend. All data is mocked to localStorage; auth is local-only with predefined demo accounts. Drop in real APIs to ship.

---

## Highlights

- **45+ pages** across student, instructor, admin, and public surfaces
- **9 React contexts** with localStorage persistence
- **Atelier design system** — warm dark palette, Fraunces serif display, Inter body, custom SVG charts and visualizations
- **Role-based access control** — student / instructor / admin, with per-route gating
- **Zero TypeScript errors**, strict mode, no implicit any
- **Accessibility-aware** — focus traps, ARIA, keyboard nav across all interactive surfaces
- **No paid dependencies**

---

## Stack

| Layer        | Choice                                                |
| ------------ | ----------------------------------------------------- |
| Framework    | React 19 + TypeScript (strict)                        |
| Bundler      | Vite 8                                                |
| Styling      | Tailwind CSS v4 (via `@tailwindcss/vite`)             |
| Routing      | React Router v7                                       |
| Icons        | lucide-react                                          |
| Fonts        | Fraunces (display serif) + Inter (body) via Google Fonts |
| Charts       | Custom SVG (no chart library)                         |
| Code editor  | Native textarea sandboxed via `new Function`          |
| Persistence  | `localStorage` keyed by user id                       |

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you'll land on the marketing home page.

```bash
npm run build       # production build
npm run preview     # serve the production build
npm run lint        # eslint
npx tsc --noEmit    # type-check (CI-friendly)
```

---

## Demo credentials

The login page surfaces these in a one-click banner. Password for all accounts: **`atelier2025`**

| Email                       | Role       | Unlocks                                                          |
| --------------------------- | ---------- | ---------------------------------------------------------------- |
| `student@atelier.app`       | Student    | My Learning, cart, notes, Q&A, certificates, achievements        |
| `instructor@atelier.app`    | Instructor | + Studio, course editor, earnings, analytics, instructor inbox   |
| `admin@atelier.app`         | Admin      | + Moderation, feature flags, audit log, announcements            |

Sign-out is in the avatar dropdown (top-right). Auth state, cart, enrollments, notes, and preferences all persist to localStorage.

---

## Page map

### Public routes (no auth)

| Route          | Purpose                            |
| -------------- | ---------------------------------- |
| `/`            | Marketing home                     |
| `/catalog`     | Course catalog with filters        |
| `/course`      | Course detail + purchase card      |
| `/login`       | Sign-in (with demo banner)         |
| `/signup`      | Account creation                   |
| `/forgot-password` `/reset-password` `/verify-email` | Account recovery flows |
| `/oauth/callback/:provider` | OAuth handshake (mock)  |
| `/u/:slug`     | Public instructor profile          |
| `/about` `/teams` `/affiliate` `/help` `/help/:slug` `/contact` `/status` `/blog` `/blog/:slug` `/terms` `/privacy` `/cookies` `/sitemap` | Static / marketing pages |

### Authenticated routes

| Route                   | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `/learning`             | Student dashboard (stats, continue learning, tabs)   |
| `/cart` `/checkout` `/checkout/success` | Cart, payment, confirmation             |
| `/account/*`            | Profile · Security (2FA) · Notifications · Connections · Billing · Danger zone |
| `/notifications`        | Full notification list                               |
| `/cohort/:cohortId/*`   | Cohort discussion forum                              |
| `/quiz/:quizId`         | Inline assessments (MC, TF, code with sandbox)       |
| `/player/*`             | Course player + curriculum + notes + transcript + Q&A |

### Role-gated routes

| Route                | Required role         |
| -------------------- | --------------------- |
| `/instructor/*`      | instructor or admin   |
| `/admin/*`           | admin                 |

---

## Feature inventory

### Student experience
- **Marketing home** with hero, tracks, catalog preview, testimonials, pricing
- **Catalog** — 45+ mock courses, filter sidebar (category / rating / duration / level / language / price / features), sort, grid/list toggle, hover preview, infinite scroll, URL state sync
- **Course detail** — hero, sticky purchase card, countdown timer, what-you'll-learn, curriculum preview with free-preview modal, requirements, description, instructor bio, scroll-spy nav, reviews with rating breakdown + filters + sort, related courses carousel, FAQ
- **Cart + checkout** — line items, save-for-later, coupon validation, Stripe-Elements-style card form with brand detection, billing address, tax computed per US state, express checkout placeholders, order confirmation with confetti, refund flow within 30 days
- **Dashboard** — stats row (4 KPIs), continue-learning hero card, tabbed enrollments (All · In Progress · Completed · Wishlist · Archived · Certificates), weekly goal ring + 12-week contribution graph, activity feed grouped by date, badges grid, calendar of upcoming sessions, recommended courses
- **Player** — native HTML5 video, custom controls, playback speed, captions track toggle, picture-in-picture, fullscreen, keyboard shortcuts (Space / J / L / K / M / F / P / 0–9 / N / B / T / C), auto-advance with countdown, resume position, progress persistence
- **Player sidebar** — Curriculum · Notes (markdown editor with auto-save and timestamp anchoring) · Bookmarks · Transcript (auto-following with click-to-seek) · Q&A
- **Notes export** — downloadable Markdown grouped by lecture
- **Q&A** — per-lecture threaded discussion, voting, accepted-answer flag, instructor badge, markdown rendering, tags, search
- **Cohort forum** — pinned announcements, categorized threads (announcements · general · help · showcase · jobs)
- **Quizzes** — multiple choice, multi-select, true/false, short answer, code (sandboxed test runner), per-question explanations, progress dots, retake flow
- **Notifications** — bell with unread badge, dropdown, full list, web push permission flow, preferences per channel (in-app · email · push) per event type
- **Achievements** — 12 badges with rarity tiers, unlock animations, locked/earned states
- **Calendar** — `.ics` file generation for cohort sessions, add-to-calendar dropdown
- **Certificates** — SVG faux-certificate with copyable ID, share menu (LinkedIn / X / link), download stub, view-course link

### Instructor studio
- **Dashboard** — KPIs, enrollment chart, top courses by revenue
- **Course editor** — drag (up/down) reorder of sections and lectures, free-preview toggle, what-you'll-learn list editor, requirements, description, pricing, auto-save with last-saved indicator
- **Publish checklist** — gates Publish behind 7 quality criteria
- **Earnings** — month / lifetime / pending payout, monthly bar chart, statement CSV export, payout history
- **Analytics** — range selector (week/month/quarter/year), enrollments and revenue charts, course performance table
- **Q&A inbox** — answered/unanswered/mine filters, two-pane reader with markdown reply composer
- **Public profile** — `/u/:slug`

### Admin
- **Operations dashboard** — DAU / MAU / MRR / total revenue / signups, top categories chart
- **Moderation queue** — bulk actions (approve / remove / shadow ban) on reviews, Q&A, cohort threads, profiles
- **Feature flags** — toggle, rollout slider (0–100%), audience selector, audit-logged
- **Audit log** — every privileged action with actor / target / timestamp
- **Announcements** — site-wide banner composer with kind (info / warn / celebrate) and date range

### Account center
- Profile (avatar uploader with crop preview, name, headline, bio, social links, timezone, language)
- Security (password change, 2FA wizard with QR + recovery codes, sessions table with revoke, security log)
- Notifications (per-event grid: in-app / email / push, digest frequency, marketing opt-in)
- Connections (Google / GitHub / Apple OAuth)
- Billing (subscription card with cancel/pause, payment methods, order history, printable invoice)
- Danger zone (data export as JSON, account deletion with typed confirmation)

### Shared chrome
- **TopNav** — sticky atelier-themed header with primary nav, search button (⌘K), notification bell, cart icon, avatar dropdown / Sign in + Begin
- **SearchModal** — grouped results (Courses · Instructors · Categories · Pages), recent searches, popular suggestions, category chips, match highlighting, keyboard nav
- **Site announcement banner** — appears above TopNav when an admin announcement is active
- **Cookie consent banner** — first-visit, with category toggles
- **Verify-email banner** — shown until user verifies

---

## Project structure

```
src/
├── App.tsx                      # Routes, providers, RequireAuth gating
├── main.tsx
├── index.css                    # Atelier palette, fonts, Tailwind theme overrides
│
├── types/                       # Shared interfaces
│   ├── catalog.ts               course, filters, sort
│   ├── course.ts                lectures, sections, player controls
│   ├── courseDetail.ts          extends course with reviews, FAQs
│   ├── dashboard.ts             enrollments, certificates, activity
│   ├── account.ts               auth + profile + sessions + 2FA
│   ├── commerce.ts              cart, orders, subscription, coupon
│   ├── notes.ts                 notes, bookmarks, transcript cues
│   ├── notifications.ts         notifications, badges, scheduled events
│   ├── qa.ts                    questions, answers, votes, cohort threads
│   ├── assessment.ts            quizzes and questions
│   ├── instructor.ts            course drafts, instructor stats
│   └── admin.ts                 metrics, moderation, flags, audit
│
├── data/                        # Mock data (TS modules where dates are computed)
│   ├── mockCatalog.json         45 courses across 8 categories
│   ├── mockCourse.json          Course player data (sections, lectures)
│   ├── mockCourseDetail.ts
│   ├── mockUserState.ts         Enrollments, activity, daily minutes (last 84d)
│   ├── mockAccount.ts
│   ├── mockOrders.ts
│   ├── mockCoupons.ts
│   ├── mockTranscripts.ts
│   ├── mockQA.ts
│   ├── mockNotifications.ts
│   ├── mockQuizzes.ts
│   ├── mockInstructorState.ts
│   ├── mockAdmin.ts
│   └── demoCredentials.ts       Login banner credentials
│
├── context/                     # State (all reducer-based, all persist to localStorage)
│   ├── CourseContext.tsx
│   ├── CatalogContext.tsx
│   ├── UserContext.tsx
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── BillingContext.tsx
│   ├── NotificationsContext.tsx
│   ├── QAContext.tsx
│   ├── InstructorContext.tsx
│   └── AdminContext.tsx
│
├── hooks/                       # Domain-specific hooks
│   ├── useVideoPlayer.ts        # Native <video> wrapper
│   ├── useKeyboardShortcuts.ts
│   ├── useNotes.ts
│   ├── useBookmarks.ts
│   ├── useQuiz.ts               # Includes sandboxed code test runner
│   ├── useStreak.ts
│   ├── useLearningStats.ts
│   ├── useEnrollmentFilters.ts
│   ├── useCountdown.ts
│   ├── useDirtyForm.ts
│   ├── useStickyOffset.ts
│   ├── useInfiniteScroll.ts
│   ├── useUrlState.ts
│   └── playerBridge.ts          # Lets sidebar tabs control the player
│
├── utils/
│   ├── computeStreak.ts
│   ├── computeTax.ts            # US state tax rates
│   ├── filterCourses.ts
│   ├── formatTime.ts            # mm:ss / h:mm:ss
│   ├── formatDuration.ts
│   ├── formatPrice.ts
│   ├── formatInvoice.ts
│   ├── formatRelativeTime.ts
│   ├── exportNotesMarkdown.ts
│   ├── generateIcs.ts           # .ics calendar files
│   ├── groupActivityByDate.ts
│   └── renderMarkdown.ts        # Tiny safe-ish markdown renderer
│
└── components/
    ├── shared/                  TopNav, SearchModal, SiteAnnouncementBanner, CookieBanner, StarRating, PriceTag
    ├── Home/                    Marketing home (hero, tracks, catalog, testimonials, pricing, footer)
    ├── Auth/                    Login, Signup, ForgotPassword, ResetPassword, VerifyEmail, OAuthCallback, RequireAuth
    ├── Account/                 AccountLayout, ProfilePage, SecurityPage (+ 2FA wizard, sessions, log), NotificationsPage, ConnectionsPage, DangerZonePage
    │   └── Billing/             BillingPage, SubscriptionCard, PaymentMethodList, InvoiceList, InvoicePage
    ├── Catalog/                 CatalogPage, CatalogHero, FilterSidebar, SortBar, CourseGrid, CourseCard, CourseCardHoverPreview, ActiveFilterChips, EmptyResults, SkeletonCard
    ├── CourseDetail/            CourseDetailPage, CourseHero, PurchaseCard, PurchaseCardMobile, CountdownTimer, PreviewVideoPlayer, WhatYouWillLearn, RequirementsList, CourseDescription, CourseContentPreview, PreviewModal, InstructorBio, ReviewsSection (+ subcomponents), RelatedCoursesCarousel, FAQSection, ScrollSpyNav
    ├── Curriculum/              CurriculumPanel, PlayerSidebar, CurriculumHeader, CurriculumSearch, SectionRow, LectureRow, NowPlayingIndicator
    ├── VideoPlayer/             VideoPlayer, VideoControls, VideoOverlay, ProgressBar, VolumeControl, SpeedSelector, QualitySelector, CountdownOverlay
    │   ├── Notes/               NotesPanel, NoteEditor, NoteRow
    │   ├── Bookmarks/           BookmarksList
    │   └── Transcript/          TranscriptPanel
    ├── Commerce/                CartPage, CartLineItem, SavedForLaterRow, CartSummary, CouponInput, CartDrawer, CheckoutPage, PaymentMethodForm, BillingAddressForm, ExpressCheckoutButtons, OrderConfirmationPage
    ├── Dashboard/               DashboardPage, WelcomeHeader, StatsRow, StatCard, ContinueLearning, EnrollmentTabs, EnrolledCourseCard, WishlistCard, EnrollmentGrid, WeeklyGoalCard, ContributionGraph, GoalEditor, ActivityFeed, ActivityItem, CertificatesGrid, CertificateCard, RecommendedCourses, EmptyTabState
    ├── QA/                      QAPanel, QuestionThread, AnswerCard, AskQuestionForm, VoteWidget
    ├── Cohort/                  CohortPage
    ├── Assessment/              AssessmentRunner, QuizPage, QuestionMC, QuestionTF, QuestionShortAnswer, CodeQuestion, QuizResults
    ├── Notifications/           NotificationBell, NotificationItem, NotificationsPage
    ├── Badges/                  BadgeGrid, BadgeCard
    ├── Calendar/                CalendarStrip
    ├── Instructor/              InstructorLayout, InstructorDashboard, CourseListPage, CourseEditor, EarningsPage, AnalyticsPage, InstructorQAInbox, InstructorProfilePage, InstructorPublicPage, Charts
    ├── Admin/                   AdminLayout, AdminDashboard, ModerationQueue, FlagsAdminPage, AuditLogPage, AnnouncementsPage
    └── Static/                  StaticPage, Pages (Terms, Privacy, Cookies, About, Teams, Affiliate, Help, Contact, Status, Blog, Sitemap)
```

---

## Design system — "Atelier"

A warm, editorial dark theme designed to feel like a serious creative studio rather than a tech product.

| Token             | Value          | Use                              |
| ----------------- | -------------- | -------------------------------- |
| `bg`              | `#15171a`      | App background                   |
| `bg-alt`          | `#1d2025`      | Card background                  |
| `bg-warm`         | `#22252b`      | Elevated card                    |
| `ink`             | `#ece6d8`      | Primary text (warm cream)        |
| `ink-soft`        | `#b8b3a7`      | Secondary text                   |
| `ink-muted`       | `#8a857a`      | Tertiary text, captions          |
| `line`            | `rgba(236, 230, 216, 0.10)` | Subtle borders      |
| `line-strong`     | `rgba(236, 230, 216, 0.25)` | Strong borders      |
| Primary CTA bg    | `#ece6d8`      | Cream-on-dark pills              |
| Primary CTA text  | `#15171a`      | Dark on cream                    |

**Accent palette** (used sparingly):

- `#a8c08a` (warm green) — success, "passed", positive states
- `#d8c594` (warm amber) — bestseller, warning, streak
- `#c5897a` (warm rose) — destructive, error, low-rating
- `#aabacb` (cool stone) — neutral info

**Typography**

- Display headings: **Fraunces** with the `font-display` class — used on H1/H2 and italic accents
- Body: **Inter**
- All `tracking-[0.2em] uppercase` kickers on small section labels with the `✦` glyph

These tokens are defined as CSS variables in `src/index.css` and as `@theme` overrides on Tailwind's slate / gray / violet scales — meaning utility classes like `text-violet-400` automatically map to the warm cream palette across legacy components.

---

## Architecture notes

### Auth & route protection

- `AuthContext` holds `signedIn`, `email`, `role`, plus profile/security/notification preferences
- `<RequireAuth>` is a route-level wrapper that redirects unauthenticated users to `/login?next=<original-path>` and bounces them back after sign-in
- Role-gated routes use `<RequireAuth role="instructor">` or `role="admin"` — admin can access everything
- Sign-out resets auth state and routes to `/`

### State

Each domain lives in its own context with a `useReducer`, persisted to localStorage. Because storage is per-key, you can clear individual concerns without nuking the whole app:

```
auth-state-v1                   → AuthContext
user-state:u-current            → UserContext
cart-state-v1                   → CartContext
billing-state-v1                → BillingContext
qa-state-v1                     → QAContext
notifications-v1                → NotificationsContext
instructor-state-v1             → InstructorContext
admin-state-v1                  → AdminContext
notes-v1, bookmarks-v1          → in-player annotations
search-recent-v1                → search modal recents
quiz-progress:<id>              → resumable quiz attempts
quiz-submissions-v1             → quiz history
review-vote:<id>, review-helpful:<id>  → review interactions
wishlist:<courseId>             → wishlist state per course
```

### Player

Native HTML5 `<video>` driven by the `useVideoPlayer` hook. The player itself doesn't know about notes / bookmarks / transcripts — those are siblings in `PlayerSidebar` that talk back to the player via a tiny module-scoped `playerBridge` (so the sidebar can `seek()` and `pause()` without lifting the entire player state).

### Charts

Custom SVG line + bar charts with linear gradients (`Charts.tsx` in the instructor folder). The 12-week contribution graph in the dashboard is a hand-rolled 7×12 SVG grid with intensity bucketing (`ContributionGraph.tsx`).

### Assessments

The code-question test runner uses `new Function()` for sandboxed execution. It extracts the user's first declared function name, executes test cases, and diffs JSON-stringified outputs. Errors are caught and surfaced per test case.

### Search

`SearchModal.tsx` builds a single index of courses + derived instructors + derived categories + role-aware page links. Results are grouped by kind, support keyboard navigation across groups, and substring-highlight matched text. Recent searches persist locally.

---

## Customising

To rebrand:

1. Replace the `Atelier.` wordmark in `TopNav.tsx`, `HomePage.tsx`, `MobileMenuSheet`, and `InvoicePage.tsx`
2. Update the palette tokens in `src/index.css`
3. Swap the demo data files in `src/data/`
4. Update meta in `index.html`

To wire to real APIs:

1. Replace the localStorage `useEffect` calls in each context with real fetch / mutation logic
2. Replace `findCredential` in `data/demoCredentials.ts` with a real auth call
3. Replace mock data imports with API responses (the contexts already accept `HYDRATE` actions)

---

## Accessibility

- All interactive icons have `aria-label`
- Modals (search, preview, 2FA wizard, goal editor, etc.) trap focus, dismiss on ESC, and restore focus on close
- Tabs use `role="tablist"`, `role="tab"`, `role="tabpanel"` and arrow-key navigation
- Progress rings use `role="progressbar"` with `aria-valuenow/min/max`
- The contribution graph's cells are keyboard-focusable with `aria-label` per day
- Live regions announce search results, save state, and toast messages

---

## What's not included (yet)

- Server-side anything — this is template-only
- Real video transcoding (samples are mock `/videos/sample.mp4`)
- Email sending (digest preview is rendered HTML)
- Mobile native apps
- Internationalisation (English copy throughout)
- Tests

---

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Credits

- Fonts — [Fraunces](https://fonts.google.com/specimen/Fraunces) by Undercase Type, [Inter](https://fonts.google.com/specimen/Inter) by Rasmus Andersson
- Icons — [Lucide](https://lucide.dev/)
- Images — [picsum.photos](https://picsum.photos/) and [pravatar.cc](https://pravatar.cc/) (placeholder services)
