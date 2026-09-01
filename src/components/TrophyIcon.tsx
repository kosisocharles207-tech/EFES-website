import React from 'react';
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  Star,
  Zap,
  Footprints,
  Flame,
  Shield,
  Globe,
  Swords,
  Gem,
  ShieldCheck,
} from 'lucide-react';

interface TrophyIconProps {
  type?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  animated?: boolean;
  count?: number;
}

export const TrophyIcon: React.FC<TrophyIconProps> = ({
  type = 'gold',
  size = 'md',
  className = '',
  animated = true,
  count,
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    hero: 'w-24 h-24 md:w-32 md:h-32',
  };

  const containerSizes = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-3.5',
    xl: 'p-4',
    hero: 'p-6',
  };

  const renderIcon = () => {
    const cls = `${sizeMap[size]} stroke-[2]`;
    switch (type) {
      case 'Crown':
        return <Crown className={cls} />;
      case 'Award':
        return <Award className={cls} />;
      case 'Zap':
        return <Zap className={cls} />;
      case 'Star':
        return <Star className={`${cls} fill-amber-400/30`} />;
      case 'Footprints':
      case 'Boot':
        return <Footprints className={`${cls} fill-amber-400/30`} />;
      case 'Flame':
        return <Flame className={`${cls} fill-amber-400/30`} />;
      case 'Shield':
        return <Shield className={cls} />;
      case 'ShieldCheck':
        return <ShieldCheck className={cls} />;
      case 'Globe':
        return <Globe className={cls} />;
      case 'Swords':
        return <Swords className={cls} />;
      case 'Gem':
        return <Gem className={cls} />;
      default:
        return <Trophy className={`${cls} fill-amber-400/20`} />;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-amber-500/20 via-yellow-600/10 to-zinc-950 border border-amber-500/30 ${containerSizes[size]} ${
        animated ? 'shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300' : ''
      } ${className}`}
    >
      {/* Background glow burst */}
      <div className="absolute inset-0 rounded-2xl bg-amber-400/10 blur-md pointer-events-none" />

      {/* Main icon */}
      <div className="relative z-10 text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
        {renderIcon()}
      </div>

      {/* Sparkles floating */}
      {animated && size !== 'sm' && (
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-200 animate-pulse drop-shadow-[0_0_6px_rgba(253,224,71,0.9)]" />
      )}

      {/* Multiplier badge if count > 1 */}
      {count && count > 1 && (
        <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs px-2 py-0.5 rounded-full shadow-lg border border-amber-200">
          x{count}
        </span>
      )}
    </div>
  );
};
