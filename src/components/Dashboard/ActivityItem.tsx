import { Link } from 'react-router-dom';
import { CheckCircle2, GraduationCap, FileText, Award, Brain, ArrowRight } from 'lucide-react';
import type { ActivityEvent, ActivityType } from '../../types/dashboard';
import type { CatalogCourse } from '../../types/catalog';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

interface Props {
  event: ActivityEvent;
  course?: CatalogCourse;
}

const ICON_BY_TYPE: Record<ActivityType, React.ReactNode> = {
  lecture_completed:  <CheckCircle2 size={14} className="text-emerald-400" aria-hidden />,
  course_completed:   <GraduationCap size={14} className="text-violet-400" aria-hidden />,
  quiz_passed:        <Brain size={14} className="text-sky-400" aria-hidden />,
  note_added:         <FileText size={14} className="text-amber-400" aria-hidden />,
  certificate_earned: <Award size={14} className="text-rose-400" aria-hidden />,
};

function describe(event: ActivityEvent, course?: CatalogCourse): string {
  const courseTitle = course?.title ?? 'a course';
  const lectureTitle = (event.metadata?.lectureTitle as string | undefined);
  const quizTitle = (event.metadata?.quizTitle as string | undefined);
  const score = (event.metadata?.score as number | undefined);
  switch (event.type) {
    case 'lecture_completed':
      return lectureTitle ? `Completed lecture "${lectureTitle}" in ${courseTitle}` : `Completed a lecture in ${courseTitle}`;
    case 'course_completed':
      return `Finished course "${courseTitle}"`;
    case 'quiz_passed':
      return quizTitle ? `Passed quiz "${quizTitle}"${score ? ` (${score}%)` : ''} in ${courseTitle}` : `Passed a quiz in ${courseTitle}`;
    case 'note_added':
      return lectureTitle ? `Added a note in "${lectureTitle}"` : `Added a note in ${courseTitle}`;
    case 'certificate_earned':
      return `Earned a certificate for "${courseTitle}"`;
  }
}

export function ActivityItem({ event, course }: Props) {
  return (
    <li className="group flex items-start gap-3 px-3 py-2 rounded-md hover:bg-white/[0.03] transition-colors">
      <span className="mt-0.5 shrink-0">{ICON_BY_TYPE[event.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 leading-snug">{describe(event, course)}</p>
        <p className="text-xs text-slate-500 mt-0.5">{formatRelativeTime(event.timestamp)}</p>
      </div>
      <Link
        to="/"
        className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200 shrink-0 self-center"
      >
        Go to lecture <ArrowRight size={11} aria-hidden />
      </Link>
    </li>
  );
}
