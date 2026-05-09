import { Link, useParams } from 'react-router-dom';
import { Star, Users, BookOpen, MessageSquare } from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { TopNav } from '../shared/TopNav';

export function InstructorPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state: instructor } = useInstructor();
  const { state: user } = useUser();
  const { state: auth } = useAuth();
  const stats = instructor.stats;
  const courses = instructor.drafts.filter(d => d.status === 'published');

  return (
    <>
      <TopNav />
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#b8b3a7' }}>
          ✦ &nbsp; Instructor profile
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          <div className="w-28 h-28 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: 'rgba(236,230,216,0.08)' }}>
            {user.user.avatar ? (
              <img src={user.user.avatar} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-2" style={{ color: '#ece6d8' }}>
              {user.user.name}
            </h1>
            <p className="text-sm mb-3" style={{ color: '#b8b3a7' }}>{auth.profile.headline}</p>
            <p className="text-[11px] mb-4" style={{ color: '#8a857a' }}>@{slug}</p>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#ece6d8' }}>
              {auth.profile.bio}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          <Stat icon={Users}        label="Students taught"  value={stats.totalStudents.toLocaleString()} />
          <Stat icon={Star}         label="Average rating"   value={stats.avgRating.toFixed(1)} />
          <Stat icon={BookOpen}     label="Courses"          value={String(courses.length)} />
          <Stat icon={MessageSquare}label="Q&A answered"     value="2,840" />
        </div>

        <h2 className="font-display tracking-tight text-2xl mb-5" style={{ color: '#ece6d8' }}>
          Published courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(c => (
            <Link
              key={c.id}
              to="/course"
              className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
              style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: '#22252b' }}
            >
              {c.thumbnail && (
                <img src={c.thumbnail} alt="" className="w-full aspect-video object-cover" loading="lazy" />
              )}
              <div className="p-4">
                <p className="text-sm font-medium leading-snug truncate" style={{ color: '#ece6d8' }}>{c.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#8a857a' }}>
                  {c.enrollments.toLocaleString()} students · {c.rating.toFixed(1)} ★
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl p-4" style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.02)' }}>
      <Icon size={14} style={{ color: '#b8b3a7' }} className="mb-2" aria-hidden />
      <p className="text-xs" style={{ color: '#8a857a' }}>{label}</p>
      <p className="font-display text-xl tabular-nums" style={{ color: '#ece6d8' }}>{value}</p>
    </div>
  );
}
