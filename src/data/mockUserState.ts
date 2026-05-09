import type {
  UserState,
  Enrollment,
  ActivityEvent,
  Certificate,
  WeeklyMinuteEntry,
  DailyMinuteEntry,
} from '../types/dashboard';

// ─── Helpers ─────────────────────────────────────────────────────────────
const DAY_MS = 86_400_000;
const today = new Date();
today.setHours(0, 0, 0, 0);

function isoDate(daysAgo: number): string {
  const d = new Date(today.getTime() - daysAgo * DAY_MS);
  return d.toISOString().split('T')[0];
}
function isoDateTime(daysAgo: number, hour = 14, minute = 0): string {
  const d = new Date(today.getTime() - daysAgo * DAY_MS);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ─── Daily minutes (last 84 days for the heatmap) ───────────────────────
// Pattern: some 0, growing in the recent 2 weeks for a 7-day streak
function buildDailyMinutes(): DailyMinuteEntry[] {
  const entries: DailyMinuteEntry[] = [];
  // Deterministic pseudo-random based on index
  const seed = (n: number) => Math.abs(Math.sin(n * 9301 + 49297) * 233280) % 1;
  for (let i = 83; i >= 0; i--) {
    const date = isoDate(i);
    let minutes: number;
    if (i < 7) {
      // Last 7 days: streak — every day at least 15 min
      minutes = 15 + Math.floor(seed(i) * 65); // 15-79 min
    } else if (i < 14) {
      // Two weeks ago: mix
      minutes = seed(i) > 0.4 ? 20 + Math.floor(seed(i + 1) * 50) : 0;
    } else if (i < 35) {
      // ~5 weeks back: moderate activity
      minutes = seed(i) > 0.55 ? Math.floor(seed(i + 2) * 90) : 0;
    } else {
      // Older: sparse
      minutes = seed(i) > 0.7 ? Math.floor(seed(i + 3) * 60) : 0;
    }
    entries.push({ date, minutes });
  }
  return entries;
}

const dailyMinutesLogged: DailyMinuteEntry[] = buildDailyMinutes();

// ─── Weekly minutes (last 12 weeks, derived from daily) ─────────────────
function buildWeekly(): WeeklyMinuteEntry[] {
  const weeks: WeeklyMinuteEntry[] = [];
  for (let w = 11; w >= 0; w--) {
    const weekStartDate = new Date(today.getTime() - (w * 7 + today.getDay()) * DAY_MS);
    weekStartDate.setHours(0, 0, 0, 0);
    const startIso = weekStartDate.toISOString().split('T')[0];
    let total = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStartDate.getTime() + d * DAY_MS).toISOString().split('T')[0];
      const entry = dailyMinutesLogged.find(e => e.date === date);
      total += entry?.minutes ?? 0;
    }
    weeks.push({ weekStart: startIso, minutes: total });
  }
  return weeks;
}

// ─── Enrollments ─────────────────────────────────────────────────────────
const enrollments: Enrollment[] = [
  // Most-recently accessed → drives Continue Learning hero
  {
    courseId: 'c001',
    enrolledAt: isoDateTime(45, 9),
    lastAccessedAt: isoDateTime(0, 19, 14),
    progressPercent: 42,
    completedLectureIds: ['l1', 'l2', 'l3', 'l4', 'l5'],
    currentLectureId: 'l6',
    currentLectureTime: 187,
    isArchived: false,
    isFavorite: true,
  },
  {
    courseId: 'c003',
    enrolledAt: isoDateTime(32, 11),
    lastAccessedAt: isoDateTime(2, 20, 5),
    progressPercent: 75,
    completedLectureIds: [],
    currentLectureId: '',
    isArchived: false,
    isFavorite: false,
  },
  {
    courseId: 'c011',
    enrolledAt: isoDateTime(28, 17),
    lastAccessedAt: isoDateTime(5, 12, 30),
    progressPercent: 15,
    completedLectureIds: [],
    currentLectureId: '',
    isArchived: false,
    isFavorite: false,
  },
  {
    courseId: 'c020',
    enrolledAt: isoDateTime(60, 18),
    lastAccessedAt: isoDateTime(8, 21, 0),
    progressPercent: 100,
    completedLectureIds: [],
    currentLectureId: '',
    isArchived: false,
    isFavorite: false,
  },
  {
    courseId: 'c042',
    enrolledAt: isoDateTime(70, 14),
    lastAccessedAt: isoDateTime(14, 16, 22),
    progressPercent: 100,
    completedLectureIds: [],
    currentLectureId: '',
    isArchived: false,
    isFavorite: true,
  },
  {
    courseId: 'c024',
    enrolledAt: isoDateTime(20, 10),
    lastAccessedAt: isoDateTime(11, 18, 0),
    progressPercent: 0,
    completedLectureIds: [],
    currentLectureId: '',
    isArchived: false,
    isFavorite: false,
  },
  {
    courseId: 'c027',
    enrolledAt: isoDateTime(55, 13),
    lastAccessedAt: isoDateTime(3, 22, 11),
    progressPercent: 62,
    completedLectureIds: [],
    currentLectureId: '',
    isArchived: false,
    isFavorite: false,
  },
  {
    courseId: 'c030',
    enrolledAt: isoDateTime(90, 19),
    lastAccessedAt: isoDateTime(40, 17, 0),
    progressPercent: 100,
    completedLectureIds: [],
    currentLectureId: '',
    isArchived: true,
    isFavorite: false,
  },
];

