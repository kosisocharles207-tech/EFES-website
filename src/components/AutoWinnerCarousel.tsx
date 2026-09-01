import React, { useState, useEffect, useRef } from 'react';
import { useEFES } from '../context/EFESContext';
import {
  Trophy,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Shield,
  Star,
  CheckCircle2,
  Award,
  Zap,
} from 'lucide-react';
import { TrophyIcon } from './TrophyIcon';
import { sounds } from '../utils/soundEffects';
import { HallOfFameRecord, PlayerProfile } from '../types';

interface AutoWinnerCarouselProps {
  autoPlayInterval?: number; // ms, default 3500
  title?: string;
  subtitle?: string;
  showControls?: boolean;
}

export const AutoWinnerCarousel: React.FC<AutoWinnerCarouselProps> = ({
  autoPlayInterval = 3500,
  title = "HALL OF FAME CHAMPIONS",
  subtitle = "Live automatic showcase of all verified EFES tournament conquerors and silverware holders",
  showControls = true,
}) => {
  const { records, competitions, players, setSelectedPlayerId, setCurrentPage } = useEFES();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter valid records that have player name
  const validRecords = records.filter((r) => r.playerName && r.playerName.trim().length > 0);
  const totalSlides = validRecords.length;

  // Helper to find player details
  const getPlayer = (name: string): PlayerProfile | undefined => {
    return players.find(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
  };

  // Helper to find competition
  const getComp = (compId: string) => {
    return competitions.find((c) => c.id === compId);
  };

  // Go to next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (totalSlides || 1));
    setProgress(0);
  };

  // Go to previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (totalSlides || 1)) % (totalSlides || 1));
    setProgress(0);
  };

  // Auto-play timer logic
  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (totalSlides || 1));
      setProgress(0);
    }, autoPlayInterval);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, isHovered, totalSlides, autoPlayInterval]);

  // Smooth CSS progress timer logic
  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const start = Date.now();
    const frameInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / autoPlayInterval) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(frameInterval);
      }
    }, 100);

    return () => {
      clearInterval(frameInterval);
    };
  }, [currentIndex, isPlaying, isHovered, totalSlides, autoPlayInterval]);

  if (totalSlides === 0) return null;

  const currentRecord = validRecords[currentIndex];
  const playerObj = getPlayer(currentRecord.playerName);
  const compObj = getComp(currentRecord.competitionId);

  // Winner Image Resolution
  const winnerPhoto =
    currentRecord.photoUrl ||
    playerObj?.photoUrl ||
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80';

  const handleCardClick = (playerName: string) => {
    sounds.playGoldenChime();
    const p = getPlayer(playerName);
    if (p) {
      setSelectedPlayerId(p.id);
    } else {
      setCurrentPage('hall-of-fame');
    }
  };

  // Adjacent items for carousel preview
  const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  const nextIndex = (currentIndex + 1) % totalSlides;
  const prevRecord = validRecords[prevIndex];
  const nextRecord = validRecords[nextIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-[#0e1738] via-[#080e22] to-[#030612] shadow-[0_0_50px_rgba(245,158,11,0.3)] efootball-card-foil stadium-floodlights"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Stadium Turf & eFootball Pitch Markings */}
      <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      {/* Dynamic Auto-play Progress Bar at the top */}
      <div className="relative w-full h-1.5 bg-black/60 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(251,191,36,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top Header Controls Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-gold-pulse">
            <Crown className="h-5 w-5 text-black drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                Auto-Swiping Live Reel
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
              {title}
            </h3>
          </div>
        </div>

        {/* Playback Controls & Counter */}
        {showControls && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-300 bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <span className="text-white font-extrabold">{currentIndex + 1}</span> / {totalSlides}
            </span>

            <button
              onClick={() => {
                sounds.playClick();
                setIsPlaying(!isPlaying);
              }}
              title={isPlaying ? 'Pause Auto-Swipe' : 'Resume Auto-Swipe'}
              className="rounded-xl border border-amber-500/40 bg-zinc-900/80 p-2 text-amber-300 hover:bg-amber-500 hover:text-black transition-all cursor-pointer shadow"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                prevSlide();
              }}
              title="Previous Winner"
              className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-2 text-zinc-300 hover:border-amber-500 hover:text-amber-300 transition-all cursor-pointer shadow"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                nextSlide();
              }}
              title="Next Winner"
              className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-2 text-zinc-300 hover:border-amber-500 hover:text-amber-300 transition-all cursor-pointer shadow"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Centerpiece Winner Display */}
      <div className="relative z-10 p-5 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Authentic Winner Photo & Digital eFootball Card Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              onClick={() => handleCardClick(currentRecord.playerName)}
              className="group relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border-2 border-amber-500/60 bg-gradient-to-b from-[#132048] via-[#091129] to-[#02050f] shadow-[0_0_40px_rgba(245,158,11,0.4)] cursor-pointer hover:scale-[1.02] hover:border-yellow-400 transition-all duration-300"
            >
              {/* Corner Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/50 px-3 py-1 text-[11px] font-black text-amber-300 shadow">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span>CHAMPION #{currentIndex + 1}</span>
              </div>

              {/* Verified Ribbon */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300 shadow">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>VERIFIED</span>
              </div>

              {/* Player Image */}
              <img
                src={winnerPhoto}
                alt={currentRecord.playerName}
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Bottom Gradient Overlay on Photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#02040b] via-[#02040b]/40 to-transparent pointer-events-none" />

              {/* Player Tag on Photo */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block mb-0.5">
                  {currentRecord.club}
                </span>
                <h4 className="font-display text-2xl sm:text-3xl font-black uppercase text-white leading-tight drop-shadow-md">
                  {currentRecord.playerName}
                </h4>
              </div>
            </div>
          </div>

          {/* Right Column: Silverware Details, Competition Meta, and Career Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-left">
            {/* Competition Badge & Trophy Pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/20 border border-amber-500/50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 shadow-inner">
                <TrophyIcon
                  iconName={compObj?.iconName || 'trophy'}
                  className="w-4 h-4 text-yellow-300 animate-pulse"
                />
                <span>{compObj?.name || currentRecord.competitionName}</span>
              </div>

              {currentRecord.seasonOrYear && (
                <span className="rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-300">
                  {currentRecord.seasonOrYear}
                </span>
              )}

              <span className="rounded-xl bg-gradient-to-r from-amber-500/30 to-yellow-500/20 border border-amber-500/40 px-3 py-1 text-xs font-extrabold text-amber-300">
                {currentRecord.count}x Silverware
              </span>
            </div>

            {/* Title & Headline */}
            <div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
                {currentRecord.playerName}
              </h2>
              <p className="text-sm md:text-base font-bold text-amber-400 mt-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span>{currentRecord.club}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300">
                  {playerObj?.legendTier || 'EFES IMMORTAL'}
                </span>
              </p>
            </div>

            {/* Silverware notes & Tournament description */}
            <div className="rounded-2xl bg-black/60 border border-zinc-800 p-4 sm:p-5 space-y-2 text-xs md:text-sm text-zinc-300 leading-relaxed shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>Championship Honors & Notes</span>
              </div>
              <p className="text-zinc-300">
                {currentRecord.notes ||
                  `${currentRecord.playerName} triumphed in the ${
                    compObj?.name || currentRecord.competitionName
                  } representing ${
                    currentRecord.club
                  }, cementing their legendary legacy in the EFES Hall of Fame archive.`}
              </p>
              {compObj?.trophyDescription && (
                <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800/80">
                  Prize: {compObj.trophyDescription}
                </p>
              )}
            </div>

            {/* Player Overall Silverware Counter Grid */}
            {playerObj && (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-center">
                  <span className="font-teko text-2xl sm:text-3xl font-black text-amber-400 leading-none">
                    {playerObj.totalTrophies}
                  </span>
                  <span className="block text-[9px] font-bold uppercase text-zinc-400 mt-0.5">
                    Career Trophies
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-center">
                  <span className="font-teko text-2xl sm:text-3xl font-black text-yellow-300 leading-none">
                    {playerObj.overallRating || 96}
                  </span>
                  <span className="block text-[9px] font-bold uppercase text-zinc-400 mt-0.5">
                    eFootball OVR
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-center">
                  <span className="font-teko text-2xl sm:text-3xl font-black text-emerald-400 leading-none">
                    {playerObj.achievements?.length || 4}
                  </span>
                  <span className="block text-[9px] font-bold uppercase text-zinc-400 mt-0.5">
                    Major Accolades
                  </span>
                </div>
              </div>
            )}

            {/* Quick Action Button */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleCardClick(currentRecord.playerName)}
                className="gold-button flex items-center gap-2 rounded-2xl px-6 py-3 text-xs md:text-sm font-black cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <span>View {currentRecord.playerName}&apos;s Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentPage('hall-of-fame');
                }}
                className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/90 px-5 py-3 text-xs md:text-sm font-bold text-zinc-200 hover:border-amber-500 hover:text-white transition-all cursor-pointer"
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Full Hall of Fame Archive</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Thumbnail Navigation Bar */}
      <div className="relative z-10 px-5 py-4 border-t border-zinc-800/80 bg-black/60 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 shrink-0 hidden sm:inline">
            Fast Jump:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {validRecords.map((rec, idx) => (
              <button
                key={rec.id + '-' + idx}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex(idx);
                  setProgress(0);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 h-2.5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]'
                    : 'w-2.5 h-2.5 bg-zinc-700 hover:bg-zinc-500'
                }`}
                title={`Winner #${idx + 1}: ${rec.playerName} (${rec.competitionName})`}
              />
            ))}
          </div>
        </div>

        <div className="text-[10px] font-bold text-amber-400/80 flex items-center gap-1.5 shrink-0">
          <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
          <span>Auto-advances every {Math.round(autoPlayInterval / 1000)}s</span>
        </div>
      </div>
    </div>
  );
};
