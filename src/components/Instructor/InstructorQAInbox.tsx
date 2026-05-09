import { useState, useMemo } from 'react';
import { GraduationCap, Send } from 'lucide-react';
import { useQA } from '../../context/QAContext';
import { useUser } from '../../context/UserContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { MarkdownPreview } from '../../utils/renderMarkdown';
import { NoteEditor } from '../VideoPlayer/Notes/NoteEditor';

const FILTERS = ['all', 'unanswered', 'mine'] as const;
type Filter = typeof FILTERS[number];

export function InstructorQAInbox() {
  const { state, dispatch, currentUserId } = useQA();
  const { state: user } = useUser();
  const [filter, setFilter] = useState<Filter>('unanswered');
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const questions = useMemo(() => {
    let list = state.questions;
    if (filter === 'unanswered') list = list.filter(q => state.answers.filter(a => a.questionId === q.id && a.isInstructor).length === 0);
    if (filter === 'mine') list = list.filter(q => state.answers.some(a => a.questionId === q.id && a.authorId === currentUserId));
    return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [state.questions, state.answers, filter, currentUserId]);

  const open = openId ? state.questions.find(q => q.id === openId) : null;
  const openAnswers = open ? state.answers.filter(a => a.questionId === open.id).sort((a, b) => b.upvotes - a.upvotes) : [];

  const submitReply = () => {
    if (!open || draft.trim().length < 10) return;
    dispatch({
      type: 'ADD_ANSWER',
      answer: {
        id: `a_${Date.now()}`,
        questionId: open.id,
        authorId: currentUserId,
        authorName: user.user.name,
        authorAvatar: user.user.avatar,
        isInstructor: true,
        body: draft.trim(),
        upvotes: 0,
        isAcceptedAnswer: false,
        createdAt: new Date().toISOString(),
      },
    });
    setDraft('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>Q&A inbox.</h1>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize"
              style={
                filter === f
                  ? { backgroundColor: '#ece6d8', color: '#15171a' }
                  : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-5">
        {/* List */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(236,230,216,0.10)' }}>
          <ul className="max-h-[70vh] overflow-y-auto">
            {questions.length === 0 ? (
              <li className="px-4 py-12 text-center text-sm" style={{ color: '#8a857a' }}>
                Nothing in this view.
              </li>
            ) : (
              questions.map(q => {
                const isOpen = q.id === openId;
                return (
                  <li key={q.id}>
                    <button
                      onClick={() => { setOpenId(q.id); setDraft(''); }}
                      className="w-full text-left px-3 py-3 border-b transition-colors"
                      style={{
                        borderColor: 'rgba(236,230,216,0.08)',
                        backgroundColor: isOpen ? 'rgba(236,230,216,0.06)' : 'transparent',
                      }}
                    >
                      <p className="text-sm leading-snug truncate" style={{ color: '#ece6d8' }}>{q.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#8a857a' }}>
                        {q.authorName} · {formatRelativeTime(q.createdAt)}
                      </p>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Detail */}
        <div className="rounded-xl p-5" style={{ border: '1px solid rgba(236,230,216,0.10)' }}>
          {!open ? (
            <p className="text-center py-12 text-sm" style={{ color: '#8a857a' }}>
              Select a question to reply.
            </p>
          ) : (
            <>
              <h2 className="font-display text-xl tracking-tight mb-2" style={{ color: '#ece6d8' }}>{open.title}</h2>
              <p className="text-xs mb-4" style={{ color: '#8a857a' }}>
                Asked by {open.authorName} · {formatRelativeTime(open.createdAt)}
              </p>
              <MarkdownPreview source={open.body} className="text-sm leading-relaxed mb-6" />

              {openAnswers.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: '#b8b3a7' }}>
                    {openAnswers.length} {openAnswers.length === 1 ? 'answer' : 'answers'}
                  </p>
                  {openAnswers.map(a => (
                    <div key={a.id} className="px-3 py-2 rounded-lg" style={{ border: '1px solid rgba(236,230,216,0.08)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs" style={{ color: '#ece6d8' }}>{a.authorName}</span>
                        {a.isInstructor && <GraduationCap size={11} style={{ color: '#ece6d8' }} aria-hidden />}
                        <span className="text-[11px] ml-auto" style={{ color: '#8a857a' }}>{formatRelativeTime(a.createdAt)}</span>
                      </div>
                      <MarkdownPreview source={a.body} className="text-sm leading-relaxed" />
                    </div>
                  ))}
                </div>
              )}

              {/* Reply composer */}
              <div className="rounded-lg p-3" style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#ece6d8' }}>Your reply (instructor)</p>
                <NoteEditor initialBody={draft} onSave={b => setDraft(b)} autoSaveMs={200} />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={submitReply}
                    disabled={draft.trim().length < 10}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
                  >
                    <Send size={11} aria-hidden /> Post reply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
