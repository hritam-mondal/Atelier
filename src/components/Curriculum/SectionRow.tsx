import { ChevronDown } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { LectureRow } from './LectureRow';
import { formatDuration } from '../../utils/formatTime';
import type { Section } from '../../types/course';

interface SectionRowProps {
  section: Section;
  searchQuery: string;
}

export function SectionRow({ section, searchQuery }: SectionRowProps) {
  const { state, dispatch } = useCourse();
  const isCollapsed = !!state.sectionCollapsed[section.id];

  const completedCount = section.lectures.filter((l) => state.completedLectureIds.has(l.id)).length;
  const totalDuration = section.lectures.reduce((sum, l) => sum + l.duration, 0);
  const sectionProgress = section.lectures.length > 0 ? (completedCount / section.lectures.length) * 100 : 0;

  const toggle = () => dispatch({ type: 'TOGGLE_SECTION_COLLAPSED', sectionId: section.id });

  // Filter lectures by search query
  const visibleLectures = searchQuery.trim()
    ? section.lectures.filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : section.lectures;

  if (searchQuery.trim() && visibleLectures.length === 0) return null;

  return (
    <div className="border-b border-[rgba(236,230,216,0.10)]">
      {/* Section header */}
      <button
        onClick={toggle}
        className="w-full text-left px-3 py-3 hover:bg-[#1a1a24] transition-colors group"
        aria-expanded={!isCollapsed}
        aria-label={`${section.title} — ${completedCount} of ${section.lectures.length} lectures complete`}
      >
        <div className="flex items-start gap-2">
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`mt-0.5 text-gray-400 shrink-0 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-100 leading-snug">{section.title}</p>
              <span className="text-xs text-gray-500 shrink-0 tabular-nums">{formatDuration(totalDuration)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {completedCount}/{section.lectures.length} complete
            </p>
            {/* Section progress bar */}
            <div className="mt-1.5 h-0.5 w-full rounded-full bg-[rgba(236,230,216,0.10)] overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${sectionProgress}%` }}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Lectures list with CSS transition */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: isCollapsed ? 0 : 9999 }}
      >
        <div role="list">
          {visibleLectures.map((lecture) => (
            <LectureRow key={lecture.id} lecture={lecture} searchQuery={searchQuery} />
          ))}
        </div>
      </div>
    </div>
  );
}
