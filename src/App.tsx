import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CourseProvider, useCourse } from './context/CourseContext';
import { CatalogProvider } from './context/CatalogContext';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { CurriculumPanel } from './components/Curriculum/CurriculumPanel';
import { PlayerSidebar } from './components/Curriculum/PlayerSidebar';
import { playerBridge } from './hooks/playerBridge';
import { CatalogPage } from './components/Catalog/CatalogPage';
import { CourseDetailPage } from './components/CourseDetail/CourseDetailPage';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { UserProvider } from './context/UserContext';
import HomePage from './components/Home/HomePage';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { TopNav } from './components/shared/TopNav';
import { CartProvider } from './context/CartContext';
import { BillingProvider } from './context/BillingContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { NotificationsPage as NotificationsListPage } from './components/Notifications/NotificationsPage';
import { QAProvider } from './context/QAContext';
import { CohortPage } from './components/Cohort/CohortPage';
import { QuizPage } from './components/Assessment/QuizPage';
import { InstructorProvider } from './context/InstructorContext';
import { InstructorLayout } from './components/Instructor/InstructorLayout';
import { InstructorDashboard } from './components/Instructor/InstructorDashboard';
import { CourseListPage } from './components/Instructor/CourseListPage';
import { CourseEditor } from './components/Instructor/CourseEditor';
import { EarningsPage as InstructorEarningsPage } from './components/Instructor/EarningsPage';
import { AnalyticsPage } from './components/Instructor/AnalyticsPage';
import { InstructorQAInbox } from './components/Instructor/InstructorQAInbox';
import { InstructorProfilePage } from './components/Instructor/InstructorProfilePage';
import { InstructorPublicPage } from './components/Instructor/InstructorPublicPage';
import { AdminProvider } from './context/AdminContext';
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ModerationQueue } from './components/Admin/ModerationQueue';
import { FlagsAdminPage } from './components/Admin/FlagsAdminPage';
import { AuditLogPage } from './components/Admin/AuditLogPage';
import { AnnouncementsPage } from './components/Admin/AnnouncementsPage';
import { SiteAnnouncementBanner } from './components/shared/SiteAnnouncementBanner';
import { CookieBanner } from './components/shared/CookieBanner';
import {
  TermsPage, PrivacyPage, CookiesPage, AboutPage, TeamsPage, AffiliatePage,
  HelpHomePage, HelpArticlePage, ContactPage, StatusPage, BlogIndexPage, BlogPostPage, SitemapPage,
} from './components/Static/Pages';
import { CartPage } from './components/Commerce/CartPage';
import { CheckoutPage } from './components/Commerce/CheckoutPage';
import { OrderConfirmationPage } from './components/Commerce/OrderConfirmationPage';
import { BillingPage } from './components/Account/Billing/BillingPage';
import { InvoicePage } from './components/Account/Billing/InvoicePage';
import { ForgotPasswordPage } from './components/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/Auth/ResetPasswordPage';
import { VerifyEmailPage } from './components/Auth/VerifyEmailPage';
import { VerifyEmailBanner } from './components/Auth/VerifyEmailBanner';
import { OAuthCallback } from './components/Auth/OAuthCallback';
import { RequireAuth } from './components/Auth/RequireAuth';
import { AccountLayout } from './components/Account/AccountLayout';
import { ProfilePage } from './components/Account/ProfilePage';
import { SecurityPage } from './components/Account/SecurityPage';
import { NotificationsPage as AccountNotificationsPage } from './components/Account/NotificationsPage';
import { ConnectionsPage } from './components/Account/ConnectionsPage';
import { DangerZonePage } from './components/Account/DangerZonePage';
import { Star, Users, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

function CourseLayout() {
  const { course, state, dispatch, getLectureById } = useCourse();
  const [mobileTab, setMobileTab] = useState<'player' | 'curriculum'>('player');
  const activeLecture = getLectureById(state.activeLectureId);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#15171a', color: '#ece6d8' }}>
      {/* Global header */}
      <TopNav />

      {/* Course context bar — slim breadcrumb under global nav */}
      <div
        className="shrink-0 border-b"
        style={{ borderColor: 'rgba(236,230,216,0.10)', backgroundColor: 'rgba(29, 32, 37, 0.85)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-11 flex items-center gap-3 text-xs">
          <Link
            to="/learning"
            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity shrink-0"
            style={{ color: '#b8b3a7' }}
            aria-label="Back to My Learning"
          >
            <ChevronLeft size={12} aria-hidden /> My Learning
          </Link>
          <span style={{ color: '#8a857a' }} aria-hidden>
            <ChevronRightIcon size={11} />
          </span>
          <Link
            to="/course"
            className="font-display text-sm tracking-tight truncate hover:opacity-70 transition-opacity"
            style={{ color: '#ece6d8' }}
          >
            {course.title}
          </Link>
          <div className="ml-auto hidden sm:flex items-center gap-3" style={{ color: '#8a857a' }}>
            <span className="flex items-center gap-1">
              <Star size={11} aria-hidden style={{ color: '#d8c594', fill: '#d8c594' }} />
              {course.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} aria-hidden />
              {course.enrollmentCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Video + info */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <VideoPlayer />

          <div className="p-5 border-b border-[rgba(236,230,216,0.10)]">
            <h1 className="text-lg font-semibold text-gray-100 mb-1">
              {activeLecture?.title ?? course.title}
            </h1>
            {activeLecture?.description && (
              <p className="text-sm text-gray-400 leading-relaxed mt-1">{activeLecture.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <button
                role="switch"
                aria-checked={state.autoPlayNext}
                onClick={() => dispatch({ type: 'TOGGLE_AUTOPLAY' })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none ${state.autoPlayNext ? 'bg-violet-600' : 'bg-gray-700'}`}
                aria-label="Toggle auto-play next lecture"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${state.autoPlayNext ? 'translate-x-[18px]' : 'translate-x-1'}`}
                />
              </button>
              <span className="text-sm text-gray-400">Auto-play next lecture</span>
            </div>
          </div>

          <div className="p-5 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-violet-900 flex items-center justify-center text-sm font-bold text-violet-300 shrink-0"
              aria-hidden="true"
            >
              {course.instructor.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{course.instructor.name}</p>
              <p className="text-xs text-gray-500">{course.instructor.title}</p>
            </div>
          </div>
        </div>

        {/* Curriculum + notes + transcript sidebar */}
        <aside
          className="w-96 shrink-0 flex flex-col border-l border-[rgba(236,230,216,0.10)] overflow-hidden"
          aria-label="Course content"
        >
          <PlayerSidebar
            currentTime={state.currentTime}
            onSeek={(t) => playerBridge.seek(t)}
            onPause={() => playerBridge.pause()}
          />
        </aside>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col lg:hidden flex-1 overflow-hidden">
        <div className="sticky top-0 z-20">
          <VideoPlayer />
        </div>

        {/* Tabs */}
        <div
          className="flex border-b border-[rgba(236,230,216,0.10)] shrink-0"
          style={{ backgroundColor: '#1d2025' }}
          role="tablist"
          aria-label="Course content tabs"
        >
          <button
            role="tab"
            aria-selected={mobileTab === 'player'}
            onClick={() => setMobileTab('player')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none ${mobileTab === 'player' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Now Playing
          </button>
          <button
            role="tab"
            aria-selected={mobileTab === 'curriculum'}
            onClick={() => setMobileTab('curriculum')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none ${mobileTab === 'curriculum' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Curriculum
          </button>
        </div>

        {/* Tab panels */}
        <div className="flex-1 overflow-y-auto">
          <div role="tabpanel" hidden={mobileTab !== 'player'}>
            <div className="p-4 space-y-4">
              <div>
                <h1 className="text-base font-semibold text-gray-100">
                  {activeLecture?.title ?? course.title}
                </h1>
                {activeLecture?.description && (
                  <p className="text-sm text-gray-400 leading-relaxed mt-1">{activeLecture.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  role="switch"
                  aria-checked={state.autoPlayNext}
                  onClick={() => dispatch({ type: 'TOGGLE_AUTOPLAY' })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none ${state.autoPlayNext ? 'bg-violet-600' : 'bg-gray-700'}`}
                  aria-label="Toggle auto-play next lecture"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${state.autoPlayNext ? 'translate-x-[18px]' : 'translate-x-1'}`}
                  />
                </button>
                <span className="text-sm text-gray-400">Auto-play next</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[rgba(236,230,216,0.10)]">
                <div className="w-9 h-9 rounded-full bg-violet-900 flex items-center justify-center text-sm font-bold text-violet-300 shrink-0" aria-hidden="true">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{course.instructor.name}</p>
                  <p className="text-xs text-gray-500">{course.instructor.title}</p>
                </div>
              </div>
            </div>
          </div>
          <div role="tabpanel" hidden={mobileTab !== 'curriculum'} className="h-full">
            <CurriculumPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

function WithNav({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteAnnouncementBanner />
      <TopNav />
      <VerifyEmailBanner />
      {children}
      <CookieBanner />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CourseProvider>
        <AuthProvider>
          <NotificationsProvider>
          <QAProvider>
          <InstructorProvider>
          <AdminProvider>
          <UserProvider>
            <BillingProvider>
              <CartProvider>
                <CatalogProvider>
                  <Routes>
                    <Route path="/"                                element={<WithNav><HomePage /></WithNav>} />
                    <Route path="/learning"                        element={<WithNav><RequireAuth><DashboardPage /></RequireAuth></WithNav>} />
                    <Route path="/catalog"                         element={<WithNav><CatalogPage /></WithNav>} />
                    <Route path="/course"                          element={<WithNav><CourseDetailPage /></WithNav>} />
                    <Route path="/player/*"                        element={<RequireAuth><CourseLayout /></RequireAuth>} />

                    {/* Auth */}
                    <Route path="/login"                           element={<WithNav><LoginPage /></WithNav>} />
                    <Route path="/signup"                          element={<WithNav><SignupPage /></WithNav>} />
                    <Route path="/forgot-password"                 element={<WithNav><ForgotPasswordPage /></WithNav>} />
                    <Route path="/reset-password"                  element={<WithNav><ResetPasswordPage /></WithNav>} />
                    <Route path="/verify-email"                    element={<WithNav><VerifyEmailPage /></WithNav>} />
                    <Route path="/oauth/callback/:provider"        element={<WithNav><OAuthCallback /></WithNav>} />

                    {/* Commerce — gated */}
                    <Route path="/cart"                            element={<WithNav><RequireAuth><CartPage /></RequireAuth></WithNav>} />
                    <Route path="/checkout"                        element={<WithNav><RequireAuth><CheckoutPage /></RequireAuth></WithNav>} />
                    <Route path="/checkout/success"                element={<WithNav><RequireAuth><OrderConfirmationPage /></RequireAuth></WithNav>} />

                    {/* Account — gated */}
                    <Route path="/account"                         element={<RequireAuth><AccountLayout /></RequireAuth>}>
                      <Route index                                 element={<ProfilePage />} />
                      <Route path="security"                       element={<SecurityPage />} />
                      <Route path="notifications"                  element={<AccountNotificationsPage />} />
                      <Route path="connections"                    element={<ConnectionsPage />} />
                      <Route path="billing"                        element={<BillingPage />} />
                      <Route path="danger"                         element={<DangerZonePage />} />
                    </Route>
                    <Route path="/account/billing/invoices/:id"    element={<WithNav><RequireAuth><InvoicePage /></RequireAuth></WithNav>} />

                    {/* Notifications — gated */}
                    <Route path="/notifications"                   element={<WithNav><RequireAuth><NotificationsListPage /></RequireAuth></WithNav>} />

                    {/* Cohort — gated */}
                    <Route path="/cohort"                          element={<WithNav><RequireAuth><CohortPage /></RequireAuth></WithNav>} />
                    <Route path="/cohort/:cohortId"                element={<WithNav><RequireAuth><CohortPage /></RequireAuth></WithNav>} />
                    <Route path="/cohort/:cohortId/:threadId"      element={<WithNav><RequireAuth><CohortPage /></RequireAuth></WithNav>} />

                    {/* Quizzes — gated */}
                    <Route path="/quiz/:quizId"                    element={<WithNav><RequireAuth><QuizPage /></RequireAuth></WithNav>} />

                    {/* Instructor studio — instructor or admin */}
                    <Route path="/instructor"                      element={<RequireAuth role="instructor"><InstructorLayout /></RequireAuth>}>
                      <Route index                                 element={<InstructorDashboard />} />
                      <Route path="courses"                        element={<CourseListPage />} />
                      <Route path="courses/:id"                    element={<CourseEditor />} />
                      <Route path="qa"                             element={<InstructorQAInbox />} />
                      <Route path="analytics"                      element={<AnalyticsPage />} />
                      <Route path="earnings"                       element={<InstructorEarningsPage />} />
                      <Route path="profile"                        element={<InstructorProfilePage />} />
                    </Route>

                    {/* Public instructor profile */}
                    <Route path="/u/:slug"                         element={<InstructorPublicPage />} />

                    {/* Admin — admin only */}
                    <Route path="/admin"                           element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
                      <Route index                                 element={<AdminDashboard />} />
                      <Route path="moderation"                     element={<ModerationQueue />} />
                      <Route path="flags"                          element={<FlagsAdminPage />} />
                      <Route path="audit"                          element={<AuditLogPage />} />
                      <Route path="announcements"                  element={<AnnouncementsPage />} />
                    </Route>

                    {/* Static pages */}
                    <Route path="/terms"                           element={<WithNav><TermsPage /></WithNav>} />
                    <Route path="/privacy"                         element={<WithNav><PrivacyPage /></WithNav>} />
                    <Route path="/cookies"                         element={<WithNav><CookiesPage /></WithNav>} />
                    <Route path="/about"                           element={<WithNav><AboutPage /></WithNav>} />
                    <Route path="/teams"                           element={<WithNav><TeamsPage /></WithNav>} />
                    <Route path="/affiliate"                       element={<WithNav><AffiliatePage /></WithNav>} />
                    <Route path="/help"                            element={<WithNav><HelpHomePage /></WithNav>} />
                    <Route path="/help/:slug"                      element={<WithNav><HelpArticlePage /></WithNav>} />
                    <Route path="/contact"                         element={<WithNav><ContactPage /></WithNav>} />
                    <Route path="/status"                          element={<WithNav><StatusPage /></WithNav>} />
                    <Route path="/blog"                            element={<WithNav><BlogIndexPage /></WithNav>} />
                    <Route path="/blog/:slug"                      element={<WithNav><BlogPostPage /></WithNav>} />
                    <Route path="/sitemap"                         element={<WithNav><SitemapPage /></WithNav>} />

                    <Route path="*"                                element={<WithNav><HomePage /></WithNav>} />
                  </Routes>
                </CatalogProvider>
              </CartProvider>
            </BillingProvider>
          </UserProvider>
          </AdminProvider>
          </InstructorProvider>
          </QAProvider>
          </NotificationsProvider>
        </AuthProvider>
      </CourseProvider>
    </BrowserRouter>
  );
}
