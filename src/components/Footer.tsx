import React from 'react';
import { useEFES } from '../context/EFESContext';
import { Trophy, Shield, Heart, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';
import { sounds } from '../utils/soundEffects';

export const Footer: React.FC = () => {
  const { setCurrentPage, setIsAdminLoginOpen, currentAdmin } = useEFES();

  const handleNav = (page: PageRoute) => {
    sounds.playClick();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-amber-500/20 bg-[#060609] pt-12 pb-28 lg:pb-8 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/80">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-display text-xl font-black tracking-wider text-white">
                  EFES OFFICIAL WEBSITE
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-amber-400 -mt-0.5">
                  eFootball Elite Squad
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-md">
              The official digital hub of the <strong>eFootball Elite Squad (EFES)</strong>, celebrating immortal esports tacticians, championship dynasties, and verified silverware across competitive eFootball matchdays.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400/90">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Ballon d&apos;Or Season 2 • Coming Soon</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-amber-300 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-300 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('hall-of-fame')} className="hover:text-amber-300 transition-colors">
                  Hall of Fame Records
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trophy-leaders')} className="hover:text-amber-300 transition-colors">
                  Trophy Leaders Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('legends')} className="hover:text-amber-300 transition-colors">
                  Legend Status & Tier List
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ballon-dor')} className="hover:text-amber-300 transition-colors">
                  EFES Ballon d&apos;Or Hub
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('events')} className="hover:text-amber-300 transition-colors">
                  Events & Tournament Schedule
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Governance */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-amber-300 mb-3">
              Governance
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Administered by the EFES Executive Council: Kosikosi, Emma, Ifeanyichukwu, KK, Gentle Fund & Olamide.
            </p>

            {currentAdmin ? (
              <button
                onClick={() => handleNav('admin')}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsAdminLoginOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-amber-500/40 hover:text-amber-300 transition-all"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Council Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} EFES Hall of Fame. All rights reserved. Built for eFootball champions.</p>
          <div className="flex items-center gap-1">
            <span>Powered by Black & Gold passion</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
