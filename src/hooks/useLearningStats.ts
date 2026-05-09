import { useMemo } from 'react';
import { useUser } from '../context/UserContext';

const WEEK_MS = 7 * 86_400_000;

export function useLearningStats() {
  const { state } = useUser();

  return useMemo(() => {
    const totalMinutes = state.learningGoals.dailyMinutesLogged.reduce((s, d) => s + d.minutes, 0);

    const now = Date.now();
    const weekStart = now - WEEK_MS;
    const lastWeekStart = weekStart - WEEK_MS;
    const minutesThisWeek = state.learningGoals.dailyMinutesLogged
      .filter(d => new Date(d.date).getTime() >= weekStart)
      .reduce((s, d) => s + d.minutes, 0);
    const minutesLastWeek = state.learningGoals.dailyMinutesLogged
      .filter(d => {
        const t = new Date(d.date).getTime();
        return t >= lastWeekStart && t < weekStart;
      })
      .reduce((s, d) => s + d.minutes, 0);
    const weekDelta = minutesThisWeek - minutesLastWeek;

    const inProgress = state.enrollments.filter(e => !e.isArchived && e.progressPercent > 0 && e.progressPercent < 100);
    const completed  = state.enrollments.filter(e => e.progressPercent === 100);
    const archived   = state.enrollments.filter(e => e.isArchived);
    const notStarted = state.enrollments.filter(e => !e.isArchived && e.progressPercent === 0);

    const activeThisWeek = state.enrollments.filter(e => new Date(e.lastAccessedAt).getTime() >= weekStart && !e.isArchived);

    const lastCompleted = [...completed]
      .sort((a, b) => b.lastAccessedAt.localeCompare(a.lastAccessedAt))[0];

    const weeklyGoal = state.learningGoals.weeklyMinutes;
    const goalPercent = weeklyGoal > 0 ? Math.min(100, Math.round((minutesThisWeek / weeklyGoal) * 100)) : 0;

    return {
      totalMinutes,
      minutesThisWeek,
      weekDelta,
      inProgress,
      completed,
      archived,
      notStarted,
      activeThisWeek,
      lastCompleted,
      weeklyGoal,
      goalPercent,
    };
  }, [state]);
}
