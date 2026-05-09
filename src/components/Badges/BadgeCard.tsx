import { Sparkles, Flame, Shield, TrendingUp, HelpCircle, ThumbsUp, Flag, Compass, Moon, Globe, Target, Zap, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Badge } from '../../types/notifications';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

const ICON_MAP: Record<string, LucideIcon> = {
  sprout: Sparkles, flame: Flame, shield: Shield, mountain: TrendingUp,
  'help-circle': HelpCircle, hand: ThumbsUp, flag: Flag, route: Compass,
  moon: Moon, languages: Globe, target: Target, zap: Zap,
};

const RARITY_COLORS: Record<Badge['rarity'], { ring: string; label: string }> = {
  common:    { ring: '#b8b3a7', label: 'Common' },
  rare:      { ring: '#a8c08a', label: 'Rare' },
  epic:      { ring: '#d8c594', label: 'Epic' },
  legendary: { ring: '#c5897a', label: 'Legendary' },
};

interface Props {
  badge: Badge;
  onClick?: () => void;
}

export function BadgeCard({ badge, onClick }: Props) {
  const Icon = ICON_MAP[badge.iconKind] ?? Flag;
  const earned = !!badge.earnedAt;
  const rarity = RARITY_COLORS[badge.rarity];

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
      style={{
        border: `1px solid ${earned ? rarity.ring : 'rgba(236,230,216,0.10)'}`,
        backgroundColor: earned ? 'rgba(236,230,216,0.04)' : 'rgba(236,230,216,0.02)',
        opacity: earned ? 1 : 0.55,
      }}
      aria-disabled={!earned}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${rarity.ring}1a`,
            border: `2px solid ${earned ? rarity.ring : 'rgba(236,230,216,0.15)'}`,
          }}
          aria-hidden
        >
          {earned ? (
            <Icon size={20} style={{ color: rarity.ring }} />
          ) : (
            <Lock size={16} style={{ color: '#8a857a' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: '#ece6d8' }}>{badge.name}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: rarity.ring }}>
            {rarity.label}
          </p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#b8b3a7' }}>
        {badge.description}
      </p>
      <p className="text-[11px] mt-2" style={{ color: '#8a857a' }}>
        {earned ? `Earned ${formatRelativeTime(badge.earnedAt!)}` : badge.criteria}
      </p>
    </button>
  );
}
