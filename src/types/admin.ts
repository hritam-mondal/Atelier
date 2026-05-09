export interface AdminMetrics {
  totalUsers: number;
  newUsersThisWeek: number;
  totalCourses: number;
  monthlyRecurring: number;
  totalRevenue: number;
  dau: number;
  mau: number;
  conversionRate: number;
  avgSessionMinutes: number;
  topCategories: { category: string; enrollments: number }[];
}

export type ModerationKind = 'review' | 'qa_question' | 'qa_answer' | 'cohort_thread' | 'profile';
export type ModerationStatus = 'pending' | 'approved' | 'removed' | 'shadow_banned';

export interface ModerationItem {
  id: string;
  kind: ModerationKind;
  contentId: string;
  authorId: string;
  authorName: string;
  preview: string;
  reportCount: number;
  reportReasons: string[];
  status: ModerationStatus;
  reportedAt: string;
  reviewedAt?: string;
}

export type FlagAudience = 'all' | 'instructors' | 'students' | 'admins';

export interface FeatureFlag {
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercent: number;
  audience: FlagAudience;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface SiteAnnouncement {
  id: string;
  message: string;
  link?: string;
  kind: 'info' | 'warn' | 'celebrate';
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface AdminState {
  metrics: AdminMetrics;
  moderation: ModerationItem[];
  flags: FeatureFlag[];
  audit: AuditLogEntry[];
  announcements: SiteAnnouncement[];
}

export type AdminAction =
  | { type: 'MODERATE'; id: string; status: ModerationStatus; actor: string }
  | { type: 'TOGGLE_FLAG'; key: string; actor: string }
  | { type: 'UPDATE_FLAG'; key: string; patch: Partial<FeatureFlag>; actor: string }
  | { type: 'ADD_ANNOUNCEMENT'; announcement: SiteAnnouncement }
  | { type: 'TOGGLE_ANNOUNCEMENT'; id: string }
  | { type: 'HYDRATE'; state: Partial<AdminState> };
