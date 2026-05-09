import { useState, useMemo } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useCourse } from '../../../context/CourseContext';
import { useNotes } from '../../../hooks/useNotes';
import { NoteEditor } from './NoteEditor';
import { NoteRow } from './NoteRow';
import { exportNotesMarkdown, downloadNotes } from '../../../utils/exportNotesMarkdown';
import type { NoteScope, NoteSort } from '../../../types/notes';

interface Props {
  currentTime: number;
  onSeek: (timestamp: number) => void;
  onPause?: () => void;
}

export function NotesPanel({ currentTime, onSeek, onPause }: Props) {
  const { course, state, getLectureById } = useCourse();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [scope, setScope] = useState<NoteScope>('lecture');
  const [sort, setSort] = useState<NoteSort>('recent');
  const [query, setQuery] = useState('');
  const [composerNoteId, setComposerNoteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = notes;
    if (scope === 'lecture') list = list.filter(n => n.lectureId === state.activeLectureId);
    else if (scope === 'course') list = list.filter(n => n.courseId === course.id);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(n => n.body.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q)));
    }
    const sorted = [...list];
    if (sort === 'recent') sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    else if (sort === 'oldest') sorted.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    else sorted.sort((a, b) => a.timestamp - b.timestamp);
    return sorted;
  }, [notes, scope, sort, query, state.activeLectureId, course.id]);

  const composerNote = composerNoteId ? notes.find(n => n.id === composerNoteId) : null;

  const startNewNote = () => {
    onPause?.();
    const note = addNote(course.id, state.activeLectureId, currentTime, '');
    setComposerNoteId(note.id);
  };

  const exportAll = () => {
    const md = exportNotesMarkdown(course, notes.filter(n => n.courseId === course.id));
    downloadNotes(`${course.title.replace(/\s+/g, '-').toLowerCase()}-notes.md`, md);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: '#b8b3a7' }}>
            {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={exportAll}
              aria-label="Export all course notes"
              className="rounded p-1.5 hover:opacity-80 transition-opacity"
              style={{ color: '#b8b3a7' }}
            >
              <Download size={13} />
            </button>
            <button
              onClick={startNewNote}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
              aria-label="Add note (N)"
            >
              <Plus size={11} aria-hidden /> Note
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          {(['lecture', 'course', 'all'] as NoteScope[]).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className="px-2 py-1 rounded-full text-[11px] capitalize transition-colors"
              style={
                scope === s
                  ? { backgroundColor: 'rgba(236,230,216,0.12)', color: '#ece6d8' }
                  : { color: '#b8b3a7' }
              }
            >
              {s}
            </button>
          ))}
          <div className="flex-1" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as NoteSort)}
            className="bg-transparent outline-none text-xs cursor-pointer"
            style={{ color: '#b8b3a7' }}
            aria-label="Sort notes"
          >
            <option value="recent" style={{ backgroundColor: '#1d2025' }}>Most recent</option>
            <option value="oldest" style={{ backgroundColor: '#1d2025' }}>Oldest</option>
            <option value="timestamp" style={{ backgroundColor: '#1d2025' }}>By timestamp</option>
          </select>
        </div>

        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8a857a' }} aria-hidden />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search notes"
            className="w-full pl-7 pr-2 py-1.5 rounded text-xs bg-transparent outline-none"
            style={{ border: '1px solid rgba(236,230,216,0.10)', color: '#ece6d8' }}
            aria-label="Search notes"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {composerNote && (
          <div>
            <p className="text-[11px] mb-1.5" style={{ color: '#8a857a' }}>
              New note · auto-saving
            </p>
            <NoteEditor
              initialBody={composerNote.body}
              initialTags={composerNote.tags}
              onSave={(body, tags) => updateNote(composerNote.id, { body, tags })}
              onCancel={() => {
                if (!composerNote.body.trim()) deleteNote(composerNote.id);
                setComposerNoteId(null);
              }}
            />
          </div>
        )}

        {filtered.length === 0 && !composerNote ? (
          <div className="text-center py-12">
            <p className="font-display text-lg italic mb-2" style={{ color: '#b8b3a7' }}>
              No notes yet.
            </p>
            <p className="text-xs" style={{ color: '#8a857a' }}>
              Press <kbd className="px-1 rounded font-mono" style={{ backgroundColor: 'rgba(236,230,216,0.10)' }}>N</kbd> during playback to capture one.
            </p>
          </div>
        ) : (
          filtered
            .filter(n => n.id !== composerNoteId)
            .map(n => {
              const lecture = getLectureById(n.lectureId);
              return (
                <NoteRow
                  key={n.id}
                  note={n}
                  showLecture={scope !== 'lecture'}
                  lectureTitle={lecture?.title}
                  onSeek={onSeek}
                  onSave={(body, tags) => updateNote(n.id, { body, tags })}
                  onDelete={() => deleteNote(n.id)}
                />
              );
            })
        )}
      </div>
    </div>
  );
}
