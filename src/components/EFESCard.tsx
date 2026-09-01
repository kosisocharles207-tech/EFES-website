import React from 'react';
import { PlayerProfile } from '../types';
import { Trophy, Star, Shield, Flame, ExternalLink, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface EFESCardProps {
  player: PlayerProfile;
  rank?: number;
  featured?: boolean;
  onViewProfile?: (playerId: string) => void;
}

export const EFESCard: React.FC<EFESCardProps> = ({
  player,
  rank,
  featured = false,
  onViewProfile,
}) => {
  const getTierDetails = (tier: PlayerProfile['legendTier']) => {
    switch (tier) {
      case 'IMMORTAL':
        return {
          label: 'EFES IMMORTAL',
          badgeBg: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600',
          textColor: 'text-amber-300',
          glow: 'shadow-[0_0_35px_rgba(245,158,11,0.4)]',
          borderColor: 'border-yellow-400/60',
          foilAccent: 'from-amber-500/30 via-yellow-400/20 to-transparent',
          icon: <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />,
        };
      case 'ELITE':
        return {
          label: 'ELITE LEGEND',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
          textColor: 'text-amber-400',
          glow: 'shadow-[0_0_25px_rgba(217,119,6,0.3)]',
          borderColor: 'border-amber-500/50',
          foilAccent: 'from-orange-500/25 via-amber-400/15 to-transparent',
          icon: <Star className="w-3.5 h-3.5 text-amber-300" />,
        };
      case 'VETERAN':
        return {
          label: 'MASTER LEGEND',
          badgeBg: 'bg-gradient-to-r from-amber-600 to-zinc-700',
          textColor: 'text-amber-300',
          glow: 'shadow-[0_0_20px_rgba(180,83,9,0.25)]',
          borderColor: 'border-amber-600/40',
          foilAccent: 'from-amber-600/20 via-zinc-600/10 to-transparent',
          icon: <Shield className="w-3.5 h-3.5 text-amber-400" />,
        };
      default:
        return {
          label: 'HOF INDUCTEE',
          badgeBg: 'bg-zinc-800 border border-amber-500/40',
          textColor: 'text-zinc-200',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
          borderColor: 'border-zinc-700/80',
          foilAccent: 'from-zinc-700/20 to-transparent',
          icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
        };
    }
  };

  const tier = getTierDetails(player.legendTier);

  const handleClick = () => {
    sounds.playClick();
    if (onViewProfile) {
      onViewProfile(player.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative cursor-pointer select-none rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-2.5 ${tier.glow} ${
        featured ? 'md:scale-[1.02]' : ''
      }`}
    >
      {/* Metallic Animated Border Container */}
      <div
        className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#1b1812] via-[#0e0e16] to-[#08080d] border ${tier.borderColor}`}
      >
        {/* Background Cyber Pitch Grid & Foil Shine */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${tier.foilAccent} opacity-40 pointer-events-none transition-opacity duration-300 group-hover:opacity-75`}
        />

        {/* Top Header: Rank & Rating */}
        <div className="relative z-10 flex items-center justify-between p-3.5 pb-1">
          <div className="flex items-center gap-2">
            {rank !== undefined && (
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg font-teko text-lg font-bold ${
                  rank === 1
                    ? 'bg-gradient-to-b from-yellow-300 to-amber-500 text-black shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                    : rank === 2
                    ? 'bg-gradient-to-b from-zinc-200 to-zinc-400 text-black shadow-[0_0_10px_rgba(228,228,231,0.6)]'
                    : rank === 3
                    ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-yellow-100 shadow-[0_0_10px_rgba(180,83,9,0.5)]'
                    : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700'
                }`}
              >
                #{rank}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-teko text-2xl font-black leading-none text-yellow-400 tracking-wider">
                {player.overallRating || 95}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {player.preferredPosition || 'FWD'}
              </span>
            </div>
          </div>

          {/* eFootball Special Badge & Live Update Indicator */}
          <div className="flex items-center gap-1.5">
            {player.updatedAt && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 border border-emerald-500/40 text-[10px] font-bold text-emerald-300" title="Updated by Profile Manager">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Updated</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-950/80 px-2.5 py-1 border border-amber-500/30 text-[11px] font-bold text-amber-300 shadow-inner">
              {tier.icon}
              <span className="tracking-wide">{tier.label}</span>
            </div>
          </div>
        </div>

        {/* Player Image Showcase */}
        <div className="relative mx-auto mt-1 flex h-48 w-full items-end justify-center overflow-hidden px-4">
          {/* Circular Golden Aura Behind Player */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36 rounded-full bg-gradient-to-b from-amber-500/30 to-transparent blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <img
            src={player.photoUrl}
            alt={player.name}
            className="relative z-10 h-44 w-44 rounded-full object-cover border-2 border-amber-400/40 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:border-amber-300"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80';
            }}
          />

          {/* Total Trophies Floating Seal */}
          <div className="absolute bottom-1 right-5 z-20 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-3 py-1 text-black font-extrabold text-xs shadow-lg border border-yellow-200">
            <Trophy className="w-3.5 h-3.5 fill-black stroke-black" />
            <span>{player.totalTrophies} {player.totalTrophies === 1 ? 'Trophy' : 'Trophies'}</span>
          </div>
        </div>

        {/* Player Identity Footer */}
        <div className="relative z-10 p-4 pt-2">
          <div className="text-center">
            <h3 className="font-display text-xl font-black uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
              {player.name}
            </h3>
            <p className="text-xs font-semibold text-amber-400/90 tracking-wide mt-0.5">
              {player.primaryClub}
              {player.secondaryClubs && player.secondaryClubs.length > 0 && (
                <span className="text-zinc-400 font-normal"> • {player.secondaryClubs.join(', ')}</span>
              )}
            </p>
          </div>

          {/* Quick Trophy Icons Preview */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 border-t border-zinc-800/80 pt-2.5">
            {player.trophies.slice(0, 3).map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-900/90 px-2 py-0.5 text-[11px] font-medium text-zinc-300 border border-zinc-800"
                title={`${t.competitionName} (${t.club}) x${t.count}`}
              >
                <Trophy className="w-2.5 h-2.5 text-amber-400" />
                <span className="truncate max-w-[80px]">{t.competitionName}</span>
                {t.count > 1 && <strong className="text-amber-300">x{t.count}</strong>}
              </span>
            ))}
            {player.trophies.length > 3 && (
              <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                +{player.trophies.length - 3}
              </span>
            )}
          </div>

          {/* Action Trigger */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-400 group-hover:text-amber-300 transition-colors">
            <span>View Full Stats & Awards</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
