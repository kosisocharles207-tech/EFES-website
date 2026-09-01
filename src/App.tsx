import React from 'react';
import { EFESProvider, useEFES } from './context/EFESContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchModal } from './components/SearchModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { HomePage } from './pages/HomePage';
import { HallOfFamePage } from './pages/HallOfFamePage';
import { TrophyLeadersPage } from './pages/TrophyLeadersPage';
import { LegendsPage } from './pages/LegendsPage';
import { BallonDorPage } from './pages/BallonDorPage';
import { EventsPage } from './pages/EventsPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainContent: React.FC = () => {
  const { currentPage } = useEFES();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'hall-of-fame':
        return <HallOfFamePage />;
      case 'trophy-leaders':
        return <TrophyLeadersPage />;
      case 'legends':
        return <LegendsPage />;
      case 'ballon-dor':
        return <BallonDorPage />;
      case 'events':
        return <EventsPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#07070a] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black efootball-bg overflow-x-hidden">
      {/* Dynamic ambient gold accent glow */}
      <div className="fixed -top-40 -left-40 h-96 w-96 rounded-full bg-amber-600/10 blur-[130px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 h-96 w-96 rounded-full bg-yellow-500/10 blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 h-96 w-96 rounded-full bg-amber-700/10 blur-[150px] pointer-events-none" />

      {/* Main Top Navbar */}
      <Navbar />

      {/* Page View Container with mobile bottom clearance */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 pb-28 lg:pb-12">
        {renderCurrentPage()}
      </main>

      {/* Modals & Dialogs */}
      <SearchModal />
      <AdminLoginModal />
      <PlayerProfileModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <EFESProvider>
      <MainContent />
    </EFESProvider>
  );
}
