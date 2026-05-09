import { useEffect, useRef, useState } from 'react';
import { mockCourseDetail } from '../../data/mockCourseDetail';
import { CourseHero } from './CourseHero';
import { PurchaseCard } from './PurchaseCard';
import { PurchaseCardMobile } from './PurchaseCardMobile';
import { WhatYouWillLearn } from './WhatYouWillLearn';
import { CourseContentPreview } from './CourseContentPreview';
import { RequirementsList } from './RequirementsList';
import { CourseDescription } from './CourseDescription';
import { InstructorBio } from './InstructorBio';
import { ReviewsSection } from './ReviewsSection/ReviewsSection';
import { RelatedCoursesCarousel } from './RelatedCoursesCarousel';
import { FAQSection } from './FAQSection';
import { ScrollSpyNav } from './ScrollSpyNav';
import { useStickyOffset } from '../../hooks/useStickyOffset';

const NAV_SECTIONS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'curriculum',   label: 'Curriculum' },
  { id: 'instructor',   label: 'Instructor' },
  { id: 'reviews',      label: 'Reviews' },
];

export function CourseDetailPage() {
  const course = mockCourseDetail;
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState(0);
  const { scrollY } = useStickyOffset();

  useEffect(() => {
    const measure = () => setHeroHeight(heroRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const navVisible = scrollY > heroHeight - 80;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#15171a', color: 'white' }}>
      <div ref={heroRef} className="relative">
        <CourseHero course={course} />

        {/* Floating PurchaseCard overlaps the hero on the right — only while above the hero */}
        {!navVisible && (
          <div
            className="hidden lg:block absolute z-20 right-6 xl:right-[calc((100vw-1280px)/2+24px)]"
            style={{ top: 70, width: 360 }}
          >
            <PurchaseCard course={course} />
          </div>
        )}
      </div>

      <ScrollSpyNav sections={NAV_SECTIONS} visible={navVisible} topOffset={64} />

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-8 pb-32 lg:pb-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <div className="space-y-10 min-w-0">
            <div id="overview" className="space-y-10 scroll-mt-32">
              <WhatYouWillLearn items={course.whatYouWillLearn} />
            </div>

            <div id="curriculum" className="scroll-mt-32">
              <CourseContentPreview course={course} />
            </div>

            <RequirementsList title="Requirements" items={course.requirements} />
            <RequirementsList title="Who this course is for" items={course.targetAudience} />

            <CourseDescription text={course.longDescription} />

            <InstructorBio course={course} />

            <div id="reviews" className="scroll-mt-32">
              <ReviewsSection course={course} />
            </div>

            <RelatedCoursesCarousel courseIds={course.relatedCourseIds} />

            <FAQSection items={course.faqs} />
          </div>

          {/* Right rail — sticky purchase card after the hero scrolls out of view */}
          <aside className="hidden lg:block" aria-label="Course purchase">
            <div className="sticky" style={{ top: 128 }}>
              {navVisible && <PurchaseCard course={course} />}
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile bottom-fixed bar */}
      <PurchaseCardMobile course={course} />
    </div>
  );
}
