import { useRef, useEffect, useState } from 'react';
import { CheckCircle2, PlayCircle, Circle, Paperclip } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { LectureResources } from './LectureResources';
import { Badge } from '../shared/Badge';
import { formatTime } from '../../utils/formatTime';
import type { Lecture } from '../../types/course';

interface LectureRowProps {
  lecture: Lecture;
  searchQuery: string;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function LectureRow({ lecture, searchQuery }: LectureRowProps) {
  const { state, dispatch } = useCourse();
  const rowRef = useRef<HTMLDivElement>(null);
  const [showResources, setShowResources] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isActive = state.activeLectureId === lecture.id;
  const isCompleted = state.completedLectureIds.has(lecture.id);

  // Scroll active lecture into view
  useEffect(() => {
    if (isActive) {
      rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActive]);

  const activate = () => {
    dispatch({ type: 'SET_ACTIVE_LECTURE', lectureId: lecture.id });
    // Scroll video panel to top on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setContextMenu({ x: 0, y: 0 });
    }, 500);
  };

  const handleTouchEnd = () => clearTimeout(longPressTimer.current);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [contextMenu]);

  const markComplete = () => {
    dispatch({ type: 'MARK_COMPLETE', lectureId: lecture.id });
    setContextMenu(null);
  };
  const markIncomplete = () => {
    dispatch({ type: 'MARK_INCOMPLETE', lectureId: lecture.id });
    setContextMenu(null);
  };

  return (
    <>
      <div
        ref={rowRef}
        role="listitem"
        aria-current={isActive ? 'true' : undefined}
        className={`
          relative flex items-start gap-2 px-3 py-2.5 cursor-pointer select-none
          transition-colors rounded
          ${isActive
            ? 'bg-[#1e1b30] border-l-2 border-violet-600'
            : 'hover:bg-[#1a1a24] border-l-2 border-transparent'}
        `}
        onClick={activate}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && activate()}
      >
        {/* Status icon */}
        <span className="mt-0.5 shrink-0">
          {isCompleted ? (
            <CheckCircle2 size={16} aria-hidden="true" className="text-green-500 fill-green-500" />
          ) : isActive ? (
            <PlayCircle size={16} aria-hidden="true" className="text-violet-500" />
          ) : (
            <Circle size={16} aria-hidden="true" className="text-gray-600" />
          )}
        </span>

        {/* Title + badges */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-snug ${isCompleted ? 'text-gray-500 line-through' : isActive ? 'text-white font-medium' : 'text-gray-300'}`}>
            {highlightMatch(lecture.title, searchQuery)}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {lecture.isFreePreview && (
              <Badge variant="outline" color="accent">Preview</Badge>
            )}
            {lecture.resources.length > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowResources((v) => !v); }}
                className="inline-flex items-center gap-0.5 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={`${showResources ? 'Hide' : 'Show'} resources for ${lecture.title}`}
                aria-expanded={showResources}
              >
                <Paperclip size={11} aria-hidden="true" />
                <span className="text-[10px]">{lecture.resources.length}</span>
              </button>
            )}
          </div>
        </div>

        {/* Duration */}
        <span className="text-xs text-gray-500 tabular-nums shrink-0 mt-0.5">
          {formatTime(lecture.duration)}
        </span>
      </div>

      {/* Expandable resources */}
      {showResources && lecture.resources.length > 0 && (
        <LectureResources resources={lecture.resources} />
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          role="menu"
          aria-label="Lecture options"
          className="fixed z-50 bg-gray-900 border border-gray-700 rounded shadow-xl overflow-hidden min-w-[160px]"
          style={{ top: contextMenu.y || undefined, left: contextMenu.x || undefined,
            ...(contextMenu.x === 0 ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : {}) }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            role="menuitem"
            onClick={markComplete}
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Mark Complete
          </button>
          <button
            role="menuitem"
            onClick={markIncomplete}
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Mark Incomplete
          </button>
          <button
            role="menuitem"
            onClick={() => { navigator.clipboard.writeText(window.location.href + '#' + lecture.id); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Copy Link
          </button>
        </div>
      )}
    </>
  );
}
