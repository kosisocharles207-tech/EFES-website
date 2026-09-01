import React, { useState } from 'react';
import { useEFES } from '../context/EFESContext';
import { PageRoute } from '../types';
import {
  Trophy,
  Flame,
  Crown,
  Calendar,
  Shield,
  Search,
  Volume2,
  VolumeX,
  Menu,
  X,
  LogOut,
  UserCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setIsSearchOpen,
    isMuted,
    toggleMute,
    currentAdmin,
    logoutAdmin,
    setIsAdminLoginOpen,
    isSyncing,
    lastServerSync,
    serverConnected,
    syncWithServer,
  } = useEFES();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const handleManualSync = async () => {
    sounds.playClick();
    await syncWithServer(true);
    sounds.playGoldenChime();
    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 2500);
  };

  const navItems: { id: PageRoute; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Trophy className="w-4 h-4" /> },
    { id: 'hall-of-fame', label: 'Hall of Fame', icon: <Crown className="w-4 h-4" /> },
    { id: 'trophy-leaders', label: 'Trophy Leaders', icon: <Flame className="w-4 h-4 text-amber-400" /> },
    { id: 'legends', label: 'Legends', icon: <Shield className="w-4 h-4" /> },
    { id: 'ballon-dor', label: "Ballon d'Or", icon: <Sparkles className="w-4 h-4 text-yellow-300" />, badge: 'S2' },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PageRoute) => {
    sounds.playClick();
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#07070a]/90 backdrop-blur-xl transition-all">
      {/* Top golden ticker / live pulse banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-amber-600/30 to-amber-950/60 py-1 text-center text-[11px] font-semibold tracking-wider text-amber-200 border-b border-amber-500/15 flex items-center justify-center gap-2 px-4">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="truncate">
          OFFICIAL eFOOTBALL ELITE SQUAD (EFES) • BALLON D&apos;OR S2 COMING SOON • ALL-TIME TROPHY LEADER: MICHAEL (5 TROPHIES)
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
        {/* EFES Official Gold Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex cursor-pointer items-center gap-3 select-none group"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-0.5 shadow-[0_0_18px_rgba(245,158,11,0.45)] transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <Trophy className="h-6 w-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black">
              ★
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl md:text-2xl font-black tracking-wider text-white">
                EFES
              </span>
              <span className="rounded bg-gradient-to-r from-amber-500 to-yellow-400 px-1.5 py-0.2 text-[10px] font-extrabold text-black tracking-widest uppercase">
                OFFICIAL
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 -mt-1 font-teko text-sm">
              eFootball Elite Squad
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'text-zinc-300 hover:bg-zinc-900/80 hover:text-amber-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-1.5 py-0.2 text-[9px] font-extrabold text-black">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Live Sync, Search, Sound, Admin Login/Dashboard */}
        <div className="flex items-center gap-2">
          {/* Live Cloud Server Sync Button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              showSyncSuccess
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : serverConnected
                ? 'border-amber-500/30 bg-zinc-900/90 text-zinc-300 hover:border-amber-500/60 hover:text-amber-300'
                : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
            }`}
            title={
              lastServerSync
                ? `Live EFES Cloud Synced (${lastServerSync}). Click to pull latest updates.`
                : 'Sync with live EFES Cloud Server'
            }
          >
            {showSyncSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] font-bold text-emerald-300">Updated</span>
              </>
            ) : (
              <>
                <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden xl:inline text-[11px] text-zinc-400">
                  {isSyncing ? 'Syncing...' : 'Live Sync'}
                </span>
              </>
            )}
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsSearchOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs font-semibold text-zinc-300 hover:border-amber-500/40 hover:text-amber-300 transition-all shadow-sm"
            title="Search players & trophies (Ctrl+K)"
          >
            <Search className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400 border border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleMute}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-amber-500/40 hover:text-amber-300 transition-all"
            title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-zinc-500" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Admin Section */}
          {currentAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  currentPage === 'admin'
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                    : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                <UserCheck className="h-4 w-4 text-yellow-300" />
                <span className="hidden sm:inline">{currentAdmin.name}</span>
                <span className="sm:hidden">Admin</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-950/30 text-red-400 hover:bg-red-900/40 transition-all"
                title="Logout Admin"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                setIsAdminLoginOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-3.5 py-2 text-xs font-extrabold text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_22px_rgba(245,158,11,0.6)] hover:scale-102 transition-all"
            >
              <Shield className="h-4 w-4 fill-black/20" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-amber-400"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-500/20 bg-zinc-950/95 px-4 py-4 backdrop-blur-2xl">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/40'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {currentAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="mt-2 flex items-center justify-between rounded-xl bg-amber-500/20 border border-amber-500/50 px-4 py-3 text-sm font-bold text-amber-300"
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4" />
                  <span>Admin Dashboard ({currentAdmin.name})</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAdminLoginOpen(true);
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-3 text-sm font-extrabold text-black"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
