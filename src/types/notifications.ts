export type NotificationKind =
  | 'instructor_replied'
  | 'cohort_session_starting'
  | 'streak_at_risk'
  | 'streak_milestone'
  | 'goal_progress'
  | 'new_review'
  | 'price_drop'
  | 'new_course_in_category'
  | 'badge_earned';

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  iconKind: string;       // maps to lucide icon name
  criteria: string;
  earnedAt?: string;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  reminderMinutes: number[];
  courseId?: string;
}

export interface NotificationsState {
  notifications: Notification[];
  badges: Badge[];
  events: ScheduledEvent[];
  webPushPermission: 'default' | 'granted' | 'denied';
}

export type NotificationsAction =
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'MARK_READ'; id: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'DELETE_NOTIFICATION'; id: string }
  | { type: 'EARN_BADGE'; badgeId: string }
  | { type: 'SET_WEB_PUSH_PERMISSION'; permission: 'default' | 'granted' | 'denied' }
  | { type: 'HYDRATE'; state: Partial<NotificationsState> };
