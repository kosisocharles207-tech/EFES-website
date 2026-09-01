import React, { useState } from 'react';
import { useEFES } from '../context/EFESContext';
import {
  Trophy,
  Sparkles,
  Clock,
  CheckCircle2,
  Lock,
  Vote,
  BarChart3,
  Award,
  Crown,
  Plus,
  ShieldAlert,
  Flame,
  Radio,
  BellRing,
  XCircle,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export const BallonDorPage: React.FC = () => {
  const {
    ballonDorState,
    contenders,
    castBallonDorVote,
    hasUserVoted,
    currentAdmin,
    updateBallonDorState,
    setCurrentPage,
    setIsAdminLoginOpen,
  } = useEFES();

  const [activeTab, setActiveTab] = useState<'season2' | 'history'>('season2');
  const [voteSuccessContender, setVoteSuccessContender] = useState<string | null>(null);

  const totalVotes = contenders.reduce((sum, c) => sum + c.votes, 0);
  const sortedContendersByVotes = [...contenders].sort((a, b) => b.votes - a.votes);

  const handleVote = (contenderId: string, name: string) => {
    if (!ballonDorState.isVotingOpen || contenders.length === 0) return;
    const ok = castBallonDorVote(contenderId);
    if (ok) {
      setVoteSuccessContender(name);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#ca8a04'],
      });
      setTimeout(() => setVoteSuccessContender(null), 4000);
    }
  };

  const triggerAdminToggleVoting = () => {
    sounds.playClick();
    updateBallonDorState({ isVotingOpen: !ballonDorState.isVotingOpen });
  };

  return (
    <div className="space-y-12">
      {/* 🌟 eFootball 2027 Golden Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#09132e] via-[#040817] to-[#02040a] p-6 md:p-12 shadow-[0_0_60px_rgba(245,158,11,0.25)] text-center stadium-floodlights">
        {/* Glow Halos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-b from-amber-400/25 via-yellow-600/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Animated Trophy Emblem with Glow */}
          <div className="mx-auto mb-5 flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-[0_0_40px_rgba(245,158,11,0.7)] animate-gold-pulse">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-gradient-to-b from-zinc-900 to-black">
              <Trophy className="h-12 w-12 md:h-14 md:w-14 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.9)]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-300 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span>eFootball 2027 • Official EFES Gala</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight drop-shadow-xl">
            EFES <span className="gold-gradient-text">BALLON D&apos;OR</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base font-semibold text-amber-300/90 font-teko uppercase tracking-widest text-2xl">
            Season 2 • Supreme Individual Virtuoso
          </p>

          {/* Admin Control Bar */}
          {currentAdmin ? (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-zinc-900/95 border border-amber-500/50 p-3.5 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Admin Controls ({currentAdmin.name}):
              </span>
              <button
                onClick={triggerAdminToggleVoting}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  ballonDorState.isVotingOpen
                    ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                }`}
              >
                {ballonDorState.isVotingOpen ? '🔒 Close Voting' : '🔓 Open Voting'}
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentPage('admin');
                }}
                className="rounded-xl bg-gradient-to-r from-amber-500/30 to-yellow-500/20 border border-amber-500/50 px-3.5 py-1.5 text-xs font-black text-amber-300 hover:bg-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manage Season 2 Contenders in Dashboard</span>
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsAdminLoginOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>EFES Admin Management Portal</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('season2');
          }}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'season2'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)]'
              : 'border border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-900 hover:border-amber-500/30'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>EFES Ballon d&apos;Or Season 2</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('history');
          }}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)]'
              : 'border border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-900 hover:border-amber-500/30'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Past Laureates (Season 1)</span>
        </button>
      </div>

      {/* Vote Success Alert */}
      {voteSuccessContender && (
        <div className="mx-auto max-w-md rounded-2xl bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border border-emerald-500/50 p-4 text-center text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in fade-in zoom-in-95">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-1" />
          <p className="font-bold text-sm">Vote Registered Successfully!</p>
          <p className="text-xs text-emerald-300/80">
            You cast your official ballot for <strong>{voteSuccessContender}</strong>.
          </p>
        </div>
      )}

      {/* TAB 1: SEASON 2 DISPLAY */}
      {activeTab === 'season2' && (
        <section className="space-y-8">
          {/* Exact Prompt Required Display when Season 2 has not started / has no contenders */}
          {contenders.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-[#0e1630] via-[#080d20] to-[#030612] p-8 md:p-14 text-center shadow-[0_0_60px_rgba(245,158,11,0.25)] stadium-floodlights">
              {/* Radial backdrop */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-gold-pulse">
                  <Clock className="h-10 w-10 text-yellow-400" />
                </div>

                <div>
                  <div className="inline-block rounded-full bg-amber-500/20 border border-amber-500/50 px-4 py-1 text-xs font-black uppercase tracking-widest text-amber-300 mb-3 shadow">
                    Status: NOT STARTED
                  </div>
                  <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-wide drop-shadow">
                    🏆 EFES BALLON D&apos;OR SEASON 2
                  </h2>
                </div>

                {/* Exact Required Status Quotes */}
                <div className="rounded-3xl border-2 border-amber-500/40 bg-black/80 p-6 md:p-8 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <p className="font-display text-2xl sm:text-3xl font-black text-amber-300 tracking-wide uppercase">
                    &ldquo;Voting has not started yet.&rdquo;
                  </p>

                  <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                  <p className="text-lg sm:text-xl font-bold text-zinc-100">
                    &ldquo;EFES Ballon d&apos;Or Season 2 contenders will be announced soon.&rdquo;
                  </p>

                  <p className="text-sm sm:text-base font-medium text-amber-200/80 italic">
                    &ldquo;Stay tuned for official announcements from EFES Admin.&rdquo;
                  </p>
                </div>

                {/* Explicitly Visualized Restriction Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/30 p-3.5 text-center text-red-200">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      ❌ No Contenders Displayed
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/30 p-3.5 text-center text-red-200">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      ❌ No Voting Available
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/30 p-3.5 text-center text-red-200">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      ❌ No Nominations Visible
                    </span>
                  </div>
                </div>

                {/* Admin Quick Action */}
                <div className="pt-4 border-t border-amber-500/20">
                  {currentAdmin ? (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setCurrentPage('admin');
                      }}
                      className="gold-button inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Season 2 Contenders & Open Voting in Admin Dashboard</span>
                    </button>
                  ) : (
                    <p className="text-xs text-zinc-500 font-medium">
                      Authorized EFES Admins can add contenders and open public voting inside the Admin Dashboard.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Contenders Display when Admin adds them */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="font-display text-2xl font-black uppercase text-white">
                    Season 2 Official Nominees
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Audited eFootball match performances, trophies won, ratings, and statistics
                  </p>
                </div>

                {ballonDorState.isVotingOpen ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-xs font-extrabold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Vote className="w-4 h-4" />
                    <span>Public Voting is LIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/40 px-4 py-2 text-xs font-extrabold text-amber-300">
                    <Lock className="w-4 h-4" />
                    <span>Voting Locked</span>
                  </div>
                )}
              </div>

              {/* Winner Announcement Banner if winner is crowned */}
              {ballonDorState.winnerAnnounced && ballonDorState.winnerContenderId && (
                <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400 bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 p-6 md:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.5)] animate-gold-pulse">
                  <Crown className="mx-auto h-12 w-12 text-yellow-300 mb-2 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
                  <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                    Official EFES Ballon d&apos;Or Season 2 Laureate
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white mt-1">
                    {contenders.find((c) => c.id === ballonDorState.winnerContenderId)?.name}
                  </h2>
                  <p className="text-sm font-bold text-amber-400">
                    {contenders.find((c) => c.id === ballonDorState.winnerContenderId)?.club}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {contenders.map((contender) => {
                  const isWinner = ballonDorState.winnerContenderId === contender.id;
                  return (
                    <div
                      key={contender.id}
                      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 shadow-xl transition-all hover:-translate-y-1.5 efootball-card-foil ${
                        isWinner
                          ? 'border-amber-400 bg-gradient-to-b from-[#1a234f] via-[#101b3d] to-[#060a1f] shadow-[0_0_35px_rgba(245,158,11,0.4)]'
                          : 'border-amber-500/30 bg-gradient-to-b from-[#0f1b3d] via-[#09122a] to-[#040817] hover:border-amber-400'
                      }`}
                    >
                      {/* Contender Header */}
                      <div>
                        <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:border-amber-300">
                          <img
                            src={contender.photoUrl}
                            alt={contender.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 right-2 rounded-md bg-zinc-950/95 border border-amber-500/50 px-2 py-0.5 text-[10px] font-black text-amber-300 shadow">
                            {contender.seasonStats?.rating ? contender.seasonStats.rating.toFixed(1) : '9.0'} ★
                          </div>
                        </div>

                        <div className="text-center">
                          <h4 className="font-display text-xl font-black uppercase text-white group-hover:text-amber-300 transition-colors">
                            {contender.name}
                          </h4>
                          <p className="text-xs font-bold text-amber-400">{contender.club}</p>
                          <span className="text-[10px] text-zinc-400">{contender.position}</span>
                        </div>

                        {/* Season Stats Matrix */}
                        <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/60 border border-zinc-800 p-2.5 text-center">
                          <div>
                            <span className="block font-teko text-lg font-black text-white leading-none">
                              {contender.seasonStats?.goals ?? 0}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-zinc-500">Goals</span>
                          </div>
                          <div>
                            <span className="block font-teko text-lg font-black text-amber-400 leading-none">
                              {contender.seasonStats?.assists ?? 0}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-zinc-500">Assists</span>
                          </div>
                          <div>
                            <span className="block font-teko text-lg font-black text-emerald-400 leading-none">
                              {contender.seasonStats?.winRate ?? 75}%
                            </span>
                            <span className="text-[9px] uppercase font-bold text-zinc-500">Win Rate</span>
                          </div>
                        </div>

                        {/* Key Honors */}
                        {contender.achievements && contender.achievements.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/90 block">
                              Season Accolades:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {contender.achievements.map((ach, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200"
                                >
                                  {ach}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vote Action Area */}
                      <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-400">Total Ballots:</span>
                          <span className="font-black text-amber-300 font-teko text-lg">
                            {contender.votes} Votes
                          </span>
                        </div>

                        {ballonDorState.isVotingOpen ? (
                          <button
                            onClick={() => handleVote(contender.id, contender.name)}
                            disabled={hasUserVoted}
                            className={`w-full rounded-xl py-2.5 text-xs font-black transition-all cursor-pointer ${
                              hasUserVoted
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'gold-button shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            }`}
                          >
                            {hasUserVoted ? '✓ Vote Recorded' : '🗳️ Cast Official Vote'}
                          </button>
                        ) : (
                          <div className="rounded-xl bg-zinc-900 border border-zinc-800 py-2 text-center text-[11px] font-bold text-zinc-500">
                            Voting Currently Locked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PAST WINNERS (HISTORY) */}
      {activeTab === 'history' && (
        <section className="space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="font-display text-2xl font-black uppercase text-white">
              Roll of Honor • Ballon d&apos;Or Laureates
            </h3>
            <p className="text-xs text-zinc-400">
              The permanent historical registry of EFES supreme individual champions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ballonDorState.pastWinners.map((winner) => (
              <div
                key={winner.season}
                className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-[#0e1738] via-[#091026] to-[#040817] p-6 sm:p-8 shadow-2xl efootball-card-foil stadium-floodlights"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                    <img
                      src={winner.photoUrl}
                      alt={winner.winnerName}
                      className="h-full w-full object-cover rounded-[14px]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 right-1 rounded bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5">
                      S{winner.season}
                    </div>
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-300">
                      <Trophy className="w-3 h-3 text-yellow-300" />
                      <span>Season {winner.season} Golden Laureate</span>
                    </div>

                    <h4 className="font-display text-3xl font-black uppercase text-white">
                      {winner.winnerName}
                    </h4>
                    <p className="text-xs font-bold text-amber-400">{winner.club}</p>
                    <p className="text-[11px] text-zinc-400">Year Awarded: {winner.year}</p>

                    <div className="pt-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                        Trophies Won in Golden Year:
                      </span>
                      <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                        {winner.trophiesWon.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-zinc-900 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