// ─── Certificates ────────────────────────────────────────────────────────
const certificates: Certificate[] = [
  { id: 'cert-1', courseId: 'c020', issuedAt: isoDateTime(7),  certificateNumber: 'UC-A0F3B7D2-2025-NEXT' },
  { id: 'cert-2', courseId: 'c042', issuedAt: isoDateTime(13), certificateNumber: 'UC-9E2C4A11-2025-TS' },
  { id: 'cert-3', courseId: 'c030', issuedAt: isoDateTime(38), certificateNumber: 'UC-6B17F0A9-2024-PHOTO' },
];

// ─── Activity events ─────────────────────────────────────────────────────
const recentActivity: ActivityEvent[] = [
  { id: 'a1',  type: 'lecture_completed', courseId: 'c001', lectureId: 'l5', timestamp: isoDateTime(0, 19, 12), metadata: { lectureTitle: 'Props and State' } },
  { id: 'a2',  type: 'lecture_completed', courseId: 'c001', lectureId: 'l4', timestamp: isoDateTime(0, 18, 5),  metadata: { lectureTitle: 'JSX Deep Dive' } },
  { id: 'a3',  type: 'note_added',        courseId: 'c001', lectureId: 'l4', timestamp: isoDateTime(0, 17, 47), metadata: { lectureTitle: 'JSX Deep Dive' } },
  { id: 'a4',  type: 'lecture_completed', courseId: 'c003', timestamp: isoDateTime(1, 20, 1),                  metadata: { lectureTitle: 'Pandas DataFrames' } },
  { id: 'a5',  type: 'quiz_passed',       courseId: 'c003', timestamp: isoDateTime(1, 19, 30),                 metadata: { quizTitle: 'NumPy Fundamentals', score: 92 } },
  { id: 'a6',  type: 'lecture_completed', courseId: 'c001', lectureId: 'l3', timestamp: isoDateTime(2, 21, 14), metadata: { lectureTitle: 'Your First React App' } },
  { id: 'a7',  type: 'lecture_completed', courseId: 'c027', timestamp: isoDateTime(2, 17, 32),                 metadata: { lectureTitle: 'DAX Basics' } },
  { id: 'a8',  type: 'note_added',        courseId: 'c027', timestamp: isoDateTime(3, 22, 5),                  metadata: { lectureTitle: 'Power Query Editor' } },
  { id: 'a9',  type: 'lecture_completed', courseId: 'c003', timestamp: isoDateTime(3, 18, 0),                  metadata: { lectureTitle: 'Matplotlib Plots' } },
  { id: 'a10', type: 'lecture_completed', courseId: 'c001', lectureId: 'l2', timestamp: isoDateTime(4, 20, 19), metadata: { lectureTitle: 'Setting Up Your Environment' } },
  { id: 'a11', type: 'lecture_completed', courseId: 'c001', lectureId: 'l1', timestamp: isoDateTime(4, 20, 0),  metadata: { lectureTitle: 'Course Overview' } },
  { id: 'a12', type: 'lecture_completed', courseId: 'c011', timestamp: isoDateTime(5, 12, 30),                 metadata: { lectureTitle: 'Composition API Basics' } },
  { id: 'a13', type: 'quiz_passed',       courseId: 'c011', timestamp: isoDateTime(5, 13, 0),                  metadata: { quizTitle: 'Vue Reactivity', score: 88 } },
  { id: 'a14', type: 'lecture_completed', courseId: 'c027', timestamp: isoDateTime(6, 22, 0),                  metadata: { lectureTitle: 'Visual Best Practices' } },
  { id: 'a15', type: 'certificate_earned',courseId: 'c020', timestamp: isoDateTime(7, 21, 0),                  metadata: { certificateId: 'cert-1' } },
  { id: 'a16', type: 'course_completed',  courseId: 'c020', timestamp: isoDateTime(7, 20, 50),                 metadata: {} },
  { id: 'a17', type: 'lecture_completed', courseId: 'c020', timestamp: isoDateTime(7, 20, 30),                 metadata: { lectureTitle: 'Deploying to Vercel' } },
  { id: 'a18', type: 'lecture_completed', courseId: 'c020', timestamp: isoDateTime(8, 21, 0),                  metadata: { lectureTitle: 'Server Actions in Practice' } },
  { id: 'a19', type: 'lecture_completed', courseId: 'c020', timestamp: isoDateTime(9, 19, 0),                  metadata: { lectureTitle: 'App Router Patterns' } },
  { id: 'a20', type: 'note_added',        courseId: 'c003', timestamp: isoDateTime(9, 17, 11),                 metadata: { lectureTitle: 'Linear Regression' } },
  { id: 'a21', type: 'lecture_completed', courseId: 'c011', timestamp: isoDateTime(10, 14, 20),                metadata: { lectureTitle: 'Pinia Store' } },
  { id: 'a22', type: 'lecture_completed', courseId: 'c027', timestamp: isoDateTime(11, 19, 14),                metadata: { lectureTitle: 'Connecting to Data Sources' } },
  { id: 'a23', type: 'lecture_completed', courseId: 'c003', timestamp: isoDateTime(11, 13, 30),                metadata: { lectureTitle: 'Cleaning Missing Data' } },
  { id: 'a24', type: 'note_added',        courseId: 'c027', timestamp: isoDateTime(12, 17, 0),                 metadata: { lectureTitle: 'Modeling Your Data' } },
  { id: 'a25', type: 'certificate_earned',courseId: 'c042', timestamp: isoDateTime(13, 16, 22),                metadata: { certificateId: 'cert-2' } },
  { id: 'a26', type: 'course_completed',  courseId: 'c042', timestamp: isoDateTime(13, 16, 10),                metadata: {} },
  { id: 'a27', type: 'lecture_completed', courseId: 'c042', timestamp: isoDateTime(13, 15, 45),                metadata: { lectureTitle: 'Building Type-Safe Libraries' } },
  { id: 'a28', type: 'quiz_passed',       courseId: 'c042', timestamp: isoDateTime(14, 11, 0),                 metadata: { quizTitle: 'Conditional Types', score: 95 } },
  { id: 'a29', type: 'lecture_completed', courseId: 'c042', timestamp: isoDateTime(15, 18, 30),                metadata: { lectureTitle: 'Mapped Types Deep Dive' } },
  { id: 'a30', type: 'lecture_completed', courseId: 'c003', timestamp: isoDateTime(16, 20, 0),                 metadata: { lectureTitle: 'Intro to Pandas' } },
  { id: 'a31', type: 'lecture_completed', courseId: 'c011', timestamp: isoDateTime(18, 12, 0),                 metadata: { lectureTitle: 'Vue 3 Setup' } },
  { id: 'a32', type: 'lecture_completed', courseId: 'c042', timestamp: isoDateTime(20, 14, 0),                 metadata: { lectureTitle: 'Generics Crash Course' } },
];

// ─── Compose ─────────────────────────────────────────────────────────────
const totalLearningSeconds = dailyMinutesLogged.reduce((s, d) => s + d.minutes * 60, 0);

export const mockUserState: UserState = {
  user: {
    id: 'u-current',
    name: 'Sarah Mitchell',
    avatar: 'https://i.pravatar.cc/96?u=sarah-mitchell',
    email: 'sarah@example.com',
    joinedAt: isoDateTime(180, 9),
    totalLearningSeconds,
    streakDays: 7,
    longestStreakDays: 21,
  },
  enrollments,
  wishlist: ['c004', 'c016', 'c026', 'c035', 'c045'],
  cart: ['c029'],
  certificates,
  learningGoals: {
    weeklyMinutes: 180,
    weeklyMinutesLogged: buildWeekly(),
    dailyMinutesLogged,
  },
  recentActivity,
};
