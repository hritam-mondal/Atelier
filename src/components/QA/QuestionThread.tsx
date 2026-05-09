import { useState } from 'react';
import { ChevronLeft, GraduationCap, CheckCircle2, Pin, MessageSquare, Send } from 'lucide-react';
import type { QAQuestion } from '../../types/qa';
import { VoteWidget } from './VoteWidget';
import { AnswerCard } from './AnswerCard';
import { MarkdownPreview } from '../../utils/renderMarkdown';
import { NoteEditor } from '../VideoPlayer/Notes/NoteEditor';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { useQA } from '../../context/QAContext';
import { useUser } from '../../context/UserContext';

interface Props {
  question: QAQuestion;
  onBack: () => void;
}

export function QuestionThread({ question, onBack }: Props) {
  const { state, dispatch, currentUserId } = useQA();
  const { state: user } = useUser();
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const answers = state.answers
    .filter(a => a.questionId === question.id && !a.parentAnswerId)
    .sort((a, b) => {
      if (a.isAcceptedAnswer !== b.isAcceptedAnswer) return a.isAcceptedAnswer ? -1 : 1;
      return b.upvotes - a.upvotes;
    });

  const isAuthor = question.authorId === currentUserId;

  const submitAnswer = () => {
    if (draft.trim().length < 10) return;
    dispatch({
      type: 'ADD_ANSWER',
      answer: {
        id: `a_${Date.now()}`,
        questionId: question.id,
        authorId: currentUserId,
        authorName: user.user.name,
        authorAvatar: user.user.avatar,
        isInstructor: false,
        body: draft.trim(),
        upvotes: 0,
        isAcceptedAnswer: false,
        createdAt: new Date().toISOString(),
      },
    });
    setDraft('');
    setComposerOpen(false);
  };

  return (
    <div className="px-4 py-3">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs mb-3 hover:opacity-70 transition-opacity"
        style={{ color: '#b8b3a7' }}
      >
        <ChevronLeft size={11} aria-hidden /> Back to all questions
      </button>

      <div className="flex gap-3 mb-4">
        <VoteWidget targetId={question.id} targetKind="question" count={question.upvotes} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {question.pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(216,197,148,0.15)', color: '#d8c594' }}>
                <Pin size={9} aria-hidden /> Pinned
              </span>
            )}
            {question.resolved && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(168,192,138,0.15)', color: '#a8c08a' }}>
                <CheckCircle2 size={9} aria-hidden /> Resolved
              </span>
            )}
            {question.isInstructor && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(236,230,216,0.10)', color: '#ece6d8' }}>
                <GraduationCap size={9} aria-hidden /> Instructor
              </span>
            )}
          </div>
          <h2 className="font-display text-base leading-snug mb-2" style={{ color: '#ece6d8' }}>
            {question.title}
          </h2>
          <MarkdownPreview source={question.body} className="text-sm leading-relaxed mb-3" />
          <div className="flex items-center gap-2">
            <img src={question.authorAvatar} alt="" className="w-5 h-5 rounded-full" loading="lazy" />
            <span className="text-xs" style={{ color: '#b8b3a7' }}>{question.authorName}</span>
            <span className="text-xs" style={{ color: '#8a857a' }}>· {formatRelativeTime(question.createdAt)}</span>
          </div>
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {question.tags.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full font-mono" style={{ backgroundColor: 'rgba(236,230,216,0.06)', color: '#b8b3a7' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Answers */}
      <div className="mb-3">
        <p className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
          {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
        </p>
        <div className="space-y-2">
          {answers.map(a => (
            <AnswerCard key={a.id} answer={a} questionId={question.id} isQuestionAuthor={isAuthor} />
          ))}
        </div>
      </div>

      {/* Reply composer */}
      {composerOpen ? (
        <div className="rounded-lg p-3" style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#ece6d8' }}>Your answer</p>
          <NoteEditor
            initialBody={draft}
            onSave={(body) => setDraft(body)}
            autoSaveMs={200}
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => { setComposerOpen(false); setDraft(''); }}
              className="px-3 py-1.5 rounded-full text-xs hover:opacity-70 transition-opacity"
              style={{ color: '#b8b3a7' }}
            >
              Cancel
            </button>
            <button
              onClick={submitAnswer}
              disabled={draft.trim().length < 10}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
            >
              <Send size={11} aria-hidden /> Post answer
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setComposerOpen(true)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ border: '1px solid rgba(236,230,216,0.20)', color: '#ece6d8' }}
        >
          <MessageSquare size={11} aria-hidden /> Add an answer
        </button>
      )}
    </div>
  );
}
