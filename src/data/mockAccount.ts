import type { AuthState, NotificationPrefs, NotificationEventKey } from '../types/account';

const DAY_MS = 86_400_000;
function isoAgo(days: number, hour = 12): string {
  const d = new Date(Date.now() - days * DAY_MS);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const EVENT_KEYS: NotificationEventKey[] = [
  'course_update',
  'instructor_reply',
  'cohort_session',
  'streak_reminder',
  'goal_progress',
  'new_review',
  'price_drop',
  'new_course_in_category',
];

export const defaultNotificationPrefs: NotificationPrefs = {
  events: Object.fromEntries(
    EVENT_KEYS.map(k => [
      k,
      {
        inApp: true,
        email: ['instructor_reply', 'cohort_session', 'streak_reminder', 'price_drop'].includes(k),
        push: ['cohort_session', 'instructor_reply'].includes(k),
      },
    ])
  ) as Record<NotificationEventKey, { inApp: boolean; email: boolean; push: boolean }>,
  digestFrequency: 'weekly',
  marketing: false,
};

export const eventDescriptions: Record<NotificationEventKey, { label: string; description: string }> = {
  course_update:           { label: 'Course updates',         description: 'When an instructor publishes new lectures in a course you own.' },
  instructor_reply:        { label: 'Instructor replies',     description: 'When an instructor answers your question.' },
  cohort_session:          { label: 'Cohort sessions',        description: 'Reminders for upcoming live sessions.' },
  streak_reminder:         { label: 'Streak reminders',       description: 'A nudge when your streak is at risk.' },
  goal_progress:           { label: 'Goal progress',          description: 'Hitting halfway and full weekly goal.' },
  new_review:              { label: 'New reviews',            description: 'Reviews on courses you teach (instructors only).' },
  price_drop:              { label: 'Price drops',            description: 'Wishlisted courses go on sale.' },
  new_course_in_category:  { label: 'New in a category',      description: 'New launches in categories you watch.' },
};

export const initialAuthState: AuthState = {
  signedIn: false,
  email: '',
  role: 'student',
  emailVerified: false,
  twoFactorEnabled: false,
  profile: {
    bio: 'Senior PM at a fintech, learning React in my spare hours. Plant-based mostly, runs a slow half-marathon every spring.',
    headline: 'Senior PM · Building learning habits',
    socialLinks: [
      { kind: 'twitter',  url: 'https://twitter.com/sarahm' },
      { kind: 'github',   url: 'https://github.com/sarahm' },
      { kind: 'linkedin', url: 'https://linkedin.com/in/sarah-mitchell' },
    ],
    timezone: 'America/New_York',
    language: 'en',
  },
  notificationPrefs: defaultNotificationPrefs,
  oauthConnections: [
    { provider: 'google', email: 'sarah@example.com', connectedAt: isoAgo(180) },
  ],
  sessions: [
    { id: 'sess_1', device: 'MacBook Pro · Chrome 130',  ipMasked: '73.x.x.42', location: 'Brooklyn, NY',     lastActiveAt: isoAgo(0, 9),  current: true },
    { id: 'sess_2', device: 'iPhone 15 · Safari',         ipMasked: '73.x.x.42', location: 'Brooklyn, NY',     lastActiveAt: isoAgo(1, 7),  current: false },
    { id: 'sess_3', device: 'Windows 11 · Edge 129',      ipMasked: '108.x.x.7', location: 'Boston, MA',        lastActiveAt: isoAgo(8, 14), current: false },
    { id: 'sess_4', device: 'iPad · Safari',              ipMasked: '73.x.x.42', location: 'Brooklyn, NY',     lastActiveAt: isoAgo(20, 22), current: false },
  ],
  securityLog: [
    { id: 'log_1', kind: 'login',           at: isoAgo(0, 9),   ipMasked: '73.x.x.42', device: 'MacBook Pro · Chrome' },
    { id: 'log_2', kind: 'login',           at: isoAgo(1, 7),   ipMasked: '73.x.x.42', device: 'iPhone 15 · Safari' },
    { id: 'log_3', kind: 'oauth_connected', at: isoAgo(180),    ipMasked: '73.x.x.42', device: 'MacBook Pro · Chrome' },
    { id: 'log_4', kind: 'password_change', at: isoAgo(45),     ipMasked: '73.x.x.42', device: 'MacBook Pro · Chrome' },
    { id: 'log_5', kind: 'login',           at: isoAgo(8, 14),  ipMasked: '108.x.x.7', device: 'Windows 11 · Edge' },
  ],
};
