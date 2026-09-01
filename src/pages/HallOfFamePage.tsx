import React, { useState } from 'react';
import { useEFES } from '../context/EFESContext';
import {
  Trophy,
  Crown,
  Search,
  Plus,
  Sparkles,
  ExternalLink,
  Camera,
  Star,
  Flame,
  Shield,
  X,
  CheckCircle2,
} from 'lucide-react';
import { TrophyIcon } from '../components/TrophyIcon';
import { PhotoUploader } from '../components/PhotoUploader';
import { AutoWinnerCarousel } from '../components/AutoWinnerCarousel';
import { sounds } from '../utils/soundEffects';
import { HallOfFameRecord, PlayerProfile } from '../types';

export const HallOfFamePage: React.FC = () => {
  const {
    competitions,
    records,
    setSelectedPlayerId,
    players,
    currentAdmin,
    setCurrentPage,
    uploadWinnerPhoto,
  } = useEFES();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterQuery, setFilterQuery] = useState<string>('');
  
  // Quick Photo Change Modal for logged in admins
  const [photoModalTarget, setPhotoModalTarget] = useState<{
    playerName: string;
    currentPhoto: string;
    club: string;
  } | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Competitions' },
    { id: 'CUP', label: 'Knockout Cups' },
    { id: 'LEAGUE', label: 'League Championships' },
    { id: 'INTERNATIONAL', label: 'International & World' },
    { id: 'SPECIAL', label: 'Special & Super Cups' },
  ];

  const filteredCompetitions = competitions.filter((comp) => {
    if (selectedCategory !== 'ALL' && comp.category !== selectedCategory) {
      return false;
    }
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      const matchComp =
        comp.name.toLowerCase().includes(q) || comp.trophyDescription.toLowerCase().includes(q);
      const matchRecords = records.some(
        (r) =>
          r.competitionId === comp.id &&
          (r.playerName.toLowerCase().includes(q) || r.club.toLowerCase().includes(q))
      );
      return matchComp || matchRecords;
    }
    return true;
  });

  const getPlayerObj = (playerName: string): PlayerProfile | undefined => {
    return players.find(
      (p) => p.name.toUpperCase().trim() === playerName.toUpperCase().trim()
    );
  };

  const getWinnerPhoto = (rec: HallOfFameRecord, playerObj?: PlayerProfile): string => {
    if (rec.photoUrl) return rec.photoUrl;
    if (playerObj && playerObj.photoUrl) return playerObj.photoUrl;
    return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80';
  };

  const handlePlayerClick = (playerName: string) => {
    sounds.playGoldenChime();
    const p = getPlayerObj(playerName);
    if (p) {
      setSelectedPlayerId(p.id);
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 p-6 md:p-10 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300 mb-3">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Official EFES Archive & Winner Showcase</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
              HALL OF <span className="gold-gradient-text">FAME</span>
            </h1>
            <p className="mt-2 text-xs md:text-sm text-zinc-300 max-w-xl leading-relaxed">
              Every official tournament winner, title reign, and iconic champion across all EFES
              competitions. Featuring authentic winner photos and professional profile cards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {currentAdmin ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentPage('admin');
                }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 px-5 py-3 text-xs font-black text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-102 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Upload & Manage Photos</span>
              </button>
            ) : null}

            <div className="flex items-center gap-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 px-4 py-3 text-center">
              <Trophy className="w-6 h-6 text-amber-400" />
              <div className="text-left">
                <span className="font-teko text-2xl font-black text-white leading-none">
                  {records.length}
                </span>
                <span className="block text-[9px] uppercase font-bold text-zinc-400 -mt-0.5">
                  Silverware Titles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔄 Continuous Auto-Swiping Hall of Fame Winner Carousel */}
      <AutoWinnerCarousel
        autoPlayInterval={3200}
        title="IMMORTALIZED CONQUERORS • AUTO REEL"
        subtitle="Automatic live rotation of verified champion title reigns and trophy achievements"
      />

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search within page */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-400" />
          <input
            type="text"
            placeholder="Search winner name (Michael, Amigty, Juven...)..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Competitions Grid with Football-Style Winner Cards */}
      <div className="space-y-10">
        {filteredCompetitions.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-12 text-center text-zinc-400">
            <Trophy className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
            <p className="font-bold text-sm text-zinc-300">No matching Hall of Fame records found.</p>
            <p className="text-xs text-zinc-500 mt-1">Try resetting your search query or category filter.</p>
          </div>
        ) : (
          filteredCompetitions.map((comp) => {
            const compRecords = records.filter((r) => r.competitionId === comp.id);

            return (
              <div
                key={comp.id}
                className="overflow-hidden rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-[#11111a] to-[#09090e] shadow-[0_0_35px_rgba(0,0,0,0.6)] transition-all hover:border-amber-500/40"
              >
                {/* Competition Header Banner */}
                <div
                  className={`relative bg-gradient-to-r ${comp.bannerGradient} border-b border-zinc-800/80 p-5 md:p-6`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <TrophyIcon type={comp.iconName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                            {comp.category}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-xs text-zinc-300 font-semibold">
                            {compRecords.length} {compRecords.length === 1 ? 'Official Champion' : 'Official Champions'}
                          </span>
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                          🏟️ {comp.name}
                        </h3>
                        <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
                          {comp.trophyDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Football-Style Profile Cards for Winners */}
                <div className="p-5 md:p-6">
                  {compRecords.length === 0 ? (
                    <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 p-6 text-center text-xs text-zinc-500">
                      No official winners registered for this competition yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {compRecords.map((rec) => {
                        const playerObj = getPlayerObj(rec.playerName);
                        const photoUrl = getWinnerPhoto(rec, playerObj);
                        const totalTrophies = playerObj ? playerObj.totalTrophies : rec.count;
                        const isImmortal = totalTrophies >= 5 || playerObj?.legendTier === 'IMMORTAL';
                        const isElite = totalTrophies >= 3 || playerObj?.legendTier === 'ELITE';

                        return (
                          <div
                            key={rec.id}
                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 ${
                              isImmortal
                                ? 'border-yellow-400/60 bg-gradient-to-b from-[#1c1810] via-[#101017] to-[#0a0a0f] shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.45)]'
                                : isElite
                                ? 'border-amber-500/50 bg-gradient-to-b from-[#181410] via-[#0e0e15] to-[#08080d] shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(217,119,6,0.35)]'
                                : 'border-zinc-800 hover:border-amber-500/50 bg-zinc-950/90 shadow-lg'
                            }`}
                          >
                            {/* Subtle Foil Shine & Pitch Grid Background */}
                            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-10 pointer-events-none" />
                            <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                            {/* Card Top Strip: Medal, Edition & Trophies */}
                            <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 bg-black/40 px-3.5 py-2 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black shadow">
                                  🥇
                                </span>
                                <span className="font-extrabold uppercase text-amber-300 text-[11px] tracking-wider">
                                  {rec.seasonOrYear || 'Champion'}
                                </span>
                              </div>

                              {/* Silverware Multiplier */}
                              <div className="flex items-center gap-1">
                                <span className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-teko text-base font-black text-amber-300">
                                  x{rec.count} {rec.count === 1 ? 'Title' : 'Titles'}
                                </span>
                              </div>
                            </div>

                            {/* Main Card Body: Photo & Identity */}
                            <div
                              onClick={() => handlePlayerClick(rec.playerName)}
                              className="relative z-10 p-4 cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                {/* Winner Photo Frame with Gold Glowing Ring */}
                                <div className="relative shrink-0">
                                  {/* Glowing aura */}
                                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 blur-md opacity-40 group-hover:opacity-80 transition-opacity" />

                                  <div className="relative z-10 h-20 w-20 sm:h-22 sm:w-22 overflow-hidden rounded-2xl border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] bg-black">
                                    <img
                                      src={photoUrl}
                                      alt={rec.playerName}
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                      referrerPolicy="no-referrer"
                                    />
                                    {isImmortal && (
                                      <div className="absolute top-1 right-1 rounded-full bg-amber-400 text-[8px] font-black text-black px-1 shadow">
                                        ★
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Winner Information */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-display text-lg font-black uppercase text-white group-hover:text-amber-300 transition-colors truncate">
                                      🥇 {rec.playerName}
                                    </h4>
                                  </div>

                                  <p className="text-xs font-bold text-amber-400 mt-0.5 truncate">
                                    Club: <strong className="text-white">{rec.club}</strong>
                                  </p>

                                  {/* Trophy Summary Pill */}
                                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-300">
                                    <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span>{totalTrophies} Total {totalTrophies === 1 ? 'Trophy' : 'Trophies'}</span>
                                  </div>

                                  {playerObj?.overallRating && (
                                    <div className="text-[10px] font-bold text-zinc-400 mt-1">
                                      OVR <strong className="text-amber-300">{playerObj.overallRating}</strong> • {playerObj.legendStatus || 'EFES Legend'}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Record Notes if present */}
                              {rec.notes && (
                                <p className="mt-3 text-[11px] text-zinc-400 italic bg-black/30 rounded-xl p-2 border border-zinc-800/60 line-clamp-2">
                                  &ldquo;{rec.notes}&rdquo;
                                </p>
                              )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="relative z-10 flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/80 px-3.5 py-2 text-xs">
                              <button
                                type="button"
                                onClick={() => handlePlayerClick(rec.playerName)}
                                className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-amber-300 transition-colors"
                              >
                                <span>View Player Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>

                              {/* Admin Photo Quick Change */}
                              {currentAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sounds.playClick();
                                    setPhotoModalTarget({
                                      playerName: rec.playerName,
                                      currentPhoto: photoUrl,
                                      club: rec.club,
                                    });
                                  }}
                                  className="flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black px-2 py-1 text-[10px] font-bold text-zinc-300 transition-colors"
                                  title="Change Winner Photo"
                                >
                                  <Camera className="w-3 h-3" />
                                  <span>Change Photo</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Photo Upload Modal for Admin */}
      {photoModalTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setPhotoModalTarget(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-amber-500/50 bg-[#0f0f17] p-6 shadow-[0_0_60px_rgba(245,158,11,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPhotoModalTarget(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-black uppercase text-white">
                  Update Winner Photo: {photoModalTarget.playerName}
                </h3>
                <p className="text-xs text-amber-400 font-medium">Club: {photoModalTarget.club}</p>
              </div>
            </div>

            <PhotoUploader
              value={photoModalTarget.currentPhoto}
              onChange={(newUrl) => {
                uploadWinnerPhoto(photoModalTarget.playerName, newUrl);
                setPhotoModalTarget({
                  ...photoModalTarget,
                  currentPhoto: newUrl,
                });
              }}
              label="Select New Winner Photo"
              playerName={photoModalTarget.playerName}
              helperText="Upload JPG, PNG, or WEBP from phone gallery or computer"
            />

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  sounds.playGoldenChime();
                  setPhotoModalTarget(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2 text-xs font-black text-black shadow-lg hover:scale-102 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
