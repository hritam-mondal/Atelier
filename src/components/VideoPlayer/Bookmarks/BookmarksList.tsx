import { Bookmark as BookmarkIcon, Trash2, Pencil, Check } from 'lucide-react';
import { useState } from 'react';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { useCourse } from '../../../context/CourseContext';
import { formatTime } from '../../../utils/formatTime';

interface Props {
  onSeek: (timestamp: number) => void;
}

export function BookmarksList({ onSeek }: Props) {
  const { bookmarks, remove, updateLabel } = useBookmarks();
  const { state, course } = useCourse();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState('');

  const lectureBookmarks = bookmarks
    .filter(b => b.lectureId === state.activeLectureId)
    .sort((a, b) => a.timestamp - b.timestamp);
  const courseBookmarks = bookmarks
    .filter(b => b.courseId === course.id && b.lectureId !== state.activeLectureId);

  const startEdit = (id: string, label?: string) => {
    setEditingId(id); setDraftLabel(label ?? '');
  };
  const commitEdit = () => {
    if (editingId) updateLabel(editingId, draftLabel);
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      <section>
        <p className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
          This lecture · {lectureBookmarks.length}
        </p>
        {lectureBookmarks.length === 0 ? (
          <p className="text-xs italic px-1" style={{ color: '#8a857a' }}>
            Press <kbd className="px-1 rounded font-mono" style={{ backgroundColor: 'rgba(236,230,216,0.10)' }}>B</kbd> to bookmark the current moment.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {lectureBookmarks.map(b => (
              <li
                key={b.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded"
                style={{ border: '1px solid rgba(236,230,216,0.08)' }}
              >
                <BookmarkIcon size={12} style={{ color: '#d8c594' }} aria-hidden />
                <button
                  onClick={() => onSeek(b.timestamp)}
                  className="font-mono text-xs tabular-nums hover:opacity-80 transition-opacity shrink-0"
                  style={{ color: '#ece6d8' }}
                >
                  {formatTime(b.timestamp)}
                </button>
                {editingId === b.id ? (
                  <input
                    type="text"
                    value={draftLabel}
                    onChange={e => setDraftLabel(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                    onBlur={commitEdit}
                    autoFocus
                    placeholder="Add a label"
                    className="flex-1 bg-transparent outline-none text-xs"
                    style={{ color: '#ece6d8' }}
                  />
                ) : (
                  <span className="flex-1 text-xs truncate" style={{ color: b.label ? '#b8b3a7' : '#8a857a' }}>
                    {b.label ?? 'Untitled'}
                  </span>
                )}
                {editingId === b.id ? (
                  <button onClick={commitEdit} aria-label="Save label" className="rounded p-1 hover:opacity-70 transition-opacity">
                    <Check size={11} style={{ color: '#a8c08a' }} />
                  </button>
                ) : (
                  <button onClick={() => startEdit(b.id, b.label)} aria-label="Edit label" className="rounded p-1 hover:opacity-70 transition-opacity">
                    <Pencil size={10} style={{ color: '#8a857a' }} />
                  </button>
                )}
                <button onClick={() => remove(b.id)} aria-label="Remove bookmark" className="rounded p-1 hover:opacity-70 transition-opacity">
                  <Trash2 size={10} style={{ color: '#8a857a' }} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {courseBookmarks.length > 0 && (
        <section>
          <p className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
            Other lectures · {courseBookmarks.length}
          </p>
          <ul className="space-y-1.5">
            {courseBookmarks.map(b => (
              <li
                key={b.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded"
                style={{ border: '1px solid rgba(236,230,216,0.08)' }}
              >
                <BookmarkIcon size={12} style={{ color: '#8a857a' }} aria-hidden />
                <span className="font-mono text-xs tabular-nums shrink-0" style={{ color: '#b8b3a7' }}>
                  {formatTime(b.timestamp)}
                </span>
                <span className="flex-1 text-xs truncate" style={{ color: '#8a857a' }}>
                  {b.label ?? 'Untitled'}
                </span>
                <button onClick={() => remove(b.id)} aria-label="Remove" className="rounded p-1 hover:opacity-70 transition-opacity">
                  <Trash2 size={10} style={{ color: '#8a857a' }} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
