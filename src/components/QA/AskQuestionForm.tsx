import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useQA } from '../../context/QAContext';
import { useUser } from '../../context/UserContext';
import { NoteEditor } from '../VideoPlayer/Notes/NoteEditor';

interface Props {
  courseId: string;
  lectureId?: string;
  onClose: () => void;
}

export function AskQuestionForm({ courseId, lectureId, onClose }: Props) {
  const { dispatch, currentUserId } = useQA();
  const { state: user } = useUser();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [postInLecture, setPostInLecture] = useState(!!lectureId);

  const submit = () => {
    if (title.trim().length < 10 || body.trim().length < 10) return;
    dispatch({
      type: 'ADD_QUESTION',
      question: {
        id: `q_${Date.now()}`,
        courseId,
        lectureId: postInLecture ? lectureId : undefined,
        authorId: currentUserId,
        authorName: user.user.name,
        authorAvatar: user.user.avatar,
        isInstructor: false,
        title: title.trim(),
        body: body.trim(),
        tags,
        upvotes: 0,
        answerCount: 0,
        views: 0,
        pinned: false,
        resolved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    onClose();
  };

  return (
    <div className="rounded-lg p-3 mb-3" style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: '#ece6d8' }}>Ask a question</p>
        <button onClick={onClose} aria-label="Cancel" className="p-1 hover:opacity-70 transition-opacity">
          <X size={14} style={{ color: '#b8b3a7' }} />
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value.slice(0, 120))}
        placeholder="A short, specific title (10-120 chars)"
        className="w-full px-3 py-2 rounded outline-none text-sm mb-2"
        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
      />
      <p className="text-[11px] text-right mb-2" style={{ color: '#8a857a' }}>
        {title.length} / 120
      </p>

      <NoteEditor
        initialBody={body}
        initialTags={tags}
        onSave={(b, t) => { setBody(b); setTags(t); }}
        autoSaveMs={200}
      />

      {lectureId && (
        <label className="mt-3 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={postInLecture}
            onChange={e => setPostInLecture(e.target.checked)}
            className="accent-[#ece6d8]"
          />
          <span className="text-xs" style={{ color: '#b8b3a7' }}>Post in this lecture</span>
        </label>
      )}

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-full text-xs hover:opacity-70 transition-opacity"
          style={{ color: '#b8b3a7' }}
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={title.trim().length < 10 || body.trim().length < 10}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          <Send size={11} aria-hidden /> Post question
        </button>
      </div>
    </div>
  );
}
