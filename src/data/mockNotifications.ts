import type { Notification, Badge, ScheduledEvent } from '../types/notifications';

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

function isoAgo(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}
function isoIn(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

export const mockNotifications: Notification[] = [
  { id: 'n1',  kind: 'instructor_replied',     title: 'Sarah Chen replied to your question', body: '"Great question — the trick is to remember that effects run after commit, not during render."', link: '/player', read: false, createdAt: isoAgo(2 * HOUR_MS) },
  { id: 'n2',  kind: 'streak_milestone',       title: '7-day streak!', body: 'You showed up every day this week. Keep going.', link: '/learning', read: false, createdAt: isoAgo(8 * HOUR_MS) },
  { id: 'n3',  kind: 'cohort_session_starting',title: 'Live session in 1 hour', body: 'Hooks deep-dive with Sarah Chen. Office hours start at 6:00 PM.', link: '/cohort', read: false, createdAt: isoAgo(12 * HOUR_MS), metadata: { sessionId: 'evt1' } },
  { id: 'n4',  kind: 'price_drop',             title: 'Price drop on a wishlisted course', body: 'TypeScript: Advanced Patterns is now $12.99 (down from $79.99).', link: '/course', read: true,  createdAt: isoAgo(1 * DAY_MS) },
  { id: 'n5',  kind: 'goal_progress',          title: 'Halfway to your weekly goal', body: 'You\'ve logged 92 of 180 minutes this week. Two short sessions and you\'re there.', link: '/learning', read: true,  createdAt: isoAgo(2 * DAY_MS) },
  { id: 'n6',  kind: 'new_course_in_category', title: 'New in Web Development', body: '"Distributed Architectures" by Tomás Oliveira launches Monday.', link: '/catalog?cat=Web%20Development', read: true,  createdAt: isoAgo(3 * DAY_MS) },
  { id: 'n7',  kind: 'badge_earned',           title: 'Badge unlocked: Hooked', body: 'You earned the 7-day streak badge.', link: '/learning', read: true,  createdAt: isoAgo(4 * DAY_MS), metadata: { badgeId: 'hooked' } },
  { id: 'n8',  kind: 'streak_at_risk',         title: 'Your streak ends today', body: 'Log even 5 minutes to keep it alive.', link: '/learning', read: true,  createdAt: isoAgo(5 * DAY_MS) },
  { id: 'n9',  kind: 'instructor_replied',     title: 'Maximilian replied in Vue Mastery', body: '"You\'re right — Pinia stores can absolutely be split. Here\'s an example..."', link: '/player', read: true,  createdAt: isoAgo(7 * DAY_MS) },
  { id: 'n10', kind: 'goal_progress',          title: 'Weekly goal complete', body: 'You hit your 180-minute goal. Excellent.', link: '/learning', read: true,  createdAt: isoAgo(9 * DAY_MS) },
];

export const mockBadges: Badge[] = [
  { id: 'first_steps',       name: 'First Steps',         description: 'Complete your first lecture.',                       rarity: 'common',     iconKind: 'sprout',     criteria: '1 lecture completed',           earnedAt: isoAgo(80 * DAY_MS) },
  { id: 'hooked',            name: 'Hooked',              description: '7-day learning streak.',                              rarity: 'common',     iconKind: 'flame',      criteria: '7-day streak',                  earnedAt: isoAgo(3 * DAY_MS) },
  { id: 'disciplined',       name: 'Disciplined',         description: 'Maintain a 30-day streak.',                            rarity: 'rare',       iconKind: 'shield',     criteria: '30-day streak' },
  { id: 'marathon',          name: 'Marathon',            description: 'Maintain a 100-day streak.',                           rarity: 'legendary',  iconKind: 'mountain',   criteria: '100-day streak' },
  { id: 'curious_mind',      name: 'Curious Mind',        description: 'Ask your first question.',                             rarity: 'common',     iconKind: 'help-circle',criteria: '1 question asked' },
  { id: 'helpful_hand',      name: 'Helpful Hand',        description: 'An answer of yours marked accepted.',                  rarity: 'rare',       iconKind: 'hand',       criteria: '1 accepted answer' },
  { id: 'course_finisher',   name: 'Course Finisher',     description: 'Complete an entire course.',                            rarity: 'common',     iconKind: 'flag',       criteria: '1 course finished',              earnedAt: isoAgo(7 * DAY_MS) },
  { id: 'path_walker',       name: 'Path Walker',         description: 'Finish all courses in a track.',                       rarity: 'epic',       iconKind: 'route',      criteria: '1 track finished' },
  { id: 'night_owl',         name: 'Night Owl',           description: 'Complete 5 lectures after 10 PM.',                     rarity: 'rare',       iconKind: 'moon',       criteria: '5 late-night lectures',          earnedAt: isoAgo(14 * DAY_MS) },
  { id: 'polyglot',          name: 'Polyglot',            description: 'Take courses in 3+ categories.',                       rarity: 'rare',       iconKind: 'languages',  criteria: 'Courses in 3+ categories' },
  { id: 'perfectionist',     name: 'Perfectionist',       description: 'Score 100% on 5 quizzes.',                              rarity: 'epic',       iconKind: 'target',     criteria: '5 perfect quiz scores' },
  { id: 'speedrunner',       name: 'Speedrunner',         description: 'Finish a 6-hour course in a single day.',              rarity: 'epic',       iconKind: 'zap',        criteria: 'Single-day course completion' },
];

export const mockEvents: ScheduledEvent[] = [
  { id: 'evt1', title: 'Hooks deep-dive · Office hours', description: 'Live Q&A with Sarah Chen. Bring questions about useEffect, useReducer, and custom hooks.', startsAt: isoIn(1 * HOUR_MS), endsAt: isoIn(2 * HOUR_MS), location: 'https://atelier.live/hooks-oh', reminderMinutes: [60, 15], courseId: 'c001' },
  { id: 'evt2', title: 'Vue 3 cohort kickoff',           description: 'First session of the spring cohort. Roadmap, intros, and a tour of the codebase.',          startsAt: isoIn(2 * DAY_MS), endsAt: isoIn(2 * DAY_MS + 90 * 60_000), location: 'https://atelier.live/vue-cohort-spring', reminderMinutes: [1440, 60, 15], courseId: 'c011' },
  { id: 'evt3', title: 'TypeScript advanced patterns workshop', description: 'Hands-on workshop covering mapped types, conditionals, and writing your own utility types.', startsAt: isoIn(5 * DAY_MS), endsAt: isoIn(5 * DAY_MS + 2 * HOUR_MS), location: 'https://atelier.live/ts-advanced', reminderMinutes: [1440, 60], courseId: 'c042' },
  { id: 'evt4', title: 'Open studio · Design path',     description: 'Drop-in critique session for design path students. Bring work in progress.',                  startsAt: isoIn(8 * DAY_MS), endsAt: isoIn(8 * DAY_MS + 90 * 60_000), location: 'https://atelier.live/design-studio', reminderMinutes: [1440, 60] },
];
