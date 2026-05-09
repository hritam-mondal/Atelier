import { useState, useMemo } from 'react';
import { Plus, Search, MessageSquare, CheckCircle2, GraduationCap, Pin } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useQA } from '../../context/QAContext';
import { VoteWidget } from './VoteWidget';
import { AskQuestionForm } from './AskQuestionForm';
import { QuestionThread } from './QuestionThread';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import type { QAFilter, QASort } from '../../types/qa';

export function QAPanel() {
  const { course, state: courseState } = useCourse();
  const { state: qa, currentUserId } = useQA();
  const [filter, setFilter] = useState<QAFilter>('lecture');
  const [sort, setSort] = useState<QASort>('top');
  const [query, setQuery] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = qa.questions.filter(q => q.courseId === course.id);
    if (filter === 'lecture') list = list.filter(q => q.lectureId === courseState.activeLectureId);
    else if (filter === 'instructor') list = list.filter(q => qa.answers.some(a => a.questionId === q.id && a.isInstructor));
    else if (filter === 'open') list = list.filter(q => !q.resolved);
    else if (filter === 'resolved') list = list.filter(q => q.resolved);
    else if (filter === 'mine') list = list.filter(q => q.authorId === currentUserId);
    if (query.trim()) {
      const qq = query.toLowerCase();
      list = list.filter(q => q.title.toLowerCase().includes(qq) || q.body.toLowerCase().includes(qq));
    }
    const sorted = [...list];
    sorted.sort((a, b) => {
      // Pinned always first
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      switch (sort) {
        case 'recent':       return b.updatedAt.localeCompare(a.updatedAt);
        case 'top':          return b.upvotes - a.upvotes;
        case 'most-answers': return b.answerCount - a.answerCount;
        case 'mine':         return b.updatedAt.localeCompare(a.updatedAt);
      }
    });
    return sorted;
  }, [qa.questions, qa.answers, course.id, courseState.activeLectureId, filter, sort, query, currentUserId]);

  const openQuestion = openQuestionId ? qa.questions.find(q => q.id === openQuestionId) : null;

  if (openQuestion) {
    return (
      <div className="flex-1 overflow-y-auto">
        <QuestionThread question={openQuestion} onBack={() => setOpenQuestionId(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: '#b8b3a7' }}>
            {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}
          </p>
          <button
            onClick={() => setComposerOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            <Plus size={11} aria-hidden /> Ask
          </button>
        </div>

        <div className="flex items-center gap-1 mb-2 overflow-x-auto">
          {(['lecture', 'all', 'instructor', 'open', 'resolved', 'mine'] as QAFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-2 py-1 rounded-full text-[11px] capitalize transition-colors whitespace-nowrap"
              style={
                filter === f
                  ? { backgroundColor: 'rgba(236,230,216,0.12)', color: '#ece6d8' }
                  : { color: '#b8b3a7' }
              }
            >
              {f === 'instructor' ? 'Instructor' : f}
            </button>
          ))}
          <div className="flex-1" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as QASort)}
            className="bg-transparent outline-none text-xs cursor-pointer"
            style={{ color: '#b8b3a7' }}
            aria-label="Sort questions"
          >
            <option value="top" style={{ backgroundColor: '#1d2025' }}>Top</option>
            <option value="recent" style={{ backgroundColor: '#1d2025' }}>Recent</option>
            <option value="most-answers" style={{ backgroundColor: '#1d2025' }}>Most answers</option>
          </select>
        </div>

        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8a857a' }} aria-hidden />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search questions"
            className="w-full pl-7 pr-2 py-1.5 rounded text-xs bg-transparent outline-none"
            style={{ border: '1px solid rgba(236,230,216,0.10)', color: '#ece6d8' }}
            aria-label="Search Q&A"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {composerOpen && (
          <AskQuestionForm
            courseId={course.id}
            lectureId={courseState.activeLectureId}
            onClose={() => setComposerOpen(false)}
          />
        )}

        {filtered.length === 0 && !composerOpen ? (
          <div className="text-center py-12">
            <MessageSquare size={28} className="mx-auto mb-3" style={{ color: '#8a857a' }} aria-hidden />
            <p className="font-display text-base italic mb-1" style={{ color: '#b8b3a7' }}>
              No questions yet.
            </p>
            <p className="text-xs" style={{ color: '#8a857a' }}>
              Be the first to ask.
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {filtered.map(q => {
              const hasInstructorAnswer = qa.answers.some(a => a.questionId === q.id && a.isInstructor);
              return (
                <li key={q.id}>
                  <button
                    onClick={() => setOpenQuestionId(q.id)}
                    className="w-full text-left flex gap-3 px-2 py-2 rounded hover:bg-white/[0.03] transition-colors"
                  >
                    <VoteWidget targetId={q.id} targetKind="question" count={q.upvotes} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {q.pinned && <Pin size={10} style={{ color: '#d8c594' }} aria-hidden />}
                        {q.resolved && <CheckCircle2 size={10} style={{ color: '#a8c08a' }} aria-hidden />}
                        {hasInstructorAnswer && <GraduationCap size={10} style={{ color: '#ece6d8' }} aria-hidden />}
                      </div>
                      <p className="text-sm leading-snug truncate" style={{ color: '#ece6d8' }}>{q.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#8a857a' }}>
                        {q.authorName} · {formatRelativeTime(q.createdAt)} · {q.answerCount} answers
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
