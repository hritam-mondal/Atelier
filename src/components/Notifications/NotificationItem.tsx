import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Flame, Trophy, Target, Star, TrendingDown, Sparkles, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Notification, NotificationKind } from '../../types/notifications';
import { useNotifications } from '../../context/NotificationsContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

const ICON_MAP: Record<NotificationKind, LucideIcon> = {
  instructor_replied: MessageSquare,
  cohort_session_starting: Calendar,
  streak_at_risk: Flame,
  streak_milestone: Trophy,
  goal_progress: Target,
  new_review: Star,
  price_drop: TrendingDown,
  new_course_in_category: Sparkles,
  badge_earned: Award,
};

const COLOR_MAP: Record<NotificationKind, string> = {
  instructor_replied: '#ece6d8',
  cohort_session_starting: '#a8c08a',
  streak_at_risk: '#c5897a',
  streak_milestone: '#d8c594',
  goal_progress: '#a8c08a',
  new_review: '#d8c594',
  price_drop: '#a8c08a',
  new_course_in_category: '#ece6d8',
  badge_earned: '#d8c594',
};

interface Props {
  notification: Notification;
  onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: Props) {
  const navigate = useNavigate();
  const { dispatch } = useNotifications();
  const Icon = ICON_MAP[notification.kind];
  const color = COLOR_MAP[notification.kind];

  const handleClick = () => {
    dispatch({ type: 'MARK_READ', id: notification.id });
    navigate(notification.link);
    onClose?.();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b last:border-b-0 relative"
      style={{ borderColor: 'rgba(236,230,216,0.08)' }}
    >
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}1a` }}
        aria-hidden
      >
        <Icon size={14} style={{ color }} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug" style={{ color: '#ece6d8' }}>
          {notification.title}
        </p>
        <p className="text-xs leading-snug mt-0.5 line-clamp-2" style={{ color: '#b8b3a7' }}>
          {notification.body}
        </p>
        <p className="text-[11px] mt-1" style={{ color: '#8a857a' }}>
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ backgroundColor: '#ece6d8' }}
          aria-label="Unread"
        />
      )}
    </button>
  );
}
