import { useState, useMemo } from 'react';
import { useCourse } from '../../context/CourseContext';
import { CurriculumHeader } from './CurriculumHeader';
import { SectionRow } from './SectionRow';
import { ProgressRing } from '../shared/ProgressRing';

export function CurriculumPanel() {
  const { course, state, dispatch, totalLectures, completedCount } = useCourse();
  const [searchQuery, setSearchQuery] = useState('');

  const progressPercent = totalLectures > 0 ? (completedCount / totalLectures) * 100 : 0;

  const allExpanded = useMemo(
    () => course.sections.every((s) => !state.sectionCollapsed[s.id]),
    [course.sections, state.sectionCollapsed]
  );

  const toggleAll = () => {
    const collapse = allExpanded;
    course.sections.forEach((s) => {
      const isCurrentlyCollapsed = !!state.sectionCollapsed[s.id];
      if (collapse && !isCurrentlyCollapsed) {
        dispatch({ type: 'TOGGLE_SECTION_COLLAPSED', sectionId: s.id });
      } else if (!collapse && isCurrentlyCollapsed) {
        dispatch({ type: 'TOGGLE_SECTION_COLLAPSED', sectionId: s.id });
      }
    });
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: '#1d2025' }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-[rgba(236,230,216,0.10)]" style={{ backgroundColor: '#1d2025' }}>
        {/* Course title + overall progress */}
        <div className="px-4 py-3 border-b border-[rgba(236,230,216,0.10)]">
          <div className="flex items-center gap-3">
            <ProgressRing percent={progressPercent} size={32} strokeWidth={3} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-100 truncate leading-tight">{course.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {completedCount}/{totalLectures} complete · {Math.round(progressPercent)}%
              </p>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="mt-2 h-1 w-full rounded-full bg-[rgba(236,230,216,0.10)] overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <CurriculumHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          allExpanded={allExpanded}
          onToggleAll={toggleAll}
        />
      </div>

      {/* Scrollable section list */}
      <div
        className="flex-1 overflow-y-auto"
        role="list"
        aria-label="Course curriculum"
      >
        {course.sections.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}
