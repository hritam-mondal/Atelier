import { useState, useMemo } from 'react';
import { WelcomeHeader } from './WelcomeHeader';
import { StatsRow } from './StatsRow';
import { ContinueLearning } from './ContinueLearning';
import { EnrollmentTabs } from './EnrollmentTabs';
import { EnrollmentGrid } from './EnrollmentGrid';
import { CertificatesGrid } from './CertificatesGrid';
import { WeeklyGoalCard } from './WeeklyGoalCard';
import { ActivityFeed } from './ActivityFeed';
import { RecommendedCourses } from './RecommendedCourses';
import { BadgeGrid } from '../Badges/BadgeGrid';
import { CalendarStrip } from '../Calendar/CalendarStrip';
import { useUser } from '../../context/UserContext';
import type { DashboardTab } from '../../types/dashboard';

export function DashboardPage() {
  const { state } = useUser();
  const [tab, setTab] = useState<DashboardTab>('all');

  const counts: Record<DashboardTab, number> = useMemo(() => ({
    'all':          state.enrollments.filter(e => !e.isArchived).length,
    'in-progress':  state.enrollments.filter(e => !e.isArchived && e.progressPercent > 0 && e.progressPercent < 100).length,
    'completed':    state.enrollments.filter(e => e.progressPercent === 100).length,
    'wishlist':     state.wishlist.length,
    'archived':     state.enrollments.filter(e => e.isArchived).length,
    'certificates': state.certificates.length,
  }), [state]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#15171a', color: 'white' }}>
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <WelcomeHeader />
        <StatsRow />
        <ContinueLearning />

        <section aria-label="My courses">
          <EnrollmentTabs active={tab} onChange={setTab} counts={counts} />
          <div className="mt-5">
            {tab === 'certificates'
              ? <CertificatesGrid />
              : <EnrollmentGrid tab={tab} />}
          </div>
        </section>

        {/* Two-column: weekly goal + activity */}
        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] gap-5">
          <WeeklyGoalCard />
          <ActivityFeed />
        </section>

        {/* Calendar + badges */}
        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] gap-5">
          <BadgeGrid />
          <CalendarStrip />
        </section>

        <RecommendedCourses />
      </main>
    </div>
  );
}
