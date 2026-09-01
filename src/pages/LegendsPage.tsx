import React, { useState } from 'react';
import { useEFES } from '../context/EFESContext';
import { Shield, Crown, Flame, Star, Award, Trophy, Filter, Clock, Sparkles } from 'lucide-react';
import { EFESCard } from '../components/EFESCard';
import { PlayerSearchBar } from '../components/PlayerSearchBar';
import { sounds } from '../utils/soundEffects';

export const LegendsPage: React.FC = () => {
  const { players, setSelectedPlayerId, lastServerSync, isSyncing } = useEFES();
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  const tiers = [
    { id: 'ALL', label: 'All Legends', icon: <Crown className="w-4 h-4" /> },
    { id: 'RECENT', label: '⚡ Recently Updated', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: 'IMMORTAL', label: '🔥 Immortal (5 Trophies)', icon: <Flame className="w-4 h-4 text-amber-400" /> },
    { id: 'ELITE', label: '⭐ Elite Legend (3 Trophies)', icon: <Star className="w-4 h-4 text-amber-300" /> },
    { id: 'VETERAN', label: '🏅 Master Legend (2 Trophies)', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { id: 'HOF_INDUCTEE', label: '🏆 Hall of Fame Inductees', icon: <Trophy className="w-4 h-4 text-zinc-400" /> },
  ];

  const filteredPlayers = players.filter((p) => {
    if (selectedTier === 'ALL') return true;
    if (selectedTier === 'RECENT') {
      return Boolean(p.updatedAt);
    }
    return p.legendTier === selectedTier;
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 p-6 md:p-10 shadow-[0_0_35px_rgba(245,158,11,0.2)]">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-3.5 py-1 text-xs font-bold text-amber-300 mb-3">
            <Crown className="w-4 h-4" />
            <span>eFootball Special Iconic Roster</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            LEGEND <span className="gold-gradient-text">STATUS</span>
          </h1>
          <p className="mt-2 text-xs md:text-sm text-zinc-300 leading-relaxed">
            The tiered hierarchy of EFES greatness. From inaugural cup champions to undisputed multi-trophy
            immortals.
          </p>

          <div className="mt-6 max-w-xl mx-auto text-left">
            <PlayerSearchBar
              variant="compact"
              placeholder="Search legend by name or club..."
              showQuickTags={false}
            />
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => {
              sounds.playClick();
              setSelectedTier(tier.id);
            }}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all ${
              selectedTier === tier.id
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-amber-500/40 hover:bg-zinc-900'
            }`}
          >
            {tier.icon}
            <span>{tier.label}</span>
          </button>
        ))}
      </div>

      {/* Tier Explanation Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-zinc-950 p-4">
          <div className="flex items-center gap-2 font-display text-sm font-black text-amber-300 mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>IMMORTAL TIER</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Requires <strong>5+ Major Trophies</strong>. Undisputed apex GOAT status.
          </p>
          <div className="mt-2 text-xs font-bold text-amber-400">🔥 Michael (5)</div>
        </div>

        <div className="rounded-2xl border border-amber-600/30 bg-gradient-to-b from-amber-950/20 to-zinc-950 p-4">
          <div className="flex items-center gap-2 font-display text-sm font-black text-amber-400 mb-1">
            <Star className="w-4 h-4 text-amber-400" />
            <span>ELITE LEGEND</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Requires <strong>3+ Major Trophies</strong> across club or international arenas.
          </p>
          <div className="mt-2 text-xs font-bold text-amber-400">⭐ Amigty (3)</div>
        </div>

        <div className="rounded-2xl border border-amber-700/30 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4">
          <div className="flex items-center gap-2 font-display text-sm font-black text-amber-500 mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>MASTER LEGEND</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Requires <strong>2 Major Trophies</strong> with proven longevity and flair.
          </p>
          <div className="mt-2 text-xs font-bold text-amber-400">🏅 Juven (2)</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center gap-2 font-display text-sm font-black text-zinc-300 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>HOF INDUCTEES</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Official silverware titleholders inducted forever into EFES records.
          </p>
          <div className="mt-2 text-xs font-bold text-zinc-300">🏆 7 Inducted Champions</div>
        </div>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <EFESCard
            key={player.id}
            player={player}
            onViewProfile={setSelectedPlayerId}
          />
        ))}
      </div>
    </div>
  );
};
