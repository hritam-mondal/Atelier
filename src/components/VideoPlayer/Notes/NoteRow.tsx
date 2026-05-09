import { useState } from 'react';
import { Trash2, Pencil, Clock } from 'lucide-react';
import type { Note } from '../../../types/notes';
import { formatTime } from '../../../utils/formatTime';
import { MarkdownPreview } from '../../../utils/renderMarkdown';
import { NoteEditor } from './NoteEditor';

interface Props {
  note: Note;
  showLecture?: boolean;
  lectureTitle?: string;
  onSeek: (timestamp: number) => void;
  onSave: (body: string, tags: string[]) => void;
  onDelete: () => void;
}

export function NoteRow({ note, showLecture, lectureTitle, onSeek, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      className="px-3 py-3 rounded-lg"
      style={{ border: '1px solid rgba(236,230,216,0.08)', backgroundColor: 'rgba(236,230,216,0.02)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => onSeek(note.timestamp)}
          className="inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded hover:opacity-80 transition-opacity tabular-nums"
          style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}
          aria-label={`Seek to ${formatTime(note.timestamp)}`}
        >
          <Clock size={10} aria-hidden /> {formatTime(note.timestamp)}
        </button>
        {showLecture && lectureTitle && (
          <span className="text-[11px] truncate" style={{ color: '#b8b3a7' }}>{lectureTitle}</span>
        )}
        <div className="flex-1" />
        {!editing && (
          <>
            <button onClick={() => setEditing(true)} className="rounded p-1 hover:opacity-70 transition-opacity" aria-label="Edit note">
              <Pencil size={12} style={{ color: '#b8b3a7' }} />
            </button>
            <button onClick={onDelete} className="rounded p-1 hover:opacity-70 transition-opacity" aria-label="Delete note">
              <Trash2 size={12} style={{ color: '#b8b3a7' }} />
            </button>
          </>
        )}
      </div>
      {editing ? (
        <NoteEditor
          initialBody={note.body}
          initialTags={note.tags}
          onSave={(body, tags) => { onSave(body, tags); }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <MarkdownPreview
          source={note.body || '*(empty note)*'}
          className="text-sm leading-relaxed"
        />
      )}
      {!editing && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(236,230,216,0.08)', color: '#b8b3a7' }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
