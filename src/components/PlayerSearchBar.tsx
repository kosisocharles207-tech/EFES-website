import React, { useState, useRef, useEffect } from 'react';
import { useEFES } from '../context/EFESContext';
import { Search, X, Trophy, ArrowRight, Star, Flame, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface PlayerSearchBarProps {
  placeholder?: string;
  variant?: 'hero' | 'compact' | 'inline';
  className?: string;
  showQuickTags?: boolean;
  autoFocus?: boolean;
  onPlayerSelected?: (playerId: string) => void;
}

export const PlayerSearchBar: React.FC<PlayerSearchBarProps> = ({
  placeholder = 'Search player name (Michael, Kosi, Amigty, GT Baddest, TMF...)...',
  variant = 'hero',
  className = '',
  showQuickTags = true,
  autoFocus = false,
  onPlayerSelected,
}) => {
  const { players, setSelectedPlayerId } = useEFES();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanQuery = query.trim().toLowerCase();

  // Filter players based on input query
  const matchingPlayers = cleanQuery
    ? players.filter((player) => {
        const nameMatch = player.name.toLowerCase().includes(cleanQuery);
        const displayMatch = player.displayName?.toLowerCase().includes(cleanQuery);
        const clubMatch = player.primaryClub.toLowerCase().includes(cleanQuery);
        const secClubMatch = player.secondaryClubs?.some((c) => c.toLowerCase().includes(cleanQuery));
        const trophyMatch = player.trophies.some(
          (t) =>
            t.competitionName.toLowerCase().includes(cleanQuery) ||
            t.club.toLowerCase().includes(cleanQuery)
        );
        const statusMatch = player.legendStatus?.toLowerCase().includes(cleanQuery);
        return nameMatch || displayMatch || clubMatch || secClubMatch || trophyMatch || statusMatch;
      })
    : [];

  const handleSelect = (playerId: string) => {
    sounds.playGoldenChime();
    setSelectedPlayerId(playerId);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onPlayerSelected) {
      onPlayerSelected(playerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || matchingPlayers.length === 0) {
      if (e.key === 'ArrowDown' && matchingPlayers.length > 0) {
        setIsOpen(true);
        setSelectedIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < matchingPlayers.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : matchingPlayers.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < matchingPlayers.length) {
        handleSelect(matchingPlayers[selectedIndex].id);
      } else if (matchingPlayers.length > 0) {
        handleSelect(matchingPlayers[0].id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularPlayers = ['MICHAEL', 'KOSI', 'AMIGTY', 'GT BADDEST', 'TMF', 'EMMA', 'OLAMIDE'];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Container */}
      <div
        className={`relative flex items-center transition-all ${
          variant === 'hero'
            ? 'rounded-2xl border-2 border-amber-500/50 bg-zinc-950/90 shadow-[0_0_30px_rgba(245,158,11,0.25)] focus-within:border-amber-400 focus-within:shadow-[0_0_40px_rgba(245,158,11,0.45)]'
            : variant === 'inline'
            ? 'rounded-xl border border-amber-500/40 bg-zinc-900/90 focus-within:border-amber-400 shadow-sm'
            : 'rounded-xl border border-zinc-800 bg-zinc-900/80 focus-within:border-amber-500/50'
        }`}
      >
        <div className="pl-4 pr-2 text-amber-400 flex items-center justify-center shrink-0">
          <Search className={variant === 'hero' ? 'h-6 w-6' : 'h-4 w-4'} />
        </div>

        <input
          ref={inputRef}
          type="text"
          id="player-search-input"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none ${
            variant === 'hero'
              ? 'py-4 pr-12 text-base md:text-lg font-medium'
              : 'py-2.5 pr-10 text-xs md:text-sm'
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Tag Recommendations under the search bar */}
      {showQuickTags && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Search:
          </span>
          {popularPlayers.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setQuery(name);
                setIsOpen(true);
                // If direct match exists, focus or select
                const match = players.find((p) => p.name.toUpperCase() === name.toUpperCase());
                if (match) {
                  handleSelect(match.id);
                }
              }}
              className="rounded-lg bg-zinc-900/90 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/50 px-2 py-0.5 text-[11px] font-bold text-zinc-300 hover:text-amber-300 transition-all cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Live Matching Results Dropdown */}
      {isOpen && cleanQuery && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-amber-500/40 bg-[#0e0e16]/98 shadow-[0_15px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.25)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>Matching EFES Players ({matchingPlayers.length})</span>
            <span className="text-[11px] font-normal text-zinc-400">
              Press <kbd className="rounded bg-zinc-800 px-1 text-[10px] text-amber-300">↵ Enter</kbd> to view profile
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {matchingPlayers.length > 0 ? (
              matchingPlayers.map((player, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={player.id}
                    onClick={() => handleSelect(player.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3.5 rounded-xl p-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-zinc-900/40 border border-transparent hover:bg-zinc-900/80 hover:border-zinc-700'
                    }`}
                  >
                    {/* Avatar with gold border */}
                    <div className="relative shrink-0">
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="h-12 w-12 rounded-xl object-cover border-2 border-amber-400/60 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      {player.legendTier === 'IMMORTAL' && (
                        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black shadow">
                          ★
                        </div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-base text-zinc-100 group-hover:text-amber-300 truncate">
                          {player.name}
                        </h4>
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-extrabold text-zinc-300 shrink-0">
                          {player.overallRating || 95} OVR
                        </span>
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 shrink-0 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 text-amber-400" />
                          {player.legendStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                        <span className="font-medium text-amber-200/90 truncate">
                          {player.primaryClub}
                        </span>
                        {player.secondaryClubs && player.secondaryClubs.length > 0 && (
                          <span className="text-zinc-500 truncate hidden sm:inline">
                            • {player.secondaryClubs.join(', ')}
                          </span>
                        )}
                      </div>

                      {/* Matching trophy summary */}
                      <div className="mt-1 flex items-center gap-1.5 overflow-x-auto text-[11px] text-zinc-300">
                        <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                          <Trophy className="w-3 h-3 inline" /> {player.totalTrophies} Major Trophies
                        </span>
                      </div>
                    </div>

                    {/* View Profile Action Arrow */}
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0 pr-2">
                      <span className="hidden sm:inline">View Profile</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-zinc-400">
                <p className="text-sm font-medium">No players found matching &quot;{query}&quot;</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Try searching for legend names like <strong>Michael</strong>, <strong>Kosi</strong>,{' '}
                  <strong>Amigty</strong>, <strong>GT Baddest</strong>, or clubs like{' '}
                  <strong>Chelsea</strong>, <strong>Man City</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
