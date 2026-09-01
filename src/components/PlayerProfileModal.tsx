import React from 'react';
import { useEFES } from '../context/EFESContext';
import { Trophy, Award, Shield, Star, Flame, X, Share2, Sparkles, Check } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const PlayerProfileModal: React.FC = () => {
  const { selectedPlayerId, setSelectedPlayerId, players } = useEFES();
  const [copied, setCopied] = React.useState(false);

  if (!selectedPlayerId) return null;

  const player = players.find((p) => p.id === selectedPlayerId);
  if (!player) return null;

  const handleClose = () => {
    sounds.playClick();
    setSelectedPlayerId(null);
  };

  const handleShare = () => {
    sounds.playGoldenChime();
    const text = `🏆 EFES Hall of Fame: ${player.name} (${player.primaryClub}) - ${player.totalTrophies} Major Trophies! Status: ${player.legendStatus}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#14141e] via-[#0c0c12] to-[#08080d] p-6 md:p-8 shadow-[0_0_60px_rgba(245,158,11,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-700 hover:border-amber-400 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Header / Player Hero Showcase */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-zinc-800/80 pb-6">
          {/* Avatar with glowing aura */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 blur-xl opacity-50" />
            <img
              src={player.photoUrl}
              alt={player.name}
              className="relative z-10 h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-amber-400 shadow-2xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute -bottom-2 -right-1 z-20 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 font-extrabold text-black text-xs shadow-lg border border-yellow-100">
              <Trophy className="w-3.5 h-3.5 fill-black" />
              <span>{player.totalTrophies} Trophies</span>
            </div>
          </div>

          {/* Identity Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-xs font-bold text-amber-300 flex items-center gap-1">
                {player.legendTier === 'IMMORTAL' ? (
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                )}
                {player.legendStatus}
              </span>
              <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-300">
                OVR {player.overallRating || 95} • {player.preferredPosition || 'FWD'}
              </span>
              {player.updatedAt && (
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                  Manager Updated: {new Date(player.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              {player.name}
            </h2>
            <p className="text-sm font-semibold text-amber-400/90 mt-0.5">
              Primary Club: <strong className="text-white">{player.primaryClub}</strong>
              {player.secondaryClubs && player.secondaryClubs.length > 0 && (
                <span className="text-zinc-400 font-normal">
                  {' '}(Also represented: {player.secondaryClubs.join(', ')})
                </span>
              )}
            </p>

            {player.bio && (
              <p className="mt-3 text-xs md:text-sm text-zinc-300 leading-relaxed max-w-xl">
                {player.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Trophy Record Copied!' : 'Share Record'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Trophy Room & Career Accolades */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trophy History Cabinet */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-amber-300">
                  Trophy History
                </h4>
              </div>
              <span className="font-teko text-xl font-bold text-amber-400">
                {player.totalTrophies} Total
              </span>
            </div>

            <div className="space-y-2.5">
              {player.trophies.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                      🏆
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-zinc-100">{t.competitionName}</h5>
                      <span className="text-xs text-zinc-400">Club: {t.club}</span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-black text-amber-300">
                    x{t.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Awards */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-amber-300">
                  Hall of Fame Achievements
                </h4>
              </div>
              <ul className="space-y-2 text-xs md:text-sm text-zinc-300">
                {player.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-0.5">✦</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Awards Won */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-amber-300">
                  Awards Won
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {player.awardsWon.map((award, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200"
                  >
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>{award}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Friendly Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Profile Copied!' : 'Share Profile'}</span>
          </button>

          <button
            onClick={handleClose}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-800 active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
