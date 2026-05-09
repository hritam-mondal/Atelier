import { useState } from 'react';
import { Star, Users, MessageSquare, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { CourseDetail } from '../../types/courseDetail';

interface Props {
  course: CourseDetail;
}

export function InstructorBio({ course }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { instructor, instructorBio } = course;
  const paragraphs = instructorBio.body.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  return (
    <section id="instructor">
      <h2 className="font-display tracking-tight text-xl font-bold text-white mb-4">Instructor</h2>

      <a href="#" className="text-violet-300 hover:text-violet-200 text-base font-semibold inline-block mb-1">
        {instructor.name}
      </a>
      <p className="text-sm text-slate-400 mb-4">{instructorBio.headline}</p>

      <div className="flex items-start gap-5 mb-5">
        <div
          className="w-32 h-32 shrink-0 rounded-full overflow-hidden bg-violet-900 flex items-center justify-center text-3xl font-bold text-violet-300"
          aria-hidden
        >
          {instructor.avatar.startsWith('http') || instructor.avatar.startsWith('/') ? (
            <img src={instructor.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            instructor.name.charAt(0)
          )}
        </div>

        <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <li className="flex items-center gap-2 text-slate-300">
            <Star size={14} className="text-amber-400" aria-hidden />
            <span><span className="text-white font-semibold">{instructorBio.avgRating}</span> instructor rating</span>
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <MessageSquare size={14} className="text-slate-400" aria-hidden />
            <span><span className="text-white font-semibold">{instructorBio.totalReviews.toLocaleString()}</span> reviews</span>
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <Users size={14} className="text-slate-400" aria-hidden />
            <span><span className="text-white font-semibold">{instructorBio.totalStudents.toLocaleString()}</span> students</span>
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <BookOpen size={14} className="text-slate-400" aria-hidden />
            <span><span className="text-white font-semibold">{instructorBio.totalCourses}</span> courses</span>
          </li>
        </ul>
      </div>

      <div
        className="relative overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: expanded ? '2000px' : '160px' }}
      >
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {!expanded && (
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent, #15171a)' }}
            aria-hidden
          />
        )}
      </div>
      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:text-violet-200"
        aria-expanded={expanded}
      >
        {expanded ? (<>Show less <ChevronUp size={14} /></>) : (<>Show more <ChevronDown size={14} /></>)}
      </button>
    </section>
  );
}
