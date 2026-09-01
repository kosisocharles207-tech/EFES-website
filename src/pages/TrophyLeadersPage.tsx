import React from 'react';
import { useEFES } from '../context/EFESContext';
import { Trophy, Flame, Crown, Medal, ArrowRight, Star, Sparkles, ExternalLink } from 'lucide-react';
import { PlayerSearchBar } from '../components/PlayerSearchBar';
import { sounds } from '../utils/soundEffects';

export const TrophyLeadersPage: React.FC = () => {
  const { players, setSelectedPlayerId } = useEFES();

  // Sort players descending by total trophies
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.totalTrophies !== a.totalTrophies) {
      return b.totalTrophies - a.totalTrophies;
    }
    return a.name.localeCompare(b.name);
  });

  const firstPlace = sortedPlayers[0];
  const secondPlace = sortedPlayers[1];
  const thirdPlace = sortedPlayers[2];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      case 4:
        return '4️⃣';
      case 5:
        return '5️⃣';
      case 6:
        return '6️⃣';
      case 7:
        return '7️⃣';
      case 8:
        return '8️⃣';
      case 9:
        return '9️⃣';
      case 10:
        return '🔟';
      default:
        return `#${rank}`;
    }
  };

  const handlePlayerClick = (id: string) => {
    sounds.playClick();
    setSelectedPlayerId(id);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 p-6 md:p-10 shadow-[0_0_35px_rgba(245,158,11,0.2)]">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-3.5 py-1 text-xs font-bold text-amber-300 mb-3">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Official Silverware Leaderboard</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            TROPHY <span className="gold-gradient-text">LEADERS</span>
          </h1>
          <p className="mt-2 text-xs md:text-sm text-zinc-300 leading-relaxed">
            The definitive all-time rankings of EFES competitors ordered strictly by official tournament
            trophies won.
          </p>

          <div className="mt-6 max-w-xl mx-auto text-left">
            <PlayerSearchBar
              variant="compact"
              placeholder="Search rankings for any player..."
              showQuickTags={false}
            />
          </div>
        </div>
      </div>

      {/* 🏆 3D-STYLED PODIUM SECTION */}
      {firstPlace && secondPlace && thirdPlace && (
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#12121a] via-[#09090e] to-black p-6 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              The Sovereign Triumvirate
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-white">
              Podium of Immortals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
            {/* 2nd Place - AMIGTY (Silver) */}
            <div
              onClick={() => handlePlayerClick(secondPlace.id)}
              className="order-2 md:order-1 group cursor-pointer flex flex-col items-center text-center transition-transform hover:-translate-y-2"
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-full bg-zinc-400/20 blur-lg" />
                <img
                  src={secondPlace.photoUrl}
                  alt={secondPlace.name}
                  className="relative z-10 h-24 w-24 rounded-full object-cover border-2 border-zinc-300 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-black font-black text-sm shadow-md border border-zinc-100">
                  🥈
                </span>
              </div>

              <h3 className="font-display text-lg font-black uppercase text-white group-hover:text-zinc-300">
                {secondPlace.name}
              </h3>
              <p className="text-xs font-semibold text-zinc-400">{secondPlace.primaryClub}</p>

              {/* Pedestal Bar */}
              <div className="mt-4 w-full rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 p-4 text-center shadow-lg">
                <span className="font-teko text-3xl font-black text-zinc-200 leading-none">
                  {secondPlace.totalTrophies} Trophies
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                  2nd All-Time
                </span>
              </div>
            </div>

            {/* 1st Place - MICHAEL (Gold Champion) */}
            <div
              onClick={() => handlePlayerClick(firstPlace.id)}
              className="order-1 md:order-2 group cursor-pointer flex flex-col items-center text-center transition-transform hover:-translate-y-3"
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 blur-xl opacity-60 animate-pulse" />
                <img
                  src={firstPlace.photoUrl}
                  alt={firstPlace.name}
                  className="relative z-10 h-32 w-32 rounded-full object-cover border-4 border-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.6)]"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-lg shadow-xl border border-yellow-100 animate-bounce">
                  🥇
                </span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 mb-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>UNDISPUTED GOAT</span>
              </div>

              <h3 className="font-display text-2xl font-black uppercase text-white group-hover:text-amber-300">
                {firstPlace.name}
              </h3>
              <p className="text-xs font-semibold text-amber-400">{firstPlace.primaryClub}</p>

              {/* Pedestal Bar */}
              <div className="mt-4 w-full rounded-2xl border border-amber-500/60 bg-gradient-to-b from-amber-600/30 via-yellow-600/10 to-zinc-950 p-6 text-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <span className="font-teko text-4xl md:text-5xl font-black text-yellow-300 leading-none">
                  {firstPlace.totalTrophies} Trophies
                </span>
                <span className="block text-xs font-black uppercase tracking-widest text-amber-400 mt-1">
                  1st Place • Apex Titan
                </span>
              </div>
            </div>

            {/* 3rd Place - JUVEN (Bronze) */}
            <div
              onClick={() => handlePlayerClick(thirdPlace.id)}
              className="order-3 group cursor-pointer flex flex-col items-center text-center transition-transform hover:-translate-y-2"
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-full bg-amber-800/20 blur-lg" />
                <img
                  src={thirdPlace.photoUrl}
                  alt={thirdPlace.name}
                  className="relative z-10 h-22 w-22 rounded-full object-cover border-2 border-amber-700 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-amber-800 text-yellow-100 font-black text-sm shadow-md border border-amber-600">
                  🥉
                </span>
              </div>

              <h3 className="font-display text-lg font-black uppercase text-white group-hover:text-amber-400">
                {thirdPlace.name}
              </h3>
              <p className="text-xs font-semibold text-zinc-400">{thirdPlace.primaryClub}</p>

              {/* Pedestal Bar */}
              <div className="mt-4 w-full rounded-2xl border border-amber-800/50 bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-950 p-3.5 text-center shadow-md">
                <span className="font-teko text-3xl font-black text-amber-500 leading-none">
                  {thirdPlace.totalTrophies} Trophies
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                  3rd All-Time
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 📊 COMPLETE RANKINGS TABLE */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
          <div>
            <h3 className="font-display text-xl font-black uppercase text-white">
              Official Leaderboard Table
            </h3>
            <p className="text-xs text-zinc-400">All 10 inducted EFES champions with trophy breakdown</p>
          </div>
        </div>

        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const percentage = Math.min(100, Math.round((player.totalTrophies / 5) * 100));

            return (
              <div
                key={player.id}
                onClick={() => handlePlayerClick(player.id)}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all cursor-pointer ${
                  rank === 1
                    ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : rank === 2
                    ? 'border-zinc-600/50 bg-zinc-900/60'
                    : rank === 3
                    ? 'border-amber-800/40 bg-zinc-900/50'
                    : 'border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900/80 hover:border-zinc-700'
                }`}
              >
                {/* Left info */}
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xl md:text-2xl shrink-0 font-bold">
                    {getRankBadge(rank)}
                  </span>

                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="h-12 w-12 rounded-full object-cover border border-amber-500/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-black text-base uppercase text-white group-hover:text-amber-300 transition-colors truncate">
                        {player.name}
                      </h4>
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                        {player.legendStatus.split('(')[0]}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-amber-400/90 truncate">
                      {player.primaryClub}
                      {player.secondaryClubs && player.secondaryClubs.length > 0 && (
                        <span className="text-zinc-500 font-normal"> • {player.secondaryClubs.join(', ')}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right stats & progress bar */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-80">
                  {/* Visual Bar */}
                  <div className="hidden sm:block flex-1">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-semibold">
                      <span>Trophy Dominance</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_#f59e0b]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Trophy Counter Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-3.5 py-1.5 font-teko text-xl font-black text-black shadow-md">
                      <Trophy className="w-4 h-4 fill-black" />
                      <span>{player.totalTrophies} {player.totalTrophies === 1 ? 'Trophy' : 'Trophies'}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
