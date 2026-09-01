import React from 'react';
import { useEFES } from '../context/EFESContext';
import { Trophy, Award, Crown, Search, ShieldCheck, Home } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, setIsSearchOpen, currentAdmin, setIsAdminLoginOpen } = useEFES();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => setCurrentPage('home'),
      isActive: currentPage === 'home',
    },
    {
      id: 'records',
      label: 'Hall of Fame',
      icon: Trophy,
      action: () => setCurrentPage('hall-of-fame'),
      isActive: currentPage === 'hall-of-fame',
    },
    {
      id: 'ballondor',
      label: "Ballon d'Or",
      icon: Award,
      action: () => setCurrentPage('ballon-dor'),
      isActive: currentPage === 'ballon-dor',
      badge: 'S2',
    },
    {
      id: 'leaders',
      label: 'Leaders',
      icon: Crown,
      action: () => setCurrentPage('trophy-leaders'),
      isActive: currentPage === 'trophy-leaders',
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: () => setIsSearchOpen(true),
      isActive: false,
    },
    {
      id: 'admin',
      label: currentAdmin ? 'Council' : 'Admin',
      icon: ShieldCheck,
      action: () => {
        if (currentAdmin) {
          setCurrentPage('admin');
        } else {
          setIsAdminLoginOpen(true);
        }
      },
      isActive: currentPage === 'admin',
    },
  ];

  return (
    <nav
      id="efes-mobile-bottom-navigation"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#030612]/95 backdrop-blur-xl border-t border-amber-500/25 px-2 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.85)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}
    >
      <div className="grid grid-cols-6 gap-1 items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <button
              key={item.id}
              id={`mobile-nav-btn-${item.id}`}
              type="button"
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-150 active:scale-95 ${
                active
                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200 active:text-amber-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-slate-400'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[8px] font-black rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 truncate max-w-full leading-none tracking-tight">
                {item.label}
              </span>
              {active && (
                <div className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
