import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { formatMoney, formatInvoiceDate } from '../../utils/formatInvoice';
import type { CourseDraftStatus } from '../../types/instructor';

const TABS: { key: 'all' | CourseDraftStatus; label: string }[] = [
  { key: 'all',         label: 'All' },
  { key: 'published',   label: 'Published' },
  { key: 'draft',       label: 'Draft' },
  { key: 'in_review',   label: 'In review' },
  { key: 'archived',    label: 'Archived' },
];

const STATUS_COLORS: Record<CourseDraftStatus, string> = {
  draft:     '#d8c594',
  in_review: '#aabacb',
  published: '#a8c08a',
  archived:  '#8a857a',
};

export function CourseListPage() {
  const { state, dispatch } = useInstructor();
  const [tab, setTab] = useState<typeof TABS[number]['key']>('all');

  const filtered = state.drafts.filter(d => tab === 'all' || d.status === tab);

  const newCourse = () => {
    const id = `inst-c_${Date.now()}`;
    dispatch({
      type: 'CREATE_DRAFT',
      draft: {
        id, status: 'draft',
        title: 'Untitled course',
        subtitle: '',
        category: 'Web Development',
        level: 'beginner',
        language: 'English',
        whatYouLearn: [],
        requirements: [],
        longDescription: '',
        price: 0,
        enrollments: 0, rating: 0, reviewCount: 0, revenueLifetime: 0,
        sections: [],
        lastUpdatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl tracking-tight" style={{ color: '#ece6d8' }}>
          Courses.
        </h1>
        <button
          onClick={newCourse}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
        >
          <Plus size={13} aria-hidden /> New course
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={
              tab === t.key
                ? { backgroundColor: '#ece6d8', color: '#15171a' }
                : { border: '1px solid rgba(236,230,216,0.15)', color: '#b8b3a7' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(236,230,216,0.10)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal" style={{ color: '#8a857a' }}>Course</th>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal hidden md:table-cell" style={{ color: '#8a857a' }}>Status</th>
              <th className="text-right px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal hidden lg:table-cell" style={{ color: '#8a857a' }}>Students</th>
              <th className="text-right px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal hidden lg:table-cell" style={{ color: '#8a857a' }}>Revenue</th>
              <th className="text-right px-4 py-3 text-[11px] tracking-[0.18em] uppercase font-normal hidden md:table-cell" style={{ color: '#8a857a' }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: '#8a857a' }}>
                  No courses in this view.
                </td>
              </tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-white/[0.02] transition-colors" style={{ borderColor: 'rgba(236,230,216,0.08)' }}>
                  <td className="px-4 py-3">
                    <Link to={`/instructor/courses/${c.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      {c.thumbnail ? (
                        <img src={c.thumbnail} alt="" className="w-14 aspect-video rounded object-cover shrink-0" loading="lazy" />
                      ) : (
                        <div className="w-14 aspect-video rounded shrink-0" style={{ backgroundColor: 'rgba(236,230,216,0.06)' }} />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm truncate" style={{ color: '#ece6d8' }}>{c.title}</p>
                        <p className="text-xs" style={{ color: '#8a857a' }}>{c.sections.length} sections · {c.sections.reduce((s, sec) => s + sec.lectures.length, 0)} lectures</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${STATUS_COLORS[c.status]}1a`,
                        color: STATUS_COLORS[c.status],
                        border: `1px solid ${STATUS_COLORS[c.status]}66`,
                      }}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden lg:table-cell" style={{ color: '#ece6d8' }}>
                    {c.enrollments.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden lg:table-cell" style={{ color: '#ece6d8' }}>
                    {formatMoney(c.revenueLifetime)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs hidden md:table-cell" style={{ color: '#b8b3a7' }}>
                    {formatInvoiceDate(c.lastUpdatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
