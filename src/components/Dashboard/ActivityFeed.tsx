import { useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { groupActivityByDate } from '../../utils/groupActivityByDate';
import { ActivityItem } from './ActivityItem';
import rawCatalog from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';

const allCourses = rawCatalog as CatalogCourse[];

export function ActivityFeed() {
  const { state } = useUser();

  const groups = useMemo(
    () => groupActivityByDate(state.recentActivity.slice(0, 30)),
    [state.recentActivity]
  );

  const courseById = useMemo(
    () => new Map(allCourses.map(c => [c.id, c])),
    []
  );

  return (
    <section
      className="rounded-xl border border-white/10 p-5"
      style={{ backgroundColor: '#22252b' }}
      aria-label="Recent activity"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-white">Recent activity</h3>
        <a href="#" className="text-xs text-violet-300 hover:text-violet-200">View all</a>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">No recent activity yet. Start a lecture to see it here.</p>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.label}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 px-3">
                {group.label}
              </h4>
              <ul>
                {group.events.map(event => (
                  <ActivityItem
                    key={event.id}
                    event={event}
                    course={courseById.get(event.courseId)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
