import { Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import type { CatalogCourse } from '../../types/catalog';
import rawCatalog from '../../data/mockCatalog.json';
import mockCourse from '../../data/mockCourse.json';
import type { Course, Lecture } from '../../types/course';

const allCourses = rawCatalog as CatalogCourse[];
const localCourse = mockCourse as Course;

function findLecture(id: string): Lecture | null {
  for (const s of localCourse.sections) {
    const lecture = s.lectures.find(l => l.id === id);
    if (lecture) return lecture;
  }
  return null;
}

export function ContinueLearning() {
  const { state } = useUser();

  // Most recently accessed, in progress, not archived
  const candidate = state.enrollments
    .filter(e => !e.isArchived && e.progressPercent > 0 && e.progressPercent < 100)
    .sort((a, b) => b.lastAccessedAt.localeCompare(a.lastAccessedAt))[0];

  if (!candidate) return null;

  const course = allCourses.find(c => c.id === candidate.courseId);
  if (!course) return null;

  const lecture = findLecture(candidate.currentLectureId);
  const lectureLabel = lecture?.title ?? 'Pick up where you left off';

  return (
    <section
      className="rounded-xl border border-violet-500/20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(236,230,216,0.12) 0%, rgba(21,23,26,0.6) 60%, transparent 100%)',
      }}
      aria-label="Continue learning"
    >
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Thumbnail */}
        <Link
          to="/"
          className="relative shrink-0 w-full sm:w-72 aspect-video sm:aspect-auto sm:h-[170px] bg-gray-800 group overflow-hidden"
          aria-label={`Resume ${course.title}`}
        >
          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Play size={24} className="text-gray-900 fill-gray-900 ml-1" aria-hidden />
            </div>
          </div>
          {/* Progress bar at the bottom */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/50">
            <div
              className="h-full bg-violet-500"
              style={{ width: `${candidate.progressPercent}%` }}
            />
          </div>
        </Link>

        {/* Body */}
        <div className="flex-1 p-5 sm:p-6 min-w-0">
          <p className="text-xs uppercase tracking-wider text-violet-300 font-semibold mb-1">
            Continue where you left off
          </p>
          <h2 className="font-display tracking-tight text-lg sm:text-xl font-bold text-white mb-1 leading-tight truncate">
            {course.title}
          </h2>
          <p className="text-sm text-slate-300 mb-3 truncate">
            <span className="text-slate-500">Lecture:</span> {lectureLabel}
          </p>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex-1 max-w-md h-1.5 rounded-full bg-white/10 overflow-hidden"
              role="progressbar"
              aria-valuenow={candidate.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Course progress"
            >
              <div
                className="h-full bg-violet-500 rounded-full transition-[width]"
                style={{ width: `${candidate.progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 tabular-nums shrink-0">
              {candidate.progressPercent}% complete
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
            >
              <Play size={14} className="fill-current" aria-hidden /> Resume
            </Link>
            <Link
              to="/course"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
            >
              View course <ExternalLink size={13} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
