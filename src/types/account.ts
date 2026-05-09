export type SocialKind = 'twitter' | 'github' | 'linkedin' | 'website';

export interface SocialLink {
  kind: SocialKind;
  url: string;
}

export interface ProfileFields {
  bio: string;
  headline: string;
  socialLinks: SocialLink[];
  timezone: string;
  language: string;
}

export type NotificationEventKey =
  | 'course_update'
  | 'instructor_reply'
  | 'cohort_session'
  | 'streak_reminder'
  | 'goal_progress'
  | 'new_review'
  | 'price_drop'
  | 'new_course_in_category';

export interface NotificationChannelPrefs {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export interface NotificationPrefs {
  events: Record<NotificationEventKey, NotificationChannelPrefs>;
  digestFrequency: 'off' | 'daily' | 'weekly';
  marketing: boolean;
}

export type OAuthProvider = 'google' | 'github' | 'apple';

export interface OAuthConnection {
  provider: OAuthProvider;
  email: string;
  connectedAt: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  ipMasked: string;
  location: string;
  lastActiveAt: string;
  current: boolean;
}

export type SecurityEventKind =
  | 'login'
  | 'password_change'
  | '2fa_enabled'
  | '2fa_disabled'
  | 'session_revoked'
  | 'oauth_connected'
  | 'oauth_disconnected';

export interface SecurityEvent {
  id: string;
  kind: SecurityEventKind;
  at: string;
  ipMasked: string;
  device: string;
}

export type UserRole = 'student' | 'instructor' | 'admin';

export interface AuthState {
  signedIn: boolean;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  profile: ProfileFields;
  notificationPrefs: NotificationPrefs;
  oauthConnections: OAuthConnection[];
  sessions: ActiveSession[];
  securityLog: SecurityEvent[];
  /** Set after a successful 2FA enrollment to display the codes once. */
  pendingRecoveryCodes?: string[];
}

export type AuthAction =
  | { type: 'SIGN_IN'; email: string; role: UserRole }
  | { type: 'SIGN_OUT' }
  | { type: 'VERIFY_EMAIL' }
  | { type: 'UPDATE_PROFILE'; profile: ProfileFields }
  | { type: 'UPDATE_NOTIFICATION_PREFS'; prefs: NotificationPrefs }
  | { type: 'ENABLE_2FA'; recoveryCodes: string[] }
  | { type: 'DISABLE_2FA' }
  | { type: 'CLEAR_RECOVERY_CODES' }
  | { type: 'CONNECT_OAUTH'; connection: OAuthConnection }
  | { type: 'DISCONNECT_OAUTH'; provider: OAuthProvider }
  | { type: 'REVOKE_SESSION'; id: string }
  | { type: 'REVOKE_ALL_OTHER_SESSIONS' }
  | { type: 'RECORD_PASSWORD_CHANGE' }
  | { type: 'HYDRATE'; state: Partial<AuthState> };
