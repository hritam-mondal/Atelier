import { useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { computeStreak, computeLongestStreak } from '../utils/computeStreak';

export function useStreak() {
  const { state } = useUser();
  return useMemo(() => {
    const current = computeStreak(state.learningGoals.dailyMinutesLogged);
    const longest = Math.max(state.user.longestStreakDays, computeLongestStreak(state.learningGoals.dailyMinutesLogged));
    return { current, longest };
  }, [state.learningGoals.dailyMinutesLogged, state.user.longestStreakDays]);
}
