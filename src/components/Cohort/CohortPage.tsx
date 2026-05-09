import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pin, MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { useQA } from '../../context/QAContext';
import { useUser } from '../../context/UserContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { MarkdownPreview } from '../../utils/renderMarkdown';
import { NoteEditor } from '../VideoPlayer/Notes/NoteEditor';
import type { CohortThread } from '../../types/qa';

const CATEGORIES: CohortThread['category'][] = ['announcements', 'general', 'help', 'showcase', 'jobs'];

export function CohortPage() {
  const { cohortId = 'spring-2025', threadId } = useParams<{ cohortId: string; threadId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useQA();
  const { state: user } = useUser();
  const [category, setCategory] = useState<CohortThread['category'] | 'all'>('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftCategory, setDraftCategory] = useState<CohortThread['category']>('general');

  const threads = useMemo(() => {
    let list = state.cohortThreads.filter(t => t.cohortId === cohortId);
    if (category !== 'all') list = list.filter(t => t.category === category);
    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.lastReplyAt.localeCompare(a.lastReplyAt);
    });
  }, [state.cohortThreads, cohortId, category]);

  const openThread = threadId ? state.cohortThreads.find(t => t.id === threadId) : null;

  const submitThread = () => {
    if (draftTitle.trim().length < 5 || draftBody.trim().length < 10) return;
    const thread: CohortThread = {
      id: `t_${Date.now()}`,
      cohortId,
      category: draftCategory,
      title: draftTitle.trim(),
      authorId: 'u-current',
      authorName: user.user.name,
      authorAvatar: user.user.avatar,
      body: draftBody.trim(),
      replyCount: 0,
      lastReplyAt: new Date().toISOString(),
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COHORT_THREAD', thread });
    setComposerOpen(false);
    setDraftTitle(''); setDraftBody('');
    navigate(`/cohort/${cohortId}/${thread.id}`);
  };

  if (openThread) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <Link
          to={`/cohort/${cohortId}`}
          className="inline-flex items-center gap-1 text-xs hover:opacity-70 transition-opacity mb-4"
          style={{ color: '#b8b3a7' }}
        >
          <ArrowLeft size={11} aria-hidden /> Back to threads
        </Link>
        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8a857a' }}>
          {openThread.category}
        </p>
        <h1 className="font-display text-3xl tracking-tight mb-3" style={{ color: '#ece6d8' }}>
          {openThread.title}
        </h1>
        <div className="flex items-center gap-2 mb-5">
          <img src={openThread.authorAvatar} alt="" className="w-7 h-7 rounded-full" loading="lazy" />
          <span className="text-sm" style={{ color: '#ece6d8' }}>{openThread.authorName}</span>
          <span className="text-xs" style={{ color: '#8a857a' }}>· {formatRelativeTime(openThread.createdAt)}</span>
        </div>
        <MarkdownPreview source={openThread.body} className="text-sm leading-relaxed mb-8" />
        <p className="text-xs italic" style={{ color: '#8a857a' }}>
          {openThread.replyCount} {openThread.replyCount === 1 ? 'reply' : 'replies'} · Reply composer would render here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
        ✦ &nbsp; Cohort
      </p>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight" style={{ color: '#ece6d8' }}>
          Spring 2025.
        </h1>
        <button
          onClick={() => setComposerOpen(o => !o)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          <Plus size={13} aria-hidden /> New thread
        </button>
      </div>

      {composerOpen && (
        <div className="rounded-xl p-5 mb-6" style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mb-3">
            <input
              type="text"
              value={draftTitle}
              onChange={e => setDraftTitle(e.target.value.slice(0, 120))}
              placeholder="Thread title"
              className="px-3 py-2 rounded outline-none text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
            />
            <select
              value={draftCategory}
              onChange={e => setDraftCategory(e.target.value as CohortThread['category'])}
              className="px-3 py-2 rounded outline-none text-sm cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,230,216,0.15)', color: '#ece6d8' }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} style={{ backgroundColor: '#1d2025' }}>{c}</option>
              ))}
            </select>
          </div>
          <NoteEditor initialBody={draftBody} onSave={b => setDraftBody(b)} autoSaveMs={200} />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setComposerOpen(false)} className="px-4 py-2 rounded-full text-xs hover:opacity-70 transition-opacity" style={{ color: '#b8b3a7' }}>
              Cancel
            </button>
            <button
              onClick={submitThread}
              disabled={draftTitle.trim().length < 5 || draftBody.trim().length < 10}
              className="px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              Post thread
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategory('all')}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={
            category === 'all'
              ? { backgroundColor: '#ece6d8', color: '#15171a' }
              : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
          }
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize"
            style={
              category === c
                ? { backgroundColor: '#ece6d8', color: '#15171a' }
                : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
            }
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {threads.map(thread => (
          <li key={thread.id}>
            <Link
              to={`/cohort/${cohortId}/${thread.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              style={{ border: '1px solid rgba(236,230,216,0.10)' }}
            >
              <img src={thread.authorAvatar} alt="" className="w-8 h-8 rounded-full shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {thread.pinned && <Pin size={11} style={{ color: '#d8c594' }} aria-hidden />}
                  <p className="text-sm font-medium truncate" style={{ color: '#ece6d8' }}>
                    {thread.title}
                  </p>
                </div>
                <p className="text-xs" style={{ color: '#8a857a' }}>
                  <span className="capitalize">{thread.category}</span> · by {thread.authorName} · {formatRelativeTime(thread.createdAt)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs shrink-0" style={{ color: '#b8b3a7' }}>
                <MessageSquare size={11} aria-hidden /> {thread.replyCount}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
