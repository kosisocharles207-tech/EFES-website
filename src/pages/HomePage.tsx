import React from 'react';
import { useEFES } from '../context/EFESContext';
import {
  Trophy,
  Flame,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Calendar,
  Newspaper,
  Star,
  Users,
  Award,
  Globe,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Gamepad2,
  Activity,
  Tv,
  Zap,
} from 'lucide-react';
import { EFESCard } from '../components/EFESCard';
import { PlayerSearchBar } from '../components/PlayerSearchBar';
import { AutoWinnerCarousel } from '../components/AutoWinnerCarousel';
import { sounds } from '../utils/soundEffects';

export const HomePage: React.FC = () => {
  const {
    setCurrentPage,
    setSelectedPlayerId,
    players,
    records,
    events,
    news,
    ballonDorState,
  } = useEFES();

  // Sorted players by trophies
  const sortedPlayers = [...players].sort((a, b) => b.totalTrophies - a.totalTrophies);
  const topLeaders = sortedPlayers.slice(0, 5);
  const featuredLegends = sortedPlayers.slice(0, 4);

  // Official EFES Tournament list
  const officialTournaments = [
    {
      name: 'Premier League',
      tier: 'Tier 1 Major',
      holders: 'Michael (S1 & S2)',
      icon: '🦁',
      color: 'from-purple-900/40 to-indigo-950/60',
      border: 'border-purple-500/40',
    },
    {
      name: 'UEFA Champions League',
      tier: 'Continental Crown',
      holders: 'Kosi (S1)',
      icon: '⭐',
      color: 'from-blue-900/40 to-cyan-950/60',
      border: 'border-blue-500/40',
    },
    {
      name: 'Ultimate Legend Cup',
      tier: 'Grand Invitational',
      holders: 'Michael (Inaugural)',
      icon: '🏆',
      color: 'from-amber-900/40 to-yellow-950/60',
      border: 'border-amber-500/40',
    },
    {
      name: 'EFES Super Cup',
      tier: 'Clash of Champions',
      holders: 'Michael (S1)',
      icon: '⚡',
      color: 'from-emerald-900/40 to-teal-950/60',
      border: 'border-emerald-500/40',
    },
  ];

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 space-y-16 md:space-y-24 efootball-gameplay-arena min-h-screen overflow-hidden">
      {/* ⚽ eFootball Tactical Pitch Overlay & Stadium Floodlight Beams */}
      <div className="efootball-pitch-lines" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-96 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* 🎮 eFootball Live Matchday Ticker Header */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="rounded-2xl border border-amber-500/30 bg-black/80 backdrop-blur-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-yellow-400" />
              eFootball 2027 Competition Engine
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-300">
            <span className="hidden md:inline text-zinc-400">
              Platform: <strong className="text-white">Mobile / Console / PC</strong>
            </span>
            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Matchday Active
            </span>
            <span className="text-zinc-400">
              Verified Trophies: <strong className="text-amber-300">{records.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 🌟 1. HERO BANNER: EFES OFFICIAL WEBSITE */}
      <section className="relative z-10 mx-auto max-w-7xl pt-4 pb-10 md:pt-8 md:pb-16 text-center">
        <div className="flex flex-col items-center">
          {/* Top Verification Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/50 px-4 py-1.5 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              Official eFootball Elite Squad (EFES) Website
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-2xl">
            THE OFFICIAL <span className="gold-gradient-text">EFES WEBSITE</span>
          </h1>

          {/* Welcome Tagline */}
          <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-zinc-300 font-medium leading-relaxed">
            The premier digital arena for competitive eFootball esports and home of the{' '}
            <strong className="text-amber-300 font-bold">eFootball Elite Squad (EFES)</strong>. Celebrating legendary champions,
            verifying tournament silverware, tracking all-time trophy rankings, and hosting the upcoming{' '}
            <strong className="text-amber-300 font-bold">Ballon d&apos;Or Season 2</strong>.
          </p>

          {/* Instant Player Search Bar */}
          <div className="mt-8 w-full max-w-2xl text-left">
            <PlayerSearchBar
              variant="hero"
              placeholder="Search EFES legends & managers (Michael, Kosi, Amigty, GT Baddest, TMF...)"
              showQuickTags={true}
            />
          </div>

          {/* Hero Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => {
                sounds.playGoldenChime();
                setCurrentPage('hall-of-fame');
              }}
              className="gold-button flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm md:text-base cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)]"
            >
              <Crown className="h-5 w-5" />
              <span>Explore Hall of Fame</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setCurrentPage('ballon-dor');
              }}
              className="flex items-center gap-2 rounded-2xl border border-amber-500/60 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 px-6 py-3.5 text-sm md:text-base font-extrabold text-amber-300 hover:bg-amber-500/30 hover:border-amber-400 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span>Ballon d&apos;Or Season 2</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setCurrentPage('trophy-leaders');
              }}
              className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-6 py-3.5 text-sm md:text-base font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
            >
              <Flame className="h-5 w-5 text-amber-400" />
              <span>Trophy Leaderboard</span>
            </button>
          </div>

          {/* Official Stats Counter Grid */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 w-full max-w-4xl">
            <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/90 backdrop-blur-md p-4 text-center shadow-inner">
              <span className="font-teko text-3xl md:text-5xl font-black text-amber-400 leading-none">
                {records.length}
              </span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                Official Trophies Awarded
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/90 backdrop-blur-md p-4 text-center shadow-inner">
              <span className="font-teko text-3xl md:text-5xl font-black text-amber-400 leading-none">
                {players.length}
              </span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                Inducted Immortals
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/90 backdrop-blur-md p-4 text-center shadow-inner">
              <span className="font-teko text-3xl md:text-5xl font-black text-amber-400 leading-none">
                12
              </span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                Official Competitions
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/50 to-zinc-950/90 backdrop-blur-md p-4 text-center shadow-inner">
              <span className="font-teko text-3xl md:text-5xl font-black text-yellow-300 leading-none">
                Season 2
              </span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mt-1">
                Ballon d&apos;Or (Coming Soon)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔄 2. AUTO-SWIPING HALL OF FAME WINNERS REEL (Continuous Auto-Swiper) */}
      <section className="relative z-10 mx-auto max-w-7xl">
        <AutoWinnerCarousel
          autoPlayInterval={3200}
          title="HALL OF FAME CHAMPIONS • AUTO REEL"
          subtitle="Continuous live showcase of all official EFES tournament conquerors and title holders"
        />
      </section>

      {/* ⚽ 3. BALLON D'OR SEASON 2 COMING SOON BANNER */}
      <section className="relative z-10 mx-auto max-w-7xl">
        <div
          onClick={() => {
            sounds.playGoldenChime();
            setCurrentPage('ballon-dor');
          }}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-gradient-to-r from-[#121c3d] via-[#091026] to-[#040714] p-6 md:p-10 shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-all hover:shadow-[0_0_70px_rgba(245,158,11,0.5)] hover:border-yellow-400 stadium-floodlights"
        >
          {/* Ambient Gold Particle Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15" />
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 h-60 w-60 rounded-full bg-yellow-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Golden Rotating Trophy Emblem */}
              <div className="relative flex h-24 w-24 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-gold-pulse">
                <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-gradient-to-b from-zinc-900 to-black">
                  <Trophy className="h-12 w-12 md:h-14 md:w-14 text-yellow-300 drop-shadow-[0_0_16px_rgba(253,224,71,0.95)]" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/50 px-3.5 py-1 text-xs font-black text-amber-300 uppercase tracking-widest mb-2 shadow">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>Coming Soon • Season 2 Edition</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-wide drop-shadow-md">
                  EFES BALLON D&apos;OR <span className="gold-gradient-text">SEASON 2</span>
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 mt-2 max-w-2xl font-medium leading-relaxed">
                  <strong>Voting has not started yet.</strong> Official Season 2 contenders will be announced soon
                  by the EFES Council as the community gears up for the most prestigious individual football crown.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400">
                  <span className="bg-black/60 border border-amber-500/30 px-3 py-1 rounded-lg">
                    🔒 Voting Closed
                  </span>
                  <span className="bg-black/60 border border-amber-500/30 px-3 py-1 rounded-lg">
                    📋 Nominations in Preparation
                  </span>
                  <span className="bg-black/60 border border-amber-500/30 px-3 py-1 rounded-lg">
                    👑 Defending Winner: Michael (S1)
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <div className="gold-button flex items-center gap-2 rounded-2xl px-6 py-4 text-sm md:text-base font-black shadow-xl group-hover:scale-105 transition-transform cursor-pointer">
                <span>View Ballon d&apos;Or Hub</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌐 4. EFES ECOSYSTEM & PORTAL HUBS */}
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest mb-1.5">
            <Globe className="w-4 h-4" />
            <span>Official Portal Hubs</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase text-white">
            Explore the EFES Universe
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Access tournament records, leaderboards, player archives, and council bulletins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Hub 1: Hall of Fame */}
          <div
            onClick={() => {
              sounds.playClick();
              setCurrentPage('hall-of-fame');
            }}
            className="group rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6 hover:border-amber-500/50 hover:bg-gradient-to-b hover:from-amber-950/20 hover:to-zinc-950 transition-all cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                <Crown className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
              Hall of Fame
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Official archive celebrating verified tournament conquerors, historic silverware, and player conquests.
            </p>
          </div>

          {/* Hub 2: Trophy Leaders */}
          <div
            onClick={() => {
              sounds.playClick();
              setCurrentPage('trophy-leaders');
            }}
            className="group rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6 hover:border-amber-500/50 hover:bg-gradient-to-b hover:from-amber-950/20 hover:to-zinc-950 transition-all cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                <Flame className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
              Trophy Leaderboard
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Real-time rankings of the top 10 most decorated tacticians in competitive EFES history.
            </p>
          </div>

          {/* Hub 3: Ballon d'Or Season 2 */}
          <div
            onClick={() => {
              sounds.playGoldenChime();
              setCurrentPage('ballon-dor');
            }}
            className="group rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-zinc-950/90 backdrop-blur-sm p-6 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-md group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-black uppercase text-amber-300">
                Coming Soon
              </span>
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
              Ballon d&apos;Or Season 2
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              The supreme individual accolade. View Season 1 laureate Michael and stay tuned for Season 2 nominees.
            </p>
          </div>

          {/* Hub 4: Legends Roster */}
          <div
            onClick={() => {
              sounds.playClick();
              setCurrentPage('legends');
            }}
            className="group rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6 hover:border-amber-500/50 hover:bg-gradient-to-b hover:from-amber-950/20 hover:to-zinc-950 transition-all cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
              Inducted Legends
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Explore exhaustive bios, club allegiances, titles won, and career milestones for all inducted players.
            </p>
          </div>

          {/* Hub 5: Events & Tournaments */}
          <div
            onClick={() => {
              sounds.playClick();
              setCurrentPage('events');
            }}
            className="group rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6 hover:border-amber-500/50 hover:bg-gradient-to-b hover:from-amber-950/20 hover:to-zinc-950 transition-all cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
              Tournaments & Galas
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Schedules for Champions League, Premier League, Super Cup, and the EFES Ballon d&apos;Or Gala.
            </p>
          </div>

          {/* Hub 6: News & Bulletins */}
          <div
            onClick={() => {
              sounds.playClick();
              setCurrentPage('events');
            }}
            className="group rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6 hover:border-amber-500/50 hover:bg-gradient-to-b hover:from-amber-950/20 hover:to-zinc-950 transition-all cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                <Newspaper className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
              Council Bulletins & News
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Official communiqués, tournament rulebooks, and press releases authored by the EFES Executive Council.
            </p>
          </div>
        </div>
      </section>

      {/* 🔥 5. TROPHY LEADERS PREVIEW */}
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <Flame className="w-4 h-4" />
              <span>All-Time Rankings</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-white mt-1">
              Trophy Leaders
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
              The supreme tacticians holding the most official EFES silverware.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentPage('trophy-leaders');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>View Full Leaderboard (Top 10)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topLeaders.slice(0, 3).map((player, idx) => (
            <EFESCard
              key={player.id}
              player={player}
              rank={idx + 1}
              featured={idx === 0}
              onViewProfile={setSelectedPlayerId}
            />
          ))}
        </div>
      </section>

      {/* 🏆 6. OFFICIAL EFES COMPETITIONS SHOWCASE */}
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/85 backdrop-blur-md p-6 md:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-1">
                <Trophy className="w-4 h-4" />
                <span>Sanctioned Silverware</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-white">
                Official EFES Competitions
              </h2>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setCurrentPage('hall-of-fame');
              }}
              className="self-start sm:self-auto text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1.5"
            >
              <span>View Tournament Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {officialTournaments.map((tourney) => (
              <div
                key={tourney.name}
                className={`rounded-2xl border ${tourney.border} bg-gradient-to-b ${tourney.color} p-5 space-y-3 relative overflow-hidden`}
              >
                <div className="text-3xl">{tourney.icon}</div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                    {tourney.tier}
                  </span>
                  <h3 className="font-display text-lg font-bold uppercase text-white mt-1.5">
                    {tourney.name}
                  </h3>
                </div>
                <div className="border-t border-white/10 pt-2.5 text-[11px] text-zinc-300">
                  <span className="text-zinc-400">Current Champion:</span>{' '}
                  <strong className="text-amber-300">{tourney.holders}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👑 7. FEATURED LEGENDS SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <Crown className="w-4 h-4" />
              <span>Iconic Players</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-white mt-1">
              Featured Legends
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
              Every manager immortalized forever in the EFES Hall of Fame.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentPage('legends');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>Explore All Legends</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredLegends.map((player, idx) => (
            <EFESCard
              key={player.id}
              player={player}
              rank={idx + 1}
              onViewProfile={setSelectedPlayerId}
            />
          ))}
        </div>
      </section>

      {/* 📅 8. UPCOMING EVENTS & 📰 LATEST NEWS ROW */}
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events Box */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-white">
                    Upcoming Events
                  </h3>
                  <span className="text-xs text-zinc-400">Tournament schedules & galas</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentPage('events');
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentPage('events');
                  }}
                  className="group flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 hover:border-amber-500/40 hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-center shrink-0">
                    <span className="text-[10px] font-extrabold uppercase text-amber-400">
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="font-teko text-xl font-black text-white leading-none">
                      {event.date.split(' ')[1] || '2026'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {event.type}
                      </span>
                      {event.status === 'REGISTRATION_OPEN' && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          Registration Open
                        </span>
                      )}
                      {event.id === 'event-1' && (
                        <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                      {event.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest News Box */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-white">
                    Latest News
                  </h3>
                  <span className="text-xs text-zinc-400">Official EFES bulletins & updates</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentPage('events');
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {news.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentPage('events');
                  }}
                  className="group flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 hover:border-amber-500/40 hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-zinc-500">• {item.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                      {item.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
