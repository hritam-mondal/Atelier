import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { formatDuration } from '../../utils/formatTime';

interface CurriculumHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  allExpanded: boolean;
  onToggleAll: () => void;
}

export function CurriculumHeader({ searchQuery, onSearchChange, allExpanded, onToggleAll }: CurriculumHeaderProps) {
  const { course, totalLectures } = useCourse();
  const totalDuration = course.sections.flatMap((s) => s.lectures).reduce((sum, l) => sum + l.duration, 0);

  return (
    <div className="p-3 border-b border-[rgba(236,230,216,0.10)] space-y-2">
      {/* Search */}
      <div className="relative">
        <Search size={14} aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search lectures…"
          aria-label="Search lectures"
          className="w-full pl-8 pr-3 py-1.5 bg-[#15171a] border border-[rgba(236,230,216,0.10)] rounded text-sm text-gray-300 placeholder-gray-600 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600 transition-colors"
        />
      </div>

      {/* Stats + expand all */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {totalLectures} lectures · {formatDuration(totalDuration)}
        </p>
        <button
          onClick={onToggleAll}
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] rounded outline-none px-1"
          aria-label={allExpanded ? 'Collapse all sections' : 'Expand all sections'}
        >
          {allExpanded ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
    </div>
  );
}
