import React, { useEffect, useRef } from 'react';
import { useEFES } from '../context/EFESContext';
import { Search, X, Trophy, Shield, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    players,
    records,
    competitions,
    setSelectedPlayerId,
    setCurrentPage,
  } = useEFES();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  const matchingPlayers = q
    ? players.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.primaryClub.toLowerCase().includes(q) ||
          p.displayName.toLowerCase().includes(q) ||
          (p.secondaryClubs && p.secondaryClubs.some((c) => c.toLowerCase().includes(q)))
      )
    : players.slice(0, 4);

  const matchingCompetitions = q
    ? competitions.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.trophyDescription.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
    : competitions.slice(0, 3);

  const matchingRecords = q
    ? records.filter(
        (r) =>
          r.playerName.toLowerCase().includes(q) ||
          r.competitionName.toLowerCase().includes(q) ||
          r.club.toLowerCase().includes(q) ||
          (r.notes && r.notes.toLowerCase().includes(q))
      )
    : [];

  const handleSelectPlayer = (id: string) => {
    sounds.playGoldenChime();
    setSelectedPlayerId(id);
    setIsSearchOpen(false);
  };

  const handleSelectCompetition = () => {
    sounds.playClick();
    setCurrentPage('hall-of-fame');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-500/40 bg-[#0e0e16] shadow-[0_0_50px_rgba(245,158,11,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="relative flex items-center border-b border-zinc-800 px-4 py-3.5 bg-zinc-950">
          <Search className="h-5 w-5 text-amber-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search players (Michael, Amigty...), clubs (Man City, Chelsea...), competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm md:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mr-2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="rounded-lg bg-zinc-900 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
          {/* Players Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              <span>{q ? 'Matching Legends' : 'Featured Legends'}</span>
              <span className="text-zinc-500">{matchingPlayers.length} found</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchingPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handleSelectPlayer(player.id)}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2.5 hover:border-amber-500/40 hover:bg-zinc-900 transition-all cursor-pointer group"
                >
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="h-11 w-11 rounded-full object-cover border border-amber-500/40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-sm text-zinc-100 group-hover:text-amber-300 truncate">
                        {player.name}
                      </h4>
                      <span className="flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-300">
                        <Trophy className="w-2.5 h-2.5" />
                        {player.totalTrophies}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{player.primaryClub}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Competitions */}
          {matchingCompetitions.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                <span>Competitions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingCompetitions.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={handleSelectCompetition}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2.5 hover:border-amber-500/40 hover:bg-zinc-900 transition-all cursor-pointer group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-zinc-100 group-hover:text-amber-300 truncate">
                        {comp.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate">{comp.trophyDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hall of Fame Records */}
          {matchingRecords.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                Matching Hall of Fame Records ({matchingRecords.length})
              </div>
              <div className="space-y-1.5">
                {matchingRecords.slice(0, 6).map((rec) => (
                  <div
                    key={rec.id}
                    onClick={handleSelectCompetition}
                    className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-2.5 hover:bg-zinc-900 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold text-xs text-zinc-200">{rec.playerName}</span>
                        <span className="text-zinc-500 text-xs mx-1.5">•</span>
                        <span className="text-zinc-400 text-xs">{rec.club}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-300">{rec.competitionName}</span>
                      <span className="ml-1.5 rounded bg-amber-500/20 px-1 py-0.2 text-[10px] font-bold text-amber-300">
                        x{rec.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info and mobile close */}
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-2.5 text-[11px] text-zinc-500 flex items-center justify-between">
          <span className="hidden sm:inline">Official EFES Hall of Fame Database</span>
          <span className="truncate max-w-[200px] sm:max-w-none">Tip: Click any player to view trophy room</span>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="sm:hidden rounded-lg bg-zinc-900 px-3 py-1 text-xs text-amber-400 font-bold border border-zinc-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
