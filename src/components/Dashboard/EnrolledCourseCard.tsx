import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, MoreVertical, Heart, Archive, Trash2, MessageSquare, Award } from 'lucide-react';
import type { CatalogCourse } from '../../types/catalog';
import type { Enrollment } from '../../types/dashboard';
import { useUser } from '../../context/UserContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

interface Props {
  course: CatalogCourse;
  enrollment: Enrollment;
  view: 'grid' | 'list';
}

export function EnrolledCourseCard({ course, enrollment, view }: Props) {
  const { dispatch } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const isCompleted = enrollment.progressPercent === 100;
  const notStarted = enrollment.progressPercent === 0;
  const ctaLabel = notStarted ? 'Start course' : isCompleted ? 'Review' : 'Resume';

  const Thumb = (
    <div className="relative w-full aspect-video bg-gray-800 overflow-hidden">
      <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center">
            <Play size={20} className="text-gray-900 fill-gray-900 ml-0.5" aria-hidden />
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
        <div
          className="h-full bg-violet-500"
          style={{ width: `${enrollment.progressPercent}%` }}
        />
      </div>
      {/* Progress text overlay */}
      <span
        className="absolute bottom-2 right-2 text-[11px] font-semibold text-white px-1.5 py-0.5 rounded"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      >
        {enrollment.progressPercent}% complete
      </span>
      {enrollment.isFavorite && (
        <span className="absolute top-2 left-2">
          <Heart size={14} className="text-rose-400 fill-rose-400 drop-shadow" aria-label="Favorite" />
        </span>
      )}
    </div>
  );

  const Menu = (
    <div ref={menuRef} className="absolute top-2 right-2 z-10">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(o => !o); }}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        aria-label="Course options"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <MoreVertical size={14} aria-hidden />
      </button>
      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-9 w-56 rounded-lg border border-white/10 shadow-2xl py-1 z-20"
          style={{ backgroundColor: '#22252b' }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuButton
            icon={<Heart size={13} className={enrollment.isFavorite ? 'fill-rose-400 text-rose-400' : ''} aria-hidden />}
            label={enrollment.isFavorite ? 'Unfavorite' : 'Mark as favorite'}
            onClick={() => { dispatch({ type: 'TOGGLE_FAVORITE', courseId: course.id }); setMenuOpen(false); }}
          />
          <MenuButton
            icon={<Archive size={13} aria-hidden />}
            label={enrollment.isArchived ? 'Unarchive' : 'Archive'}
            onClick={() => { dispatch({ type: 'TOGGLE_ARCHIVE', courseId: course.id }); setMenuOpen(false); }}
          />
          {isCompleted && (
            <>
              <MenuButton
                icon={<MessageSquare size={13} aria-hidden />}
                label="Leave a review"
                onClick={() => setMenuOpen(false)}
              />
              <MenuButton
                icon={<Award size={13} aria-hidden />}
                label="Get certificate"
                onClick={() => setMenuOpen(false)}
              />
            </>
          )}
          <div className="my-1 border-t border-white/10" />
          <MenuButton
            icon={<Trash2 size={13} aria-hidden />}
            label="Remove from My Learning"
            danger
            onClick={() => { dispatch({ type: 'REMOVE_ENROLLMENT', courseId: course.id }); setMenuOpen(false); }}
          />
        </div>
      )}
    </div>
  );

  if (view === 'list') {
    return (
      <div
        className="relative flex gap-4 p-4 rounded-xl border border-white/10 hover:border-violet-500/40 transition-colors group"
        style={{ backgroundColor: '#1d2025' }}
      >
        <Link to="/" className="shrink-0 w-44 sm:w-52 rounded-lg overflow-hidden">
          {Thumb}
        </Link>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
          <p className="text-xs text-slate-500 mb-1 truncate">{course.instructor.name}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
            <Clock size={11} aria-hidden /> Watched {formatRelativeTime(enrollment.lastAccessedAt)}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
          >
            <Play size={11} className="fill-current" aria-hidden /> {ctaLabel}
          </Link>
        </div>
        {Menu}
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col rounded-xl border border-white/10 hover:border-violet-500/40 transition-colors group overflow-hidden"
      style={{ backgroundColor: '#1d2025' }}
    >
      <Link to="/" className="block">
        {Thumb}
      </Link>
      {Menu}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-slate-500 mb-2">{course.instructor.name}</p>
        <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
          <Clock size={11} aria-hidden /> Watched {formatRelativeTime(enrollment.lastAccessedAt)}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1 w-full justify-center py-1.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
        >
          <Play size={11} className="fill-current" aria-hidden /> {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

function MenuButton({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-3 py-2 text-xs text-left transition-colors
        ${danger ? 'text-rose-400 hover:bg-rose-500/10' : 'text-slate-200 hover:bg-white/5'}`}
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </button>
  );
}
