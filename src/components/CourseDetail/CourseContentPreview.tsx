import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Play, Lock } from 'lucide-react';
import type { CourseDetail } from '../../types/courseDetail';
import type { Lecture, Section } from '../../types/course';
import { formatDuration } from '../../utils/formatDuration';
import { PreviewModal } from './PreviewModal';

interface Props {
  course: CourseDetail;
}

const VISIBLE_SECTIONS_DEFAULT = 5;

export function CourseContentPreview({ course }: Props) {
  const sections = course.sections;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => ({
    [sections[0]?.id ?? '']: true,
  }));
  const [showAll, setShowAll] = useState(false);
  const [previewLecture, setPreviewLecture] = useState<Lecture | null>(null);

  const totalLectures = useMemo(
    () => sections.reduce((sum, s) => sum + s.lectures.length, 0),
    [sections]
  );

  const visibleSections = showAll || sections.length <= VISIBLE_SECTIONS_DEFAULT
    ? sections
    : sections.slice(0, VISIBLE_SECTIONS_DEFAULT);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    sections.forEach(s => { all[s.id] = true; });
    setExpandedSections(all);
  };
  const collapseAll = () => setExpandedSections({});

  const allExpanded = sections.every(s => expandedSections[s.id]);

  return (
    <section>
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-2">Course content</h2>
      <div className="flex items-center justify-between mb-3 text-sm text-slate-400">
        <span>
          {sections.length} sections · {totalLectures} lectures · {formatDuration(course.totalDuration)} total length
        </span>
        <button
          onClick={allExpanded ? collapseAll : expandAll}
          className="text-violet-300 hover:text-violet-200 font-medium"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'} sections
        </button>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden divide-y divide-white/10">
        {visibleSections.map(section => (
          <SectionRow
            key={section.id}
            section={section}
            expanded={!!expandedSections[section.id]}
            onToggle={() => toggleSection(section.id)}
            onPreview={setPreviewLecture}
          />
        ))}
      </div>

      {sections.length > VISIBLE_SECTIONS_DEFAULT && (
        <button
          onClick={() => setShowAll(s => !s)}
          className="mt-3 w-full py-2.5 rounded-lg border border-white/20 text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors"
        >
          {showAll
            ? `Show fewer sections`
            : `Show all ${sections.length} sections`}
        </button>
      )}

      <PreviewModal lecture={previewLecture} onClose={() => setPreviewLecture(null)} />
    </section>
  );
}

interface SectionRowProps {
  section: Section;
  expanded: boolean;
  onToggle: () => void;
  onPreview: (lecture: Lecture) => void;
}

function SectionRow({ section, expanded, onToggle, onPreview }: SectionRowProps) {
  const sectionDuration = section.lectures.reduce((s, l) => s + l.duration, 0);

  return (
    <div style={{ backgroundColor: '#22252b' }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
        aria-expanded={expanded}
        aria-controls={`section-${section.id}-content`}
      >
        {expanded
          ? <ChevronUp size={16} className="text-slate-400 shrink-0" aria-hidden />
          : <ChevronDown size={16} className="text-slate-400 shrink-0" aria-hidden />}
        <span className="flex-1 text-sm font-semibold text-white truncate">{section.title}</span>
        <span className="text-xs text-slate-400 shrink-0">
          {section.lectures.length} lectures · {formatDuration(sectionDuration)}
        </span>
      </button>
      {expanded && (
        <ul id={`section-${section.id}-content`} className="border-t border-white/10">
          {section.lectures.map(lecture => (
            <li
              key={lecture.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
            >
              {lecture.isFreePreview ? (
                <button
                  onClick={() => onPreview(lecture)}
                  className="text-violet-400 hover:text-violet-300 shrink-0"
                  aria-label={`Preview ${lecture.title}`}
                >
                  <Play size={14} className="fill-current" />
                </button>
              ) : (
                <Lock size={14} className="text-slate-500 shrink-0" aria-hidden />
              )}
              <span className="flex-1 text-sm text-slate-300 truncate">{lecture.title}</span>
              {lecture.isFreePreview && (
                <button
                  onClick={() => onPreview(lecture)}
                  className="text-xs font-semibold text-violet-300 hover:text-violet-200 shrink-0"
                >
                  Preview
                </button>
              )}
              <span className="text-xs text-slate-500 tabular-nums shrink-0 ml-2">
                {formatDuration(lecture.duration)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
