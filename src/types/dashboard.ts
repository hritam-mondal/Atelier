export interface DashboardUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  joinedAt: string;
  totalLearningSeconds: number;
  streakDays: number;
  longestStreakDays: number;
}

export interface Enrollment {
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  progressPercent: number;
  completedLectureIds: string[];
  currentLectureId: string;
  currentLectureTime?: number; // seconds
  isArchived: boolean;
  isFavorite: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  issuedAt: string;
  certificateNumber: string;
}

export type ActivityType =
  | 'lecture_completed'
  | 'course_completed'
  | 'quiz_passed'
  | 'note_added'
  | 'certificate_earned';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  courseId: string;
  lectureId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface WeeklyMinuteEntry {
  weekStart: string; // ISO date
  minutes: number;
}

export interface DailyMinuteEntry {
  date: string; // YYYY-MM-DD
  minutes: number;
}

export interface LearningGoals {
  weeklyMinutes: number;
  weeklyMinutesLogged: WeeklyMinuteEntry[];
  dailyMinutesLogged: DailyMinuteEntry[]; // last 84 days for the heatmap
}

export interface UserState {
  user: DashboardUser;
  enrollments: Enrollment[];
  wishlist: string[];
  cart: string[];
  certificates: Certificate[];
  learningGoals: LearningGoals;
  recentActivity: ActivityEvent[];
}

export type DashboardTab = 'all' | 'in-progress' | 'completed' | 'wishlist' | 'archived' | 'certificates';

export type EnrollmentSort = 'recent' | 'title' | 'progress' | 'enrolled';

export type UserAction =
  | { type: 'TOGGLE_FAVORITE'; courseId: string }
  | { type: 'TOGGLE_ARCHIVE'; courseId: string }
  | { type: 'REMOVE_ENROLLMENT'; courseId: string }
  | { type: 'ENROLL_COURSE'; courseId: string }
  | { type: 'ADD_WISHLIST'; courseId: string }
  | { type: 'REMOVE_WISHLIST'; courseId: string }
  | { type: 'MOVE_TO_CART'; courseId: string }
  | { type: 'SET_WEEKLY_GOAL'; minutes: number }
  | { type: 'ADD_ACTIVITY'; event: ActivityEvent }
  | { type: 'HYDRATE'; state: Partial<UserState> };
