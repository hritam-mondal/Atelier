import type { AdminState, ModerationItem, FeatureFlag, AuditLogEntry, SiteAnnouncement } from '../types/admin';

const HOUR = 3_600_000;
const DAY = 86_400_000;
function ago(ms: number): string { return new Date(Date.now() - ms).toISOString(); }

const moderation: ModerationItem[] = [
  { id: 'm1', kind: 'qa_answer',     contentId: 'a999', authorId: 'u500', authorName: 'banned_user_92', preview: 'BUY THIS CRYPTO, GUARANTEED 1000% RETURNS — link in bio', reportCount: 12, reportReasons: ['spam','offensive'], status: 'pending', reportedAt: ago(2 * HOUR) },
  { id: 'm2', kind: 'review',        contentId: 'r123', authorId: 'u501', authorName: 'angry_dev',     preview: 'Worst course ever. Instructor is [redacted slur].',          reportCount: 8,  reportReasons: ['offensive','harassment'], status: 'pending', reportedAt: ago(5 * HOUR) },
  { id: 'm3', kind: 'cohort_thread', contentId: 't88', authorId: 'u502', authorName: 'spam_account',   preview: 'Hey everyone! Check out my external course at scammy.example...', reportCount: 4,  reportReasons: ['spam'],                    status: 'pending', reportedAt: ago(12 * HOUR) },
  { id: 'm4', kind: 'profile',       contentId: 'u503', authorId: 'u503', authorName: 'fake_instr',    preview: 'Profile claims to be ex-Google but URL leads to phishing site.', reportCount: 3,  reportReasons: ['misinfo'],                 status: 'pending', reportedAt: ago(1 * DAY) },
  { id: 'm5', kind: 'qa_question',   contentId: 'q444', authorId: 'u504', authorName: 'newbie22',      preview: 'How do I cheat on the quiz?',                                  reportCount: 1,  reportReasons: ['other'],                   status: 'approved', reportedAt: ago(2 * DAY), reviewedAt: ago(1 * DAY) },
  { id: 'm6', kind: 'review',        contentId: 'r456', authorId: 'u505', authorName: 'realuser',      preview: 'Great course but the audio is uneven.',                         reportCount: 1,  reportReasons: ['other'],                   status: 'approved', reportedAt: ago(3 * DAY), reviewedAt: ago(2 * DAY) },
  { id: 'm7', kind: 'qa_answer',     contentId: 'a987', authorId: 'u506', authorName: 'troll_acct',    preview: 'Lol skill issue. Try harder.',                                  reportCount: 6,  reportReasons: ['harassment'],              status: 'removed', reportedAt: ago(4 * DAY), reviewedAt: ago(3 * DAY) },
];

const flags: FeatureFlag[] = [
  { key: 'new_player_ui',           description: 'Refreshed video player chrome',                enabled: true,  rolloutPercent: 100, audience: 'all',         updatedAt: ago(7 * DAY) },
  { key: 'ai_study_assistant',      description: 'In-lecture AI Q&A assistant',                  enabled: true,  rolloutPercent: 25,  audience: 'students',    updatedAt: ago(2 * DAY) },
  { key: 'instructor_studio_v2',    description: 'New course authoring experience',              enabled: false, rolloutPercent: 0,   audience: 'instructors', updatedAt: ago(14 * DAY) },
  { key: 'mobile_offline_download', description: 'Offline lecture downloads on mobile',          enabled: true,  rolloutPercent: 50,  audience: 'students',    updatedAt: ago(5 * DAY) },
  { key: 'team_seats',              description: 'Team & enterprise pricing flow',               enabled: false, rolloutPercent: 0,   audience: 'all',         updatedAt: ago(30 * DAY) },
  { key: 'badges_v2',               description: 'Expanded achievements catalogue',              enabled: true,  rolloutPercent: 100, audience: 'all',         updatedAt: ago(1 * DAY) },
];

const audit: AuditLogEntry[] = [
  { id: 'au1', actor: 'admin@atelier', action: 'mod.removed',    target: 'review:r-trolly-12',  at: ago(3 * HOUR) },
  { id: 'au2', actor: 'admin@atelier', action: 'flag.toggled',   target: 'badges_v2',           at: ago(8 * HOUR) },
  { id: 'au3', actor: 'admin@atelier', action: 'user.banned',    target: 'user:u500',           at: ago(1 * DAY) },
  { id: 'au4', actor: 'admin@atelier', action: 'flag.updated',   target: 'ai_study_assistant',  at: ago(2 * DAY) },
  { id: 'au5', actor: 'admin@atelier', action: 'announce.created',target: 'announcement:welcome-march', at: ago(5 * DAY) },
  { id: 'au6', actor: 'admin@atelier', action: 'mod.approved',   target: 'qa_question:q444',    at: ago(1 * DAY) },
];

const announcements: SiteAnnouncement[] = [
  {
    id: 'an1',
    message: 'Spring cohort enrolment closes May 14 · ',
    link: '/catalog',
    kind: 'info',
    startsAt: ago(7 * DAY),
    endsAt: new Date(Date.now() + 7 * DAY).toISOString(),
    active: false,
  },
];

export const initialAdminState: AdminState = {
  metrics: {
    totalUsers: 184_500,
    newUsersThisWeek: 1_240,
    totalCourses: 1_240,
    monthlyRecurring: 412_300,
    totalRevenue: 9_840_700,
    dau: 38_400,
    mau: 124_300,
    conversionRate: 0.034,
    avgSessionMinutes: 27,
    topCategories: [
      { category: 'Web Development', enrollments: 89_400 },
      { category: 'Data Science',    enrollments: 51_200 },
      { category: 'Design',          enrollments: 32_800 },
      { category: 'Business',        enrollments: 24_500 },
      { category: 'Marketing',       enrollments: 19_900 },
    ],
  },
  moderation,
  flags,
  audit,
  announcements,
};
