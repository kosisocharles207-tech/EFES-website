import React, { useState } from 'react';
import { useEFES } from '../context/EFESContext';
import {
  Shield,
  Trophy,
  Crown,
  Vote,
  Calendar,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Lock,
  Unlock,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Search,
  Camera,
  RefreshCw,
  Image as ImageIcon,
  Save,
  X,
  ExternalLink,
  ShieldAlert,
  KeyRound,
  Activity,
  UserCheck,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  EyeOff,
  LogOut,
  Newspaper,
  Award,
  Zap,
  Mail,
  User,
} from 'lucide-react';
import {
  HallOfFameRecord,
  BallonDorContender,
  PlayerProfile,
  EventItem,
  NewsItem,
  Competition,
} from '../types';
import { PhotoUploader } from '../components/PhotoUploader';
import { sounds } from '../utils/soundEffects';

export const AdminDashboard: React.FC = () => {
  const {
    currentAdmin,
    loginAdmin,
    logoutAdmin,
    setIsAdminLoginOpen,
    setCurrentPage,
    authorizedAdminsList,
    updateAdminPassword,
    setUniversalAdminPassword,
    activityLogs,
    clearActivityLogs,
    inactivityNotice,
    clearInactivityNotice,
    competitions,
    records,
    players,
    contenders,
    ballonDorState,
    events,
    news,
    addRecord,
    updateRecord,
    deleteRecord,
    uploadWinnerPhoto,
    deleteWinnerPhoto,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addContender,
    updateContender,
    deleteContender,
    updateBallonDorState,
    setBallonDorWinner,
    addEvent,
    updateEvent,
    deleteEvent,
    addNews,
    updateNews,
    deleteNews,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    resetToDefaultData,
    exportDatabaseJson,
    importDatabaseJson,
  } = useEFES();

  // Inline Login State for Access Denied screen (confidential, no prefill)
  const [inlineIdentifier, setInlineIdentifier] = useState('');
  const [inlinePassword, setInlinePassword] = useState('');
  const [inlineShowPassword, setInlineShowPassword] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [inlineSuccess, setInlineSuccess] = useState<string | null>(null);
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    setInlineSuccess(null);

    const user = inlineIdentifier.trim();
    const pass = inlinePassword.trim();

    if (!user) {
      setInlineError('Please enter your approved Admin Username or Email.');
      sounds.playClick();
      return;
    }

    if (!pass) {
      setInlineError('Please enter your Admin Password.');
      sounds.playClick();
      return;
    }

    setIsInlineSubmitting(true);

    setTimeout(() => {
      const result = loginAdmin(user, pass);
      setIsInlineSubmitting(false);

      if (result.success) {
        setInlineSuccess(result.message || `Access Granted: Welcome back, ${user}!`);
        sounds.playGoldenChime();
      } else {
        setInlineError(result.error || '🚫 ACCESS DENIED: You do not have permission to access the EFES Admin Dashboard.');
        sounds.playWhistle();
      }
    }, 200);
  };

  const [activeTab, setActiveTab] = useState<
    'records' | 'photos' | 'ballondor' | 'players' | 'events' | 'news' | 'security' | 'system'
  >('records');

  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showSaveNotice = (msg: string) => {
    setSaveToast(msg);
    sounds.playGoldenChime();
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Record Form Modal / State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recordForm, setRecordForm] = useState<{
    competitionId: string;
    competitionName: string;
    playerName: string;
    club: string;
    count: number;
    seasonOrYear: string;
    trophyType: string;
    notes: string;
    photoUrl: string;
  }>({
    competitionId: 'champions-cup',
    competitionName: 'EFES Champions Cup',
    playerName: '',
    club: '',
    count: 1,
    seasonOrYear: 'Season 2026',
    trophyType: 'Main Trophy',
    notes: '',
    photoUrl: '',
  });

  // Contender Form Modal / State
  const [isContenderModalOpen, setIsContenderModalOpen] = useState(false);
  const [editingContenderId, setEditingContenderId] = useState<string | null>(null);
  const [contenderForm, setContenderForm] = useState({
    name: '',
    club: '',
    photoUrl:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    position: 'CF / SS',
    goals: 12,
    assists: 8,
    matches: 15,
    rating: 9.3,
    winRate: 85,
    achievements: 'EFES Champions Cup Winner, Tournament Top Scorer',
    seasonTrophies: 'Champions Cup S2, Super Cup',
  });

  // Player Profile Modal / State
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerForm, setPlayerForm] = useState({
    name: '',
    displayName: '',
    photoUrl:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    primaryClub: '',
    preferredPosition: 'CF',
    overallRating: 92,
    bio: '',
    achievements: 'EFES Hall of Fame Inductee',
    awardsWon: 'Golden Boot, Best Player',
  });

  // Event Modal / State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState<{
    title: string;
    type: 'TOURNAMENT' | 'SPECIAL_EVENT' | 'SEASON_UPDATE';
    date: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
    description: string;
    prizePool: string;
    locationOrPlatform: string;
  }>({
    title: '',
    type: 'TOURNAMENT',
    date: 'NOV 2026',
    status: 'UPCOMING',
    description: '',
    prizePool: '',
    locationOrPlatform: 'eFootball Arena Lobby',
  });

  // News Modal / State
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<{
    title: string;
    category: 'TOURNAMENT' | 'BALLON_DOR' | 'HALL_OF_FAME' | 'COMMUNITY';
    date: string;
    summary: string;
    imageUrl: string;
    isFeatured: boolean;
  }>({
    title: '',
    category: 'HALL_OF_FAME',
    date: 'Just Now',
    summary: '',
    imageUrl:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
  });

  // Password Manager State
  const [passwordTargetAdmin, setPasswordTargetAdmin] = useState<string>('Kosikosi');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  // Universal Password State (allows setting 1 password for all admins like 246824)
  const [universalPasswordInput, setUniversalPasswordInput] = useState<string>('246824');
  const [universalPasswordSuccess, setUniversalPasswordSuccess] = useState<string | null>(null);
  const [showAdminPasswordsTable, setShowAdminPasswordsTable] = useState<boolean>(false);
  const [editingAdminPassKey, setEditingAdminPassKey] = useState<Record<string, string>>({});

  // Search in Admin
  const [adminSearch, setAdminSearch] = useState('');

  const getPlayerPhoto = (playerName: string, fallbackRecordPhoto?: string): string => {
    const clean = playerName.toUpperCase().trim();
    const p = players.find((pl) => pl.name.toUpperCase().trim() === clean);
    if (p && p.photoUrl) return p.photoUrl;
    if (fallbackRecordPhoto) return fallbackRecordPhoto;
    return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80';
  };

  // -------------------------------------------------------------
  // STRICT ACCESS DENIED SCREEN (when public / unauthenticated)
  // -------------------------------------------------------------
  if (!currentAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Inactivity Notice if auto-logged out */}
        {inactivityNotice && (
          <div className="mx-auto max-w-2xl rounded-2xl bg-amber-950/90 border border-amber-500/80 p-4 text-amber-200 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs font-bold">{inactivityNotice}</span>
            </div>
            <button
              onClick={clearInactivityNotice}
              className="text-amber-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-red-500/70 bg-gradient-to-b from-[#140810] via-[#090814] to-[#030612] p-8 sm:p-12 text-center shadow-[0_0_80px_rgba(239,68,68,0.3)] efootball-card-foil stadium-floodlights">
          {/* Pulsing Lock Emblem */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 via-amber-600 to-red-800 p-1 shadow-[0_0_40px_rgba(239,68,68,0.7)] animate-pulse">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#080812]">
              <ShieldAlert className="h-12 w-12 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-300 mb-4 shadow">
            <Lock className="w-4 h-4 text-red-400" />
            <span>Strict EFES Security Gate</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md">
            🚫 ACCESS DENIED
          </h2>

          <p className="mt-3 text-base sm:text-lg font-bold text-red-200/90 max-w-lg mx-auto leading-relaxed">
            &ldquo;You do not have permission to access the EFES Admin Dashboard.&rdquo;
          </p>

          <p className="mt-2 text-xs text-zinc-400 max-w-md mx-auto">
            The EFES Hall of Fame Dashboard is strictly restricted to authorized administrators. Public
            visitors and unapproved accounts cannot view or modify administrative records.
          </p>

          {/* Error Message: ACCESS DENIED / Invalid Password */}
          {inlineError && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-red-950/90 border-2 border-red-500/80 p-4 text-xs text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.4)] text-left animate-in shake duration-200">
              <ShieldAlert className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-black text-sm block tracking-wide text-red-300">
                  {inlineError.includes('ACCESS DENIED') ? '🚫 ACCESS DENIED' : 'AUTHENTICATION FAILED'}
                </span>
                <span className="leading-relaxed block font-medium">{inlineError}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {inlineSuccess && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/80 p-4 text-xs text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.4)] text-left animate-in zoom-in-95">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <span className="font-black text-sm block text-emerald-300">ACCESS GRANTED</span>
                <span className="font-medium">{inlineSuccess}</span>
              </div>
            </div>
          )}

          {/* Confidential Council Verification Form */}
          <form onSubmit={handleInlineSubmit} className="mt-8 rounded-2xl bg-black/80 border border-amber-500/40 p-6 sm:p-7 text-left space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span>Authorized Council Verification</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">
                Admin credentials required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">
                  Admin Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inlineIdentifier}
                    onChange={(e) => setInlineIdentifier(e.target.value)}
                    placeholder="Enter admin username (e.g. Kosikosi)"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 pl-9 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-amber-400" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={inlineShowPassword ? 'text' : 'password'}
                    value={inlinePassword}
                    onChange={(e) => setInlinePassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 pl-9 pr-9 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-mono"
                    required
                  />
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-amber-400" />
                  <button
                    type="button"
                    onClick={() => setInlineShowPassword(!inlineShowPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-amber-300 transition-colors"
                  >
                    {inlineShowPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isInlineSubmitting}
                className="gold-button flex-1 rounded-xl py-3 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
              >
                {isInlineSubmitting ? (
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Authorize &amp; Unlock Admin Dashboard</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setCurrentPage('home');
                }}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN LOGGED IN DASHBOARD
  // -------------------------------------------------------------

  // Handle Record Submit
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = competitions.find((c) => c.id === recordForm.competitionId);
    const compName = comp ? comp.name : recordForm.competitionName;
    const cleanPlayer = recordForm.playerName.toUpperCase().trim();

    if (editingRecordId) {
      updateRecord(editingRecordId, {
        ...recordForm,
        playerName: cleanPlayer,
        competitionName: compName,
        count: Number(recordForm.count),
      });
      showSaveNotice(`💾 Winner record updated for ${cleanPlayer}!`);
    } else {
      addRecord({
        ...recordForm,
        playerName: cleanPlayer,
        competitionName: compName,
        count: Number(recordForm.count),
      });
      showSaveNotice(`➕ New Hall of Fame winner ${cleanPlayer} registered!`);
    }

    setIsRecordModalOpen(false);
    setEditingRecordId(null);
  };

  const handleEditRecord = (record: HallOfFameRecord) => {
    sounds.playClick();
    const pPhoto = getPlayerPhoto(record.playerName, record.photoUrl);
    setEditingRecordId(record.id);
    setRecordForm({
      competitionId: record.competitionId,
      competitionName: record.competitionName,
      playerName: record.playerName,
      club: record.club,
      count: record.count,
      seasonOrYear: record.seasonOrYear || '',
      trophyType: record.trophyType || '',
      notes: record.notes || '',
      photoUrl: pPhoto,
    });
    setIsRecordModalOpen(true);
  };

  // Handle Contender Submit
  const handleSaveContender = (e: React.FormEvent) => {
    e.preventDefault();
    const achList = contenderForm.achievements
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const trophiesList = contenderForm.seasonTrophies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const contenderData: Omit<BallonDorContender, 'id' | 'votes'> = {
      name: contenderForm.name,
      club: contenderForm.club,
      photoUrl: contenderForm.photoUrl,
      position: contenderForm.position,
      seasonStats: {
        matches: Number(contenderForm.matches),
        goals: Number(contenderForm.goals),
        assists: Number(contenderForm.assists),
        rating: Number(contenderForm.rating),
        winRate: Number(contenderForm.winRate),
      },
      achievements: achList,
      seasonTrophies: trophiesList,
    };

    if (editingContenderId) {
      updateContender(editingContenderId, contenderData);
      showSaveNotice(`💾 Ballon d'Or Nominee ${contenderForm.name} updated!`);
    } else {
      addContender(contenderData);
      showSaveNotice(`➕ New Ballon d'Or Season 2 Nominee ${contenderForm.name} added!`);
    }

    setIsContenderModalOpen(false);
    setEditingContenderId(null);
  };

  // Handle Player Profile Submit
  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const achList = playerForm.achievements
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const awardsList = playerForm.awardsWon
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingPlayerId) {
      updatePlayer(editingPlayerId, {
        name: playerForm.name.toUpperCase(),
        displayName: playerForm.displayName || playerForm.name,
        photoUrl: playerForm.photoUrl,
        primaryClub: playerForm.primaryClub,
        preferredPosition: playerForm.preferredPosition,
        overallRating: Number(playerForm.overallRating),
        bio: playerForm.bio,
        achievements: achList,
        awardsWon: awardsList,
        updatedAt: new Date().toISOString(),
      });
      showSaveNotice(`💾 Player profile ${playerForm.name} updated and published live!`);
    } else {
      const newPlayer: PlayerProfile = {
        id: `player-${Date.now()}`,
        name: playerForm.name.toUpperCase(),
        displayName: playerForm.displayName || playerForm.name,
        photoUrl: playerForm.photoUrl,
        primaryClub: playerForm.primaryClub,
        totalTrophies: 1,
        legendStatus: 'EFES Hall of Fame Inductee',
        legendTier: 'HOF_INDUCTEE',
        preferredPosition: playerForm.preferredPosition,
        overallRating: Number(playerForm.overallRating),
        bio: playerForm.bio,
        trophies: [],
        achievements: achList,
        awardsWon: awardsList,
        updatedAt: new Date().toISOString(),
      };
      addPlayer(newPlayer);
      showSaveNotice(`➕ Player profile for ${playerForm.name} created and published live!`);
    }

    setIsPlayerModalOpen(false);
    setEditingPlayerId(null);
  };

  // Handle Event Submit
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      title: eventForm.title,
      type: eventForm.type,
      date: eventForm.date,
      status: eventForm.status,
      description: eventForm.description,
      prizePool: eventForm.prizePool,
      locationOrPlatform: eventForm.locationOrPlatform,
    });
    showSaveNotice(`📅 Event "${eventForm.title}" published!`);
    setIsEventModalOpen(false);
  };

  // Handle News Submit
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNewsId) {
      updateNews(editingNewsId, newsForm);
      showSaveNotice(`📰 News "${newsForm.title}" updated!`);
    } else {
      addNews(newsForm);
      showSaveNotice(`📰 News "${newsForm.title}" published on homepage!`);
    }
    setIsNewsModalOpen(false);
    setEditingNewsId(null);
  };

  // Password Update for single Admin
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }
    const ok = updateAdminPassword(passwordTargetAdmin, newPasswordInput);
    if (ok) {
      setPasswordChangeSuccess(
        `✅ Password for Admin "${passwordTargetAdmin}" successfully updated to "${newPasswordInput}"!`
      );
      setNewPasswordInput('');
      sounds.playGoldenChime();
      setTimeout(() => setPasswordChangeSuccess(null), 4000);
    }
  };

  // Universal Password Update (Apply 1 single password to all admins)
  const handleApplyUniversalPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const pass = universalPasswordInput.trim();
    if (!pass || pass.length < 4) {
      alert('Universal password must be at least 4 characters');
      return;
    }
    const ok = setUniversalAdminPassword(pass);
    if (ok) {
      setUniversalPasswordSuccess(
        `✅ Universal Admin Password successfully set to "${pass}" for all 6 EFES Council Administrators!`
      );
      sounds.playGoldenChime();
      setTimeout(() => setUniversalPasswordSuccess(null), 5000);
    }
  };

  // Quick Row Password Update
  const handleQuickRowPasswordUpdate = (username: string, newPass: string) => {
    if (!newPass || newPass.length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }
    const ok = updateAdminPassword(username, newPass);
    if (ok) {
      setPasswordChangeSuccess(
        `✅ Password for Admin "${username}" updated to "${newPass}"!`
      );
      setEditingAdminPassKey((prev) => ({ ...prev, [username]: '' }));
      sounds.playGoldenChime();
      setTimeout(() => setPasswordChangeSuccess(null), 4000);
    }
  };

  // Filtered records
  const filteredRecords = records.filter(
    (r) =>
      r.playerName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      r.competitionName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      r.club.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast notification */}
      {saveToast && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 p-4 text-black font-extrabold text-xs shadow-2xl animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="h-5 w-5 fill-black text-amber-300" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Admin Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 p-6 md:p-8 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-black uppercase">
                Verified Admin Session
              </span>
              <span className="text-xs text-amber-300 font-semibold">{currentAdmin.role}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black uppercase text-white mt-0.5">
              Welcome, {currentAdmin.name}
            </h1>
            <p className="text-xs text-zinc-400">
              Admin Session Active • 15-Minute Inactivity Auto-Protection Enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentPage('home');
            }}
            className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={() => logoutAdmin('Admin manually signed out from dashboard.')}
            className="rounded-xl border border-red-500/40 bg-red-950/60 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-900/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
        {[
          { id: 'records', label: 'Hall of Fame Winners', icon: Trophy, count: records.length },
          { id: 'photos', label: 'Winner Photos & Gallery', icon: Camera, count: null },
          {
            id: 'ballondor',
            label: "Ballon d'Or Season 2",
            icon: Crown,
            badge: ballonDorState.isVotingOpen ? 'Voting OPEN' : 'Season 2 Ready',
          },
          { id: 'players', label: 'Player Profiles', icon: Users, count: players.length },
          { id: 'events', label: 'Events & Tournaments', icon: Calendar, count: events.length },
          { id: 'news', label: 'Homepage News', icon: Newspaper, count: news.length },
          { id: 'security', label: 'Security & Audit Logs', icon: KeyRound, count: activityLogs.length },
          { id: 'system', label: 'Backup & Database', icon: Download, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isActive ? 'bg-black/30 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="rounded bg-black/40 text-black text-[9px] font-black px-1.5 py-0.5">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* TAB 1: HALL OF FAME WINNERS & RECORDS CRUD                       */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'records' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-black uppercase text-white">
                Hall of Fame Winner Registry
              </h2>
              <p className="text-xs text-zinc-400">
                Add, edit, or delete official competition champions and attach winner photo portraits
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search winner or cup..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setEditingRecordId(null);
                  setRecordForm({
                    competitionId: competitions[0]?.id || 'champions-cup',
                    competitionName: competitions[0]?.name || 'EFES Champions Cup',
                    playerName: '',
                    club: '',
                    count: 1,
                    seasonOrYear: 'Season 2026',
                    trophyType: 'Main Trophy',
                    notes: '',
                    photoUrl: '',
                  });
                  setIsRecordModalOpen(true);
                }}
                className="gold-button flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Winner Record</span>
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Winner Photo</th>
                    <th className="py-3 px-4">Player Name</th>
                    <th className="py-3 px-4">Competition</th>
                    <th className="py-3 px-4">Club</th>
                    <th className="py-3 px-4">Trophies</th>
                    <th className="py-3 px-4">Season</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {filteredRecords.map((r) => {
                    const pPhoto = getPlayerPhoto(r.playerName, r.photoUrl);
                    return (
                      <tr key={r.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="h-10 w-10 overflow-hidden rounded-full border border-amber-500/40 bg-black">
                            <img
                              src={pPhoto}
                              alt={r.playerName}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-white uppercase">{r.playerName}</td>
                        <td className="py-3 px-4 text-amber-300">{r.competitionName}</td>
                        <td className="py-3 px-4 text-zinc-300">{r.club}</td>
                        <td className="py-3 px-4">
                          <span className="rounded bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 font-bold text-amber-300">
                            {r.count}x
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-400">{r.seasonOrYear}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditRecord(r)}
                              className="rounded-lg bg-zinc-800 p-1.5 text-zinc-300 hover:text-amber-300 hover:bg-zinc-700 transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete ${r.playerName}'s record for ${r.competitionName}?`
                                  )
                                ) {
                                  deleteRecord(r.id);
                                  showSaveNotice(`🗑️ Deleted record for ${r.playerName}`);
                                }
                              }}
                              className="rounded-lg bg-red-950/60 border border-red-500/30 p-1.5 text-red-300 hover:bg-red-900 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 2: WINNER PHOTOS & DIRECT GALLERY UPLOAD                     */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'photos' && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-black uppercase text-white">
              Winner Portrait Photo Management
            </h2>
            <p className="text-xs text-zinc-400">
              Upload player portraits directly from local files, device storage, or direct URLs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-amber-500/50">
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-black uppercase text-white">{p.name}</h4>
                    <p className="text-xs text-amber-400">{p.primaryClub}</p>
                    <span className="text-[10px] text-zinc-400">{p.totalTrophies} Total Trophies</span>
                  </div>
                </div>

                <PhotoUploader
                  currentPhotoUrl={p.photoUrl}
                  onPhotoSelected={(newUrl) => {
                    uploadWinnerPhoto(p.name, newUrl);
                    showSaveNotice(`📸 Updated photo portrait for ${p.name}!`);
                  }}
                  playerName={p.name}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 3: BALLON D'OR SEASON 2 MANAGER                              */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'ballondor' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 p-6">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h2 className="font-display text-2xl font-black uppercase text-white">
                  Ballon d&apos;Or Season 2 Controls
                </h2>
              </div>
              <p className="text-xs text-amber-200/80 mt-1">
                Configure Season 2 nominees, toggle public ballot voting, and announce official winner
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  updateBallonDorState({ isVotingOpen: !ballonDorState.isVotingOpen });
                  showSaveNotice(
                    ballonDorState.isVotingOpen ? '🔒 Voting Closed' : '🔓 Public Voting Opened!'
                  );
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                  ballonDorState.isVotingOpen
                    ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                }`}
              >
                {ballonDorState.isVotingOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{ballonDorState.isVotingOpen ? 'Close Voting' : 'Open Voting'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setEditingContenderId(null);
                  setContenderForm({
                    name: '',
                    club: '',
                    photoUrl:
                      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
                    position: 'CF / SS',
                    goals: 15,
                    assists: 9,
                    matches: 18,
                    rating: 9.4,
                    winRate: 88,
                    achievements: 'EFES Champions Cup Winner, Season Top Scorer',
                    seasonTrophies: 'Champions Cup S2',
                  });
                  setIsContenderModalOpen(true);
                }}
                className="gold-button flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Season 2 Nominee</span>
              </button>
            </div>
          </div>

          {/* Current Contenders List */}
          {contenders.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-zinc-800 p-12 text-center text-zinc-400 space-y-4">
              <Crown className="mx-auto h-12 w-12 text-zinc-600" />
              <p className="text-base font-bold text-white">No Season 2 Nominees Added Yet</p>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                The public page currently displays &ldquo;Voting has not started yet&rdquo;. Click the button
                above to add your first Season 2 contender nominees.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contenders.map((c) => {
                const isCrownedWinner = ballonDorState.winnerContenderId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`rounded-3xl border p-5 shadow-xl space-y-4 ${
                      isCrownedWinner
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                        : 'border-zinc-800 bg-zinc-950'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl border border-amber-500/40">
                        <img
                          src={c.photoUrl}
                          alt={c.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-black uppercase text-white">{c.name}</h4>
                        <p className="text-xs text-amber-400">{c.club}</p>
                        <span className="text-[10px] text-zinc-400 font-bold">{c.votes} Votes Cast</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                      <button
                        onClick={() => setBallonDorWinner(c.id)}
                        className={`flex-1 rounded-xl py-2 text-xs font-black transition-all cursor-pointer ${
                          isCrownedWinner
                            ? 'bg-amber-400 text-black'
                            : 'bg-zinc-800 text-amber-300 hover:bg-amber-500/20'
                        }`}
                      >
                        {isCrownedWinner ? '👑 Crowned Winner' : 'Announce Winner'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete contender ${c.name}?`)) {
                            deleteContender(c.id);
                            showSaveNotice(`Deleted contender ${c.name}`);
                          }
                        }}
                        className="rounded-xl bg-red-950/60 border border-red-500/30 p-2 text-red-300 hover:bg-red-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 4: PLAYER PROFILES                                           */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'players' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-black uppercase text-white">Player Profiles</h2>
              <p className="text-xs text-zinc-400">
                Manage legend biographies, overall ratings, preferred positions, and trophies
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setEditingPlayerId(null);
                setPlayerForm({
                  name: '',
                  displayName: '',
                  photoUrl:
                    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
                  primaryClub: '',
                  preferredPosition: 'CF',
                  overallRating: 92,
                  bio: '',
                  achievements: 'EFES Hall of Fame Inductee',
                  awardsWon: 'Golden Boot',
                });
                setIsPlayerModalOpen(true);
              }}
              className="gold-button flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Player Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl border border-amber-500/40">
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-black uppercase text-white">{p.name}</h4>
                    <p className="text-xs text-amber-400">{p.primaryClub}</p>
                    <span className="text-[10px] text-zinc-400">{p.legendStatus}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPlayerId(p.id);
                      setPlayerForm({
                        name: p.name,
                        displayName: p.displayName || p.name,
                        photoUrl: p.photoUrl,
                        primaryClub: p.primaryClub,
                        preferredPosition: p.preferredPosition || 'CF',
                        overallRating: p.overallRating || 90,
                        bio: p.bio || '',
                        achievements: (p.achievements || []).join(', '),
                        awardsWon: (p.awardsWon || []).join(', '),
                      });
                      setIsPlayerModalOpen(true);
                    }}
                    className="rounded-lg bg-zinc-800 p-2 text-zinc-300 hover:text-amber-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete player ${p.name}?`)) {
                        deletePlayer(p.id);
                        showSaveNotice(`Deleted player ${p.name}`);
                      }
                    }}
                    className="rounded-lg bg-red-950/60 border border-red-500/30 p-2 text-red-300 hover:bg-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 5: EVENTS & TOURNAMENTS                                      */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'events' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-black uppercase text-white">
                Events & Tournaments
              </h2>
              <p className="text-xs text-zinc-400">
                Publish upcoming tournaments, registration dates, and prize pools
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsEventModalOpen(true);
              }}
              className="gold-button flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-300">
                    {ev.type}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete event "${ev.title}"?`)) {
                        deleteEvent(ev.id);
                        showSaveNotice(`Deleted event "${ev.title}"`);
                      }
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-display text-xl font-black uppercase text-white">{ev.title}</h4>
                <p className="text-xs text-zinc-400">{ev.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-300">
                  <span>📅 {ev.date}</span>
                  <span className="font-bold text-amber-400">🏆 {ev.prizePool || 'Glory & Trophy'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 6: HOMEPAGE NEWS & BROADCASTS                                */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'news' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-black uppercase text-white">
                Homepage Announcements & News
              </h2>
              <p className="text-xs text-zinc-400">
                Edit the live broadcast articles displayed on the EFES public home page
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setEditingNewsId(null);
                setNewsForm({
                  title: '',
                  category: 'HALL_OF_FAME',
                  date: 'Just Now',
                  summary: '',
                  imageUrl:
                    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
                  isFeatured: true,
                });
                setIsNewsModalOpen(true);
              }}
              className="gold-button flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Announcement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingNewsId(item.id);
                        setNewsForm({
                          title: item.title,
                          category: item.category,
                          date: item.date,
                          summary: item.summary,
                          imageUrl: item.imageUrl,
                          isFeatured: item.isFeatured || false,
                        });
                        setIsNewsModalOpen(true);
                      }}
                      className="text-zinc-400 hover:text-amber-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete news "${item.title}"?`)) {
                          deleteNews(item.id);
                          showSaveNotice(`Deleted news article`);
                        }
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-display text-lg font-black uppercase text-white">{item.title}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.summary}</p>
                <span className="text-[10px] text-zinc-500 block">Published: {item.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 7: SECURITY AUDIT LOGS & ADMIN PASSWORD MANAGER             */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <section className="space-y-8">
          {/* 1. UNIVERSAL ADMIN PASSWORD (ALL ADMINS) */}
          <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-zinc-950 to-amber-950/40 p-6 md:p-8 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <KeyRound className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-black uppercase text-white">
                    Universal Admin Password Control
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Set a single shared password for all 6 approved EFES administrators at once (e.g. <span className="font-mono text-amber-300 font-bold">246824</span>)
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                Active Default: 246824
              </span>
            </div>

            {universalPasswordSuccess && (
              <div className="rounded-xl bg-emerald-950/90 border border-emerald-500/80 p-3.5 text-xs text-emerald-200 shadow flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{universalPasswordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleApplyUniversalPassword} className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase text-zinc-300 mb-1">
                  New Universal Password For All Admins
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={universalPasswordInput}
                    onChange={(e) => setUniversalPasswordInput(e.target.value)}
                    placeholder="Enter password (e.g. 246824)"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 pl-10 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-400" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="gold-button w-full sm:w-auto px-6 py-2.5 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <Shield className="w-4 h-4" />
                  <span>Apply to All 6 Council Admins</span>
                </button>
              </div>
            </form>
          </div>

          {/* 2. APPROVED EFES COUNCIL ADMIN DIRECTORY & PASSWORDS */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-display text-xl font-black uppercase text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  <span>Approved EFES Council Administrators ({authorizedAdminsList.length})</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Authorized accounts with permission to access the EFES Admin Dashboard
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAdminPasswordsTable(!showAdminPasswordsTable)}
                className="self-start sm:self-auto rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                {showAdminPasswordsTable ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hide Passwords</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reveal Passwords</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 uppercase font-black text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Admin Name</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Active Password</th>
                    <th className="py-3 px-4 text-right">Quick Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {authorizedAdminsList.map((adm) => {
                    const rowPass = editingAdminPassKey[adm.username] ?? '';
                    return (
                      <tr key={adm.username} className="hover:bg-zinc-900/40">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">
                            {adm.name.charAt(0)}
                          </div>
                          <span>{adm.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{adm.username}</td>
                        <td className="py-3 px-4 text-zinc-400">{adm.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`rounded px-2 py-0.5 text-[9px] font-black uppercase ${
                              adm.role === 'SUPER_ADMIN'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {adm.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">
                          {showAdminPasswordsTable ? (
                            <span>{adm.password || '246824'}</span>
                          ) : (
                            <span>••••••••</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="New pass"
                              value={rowPass}
                              onChange={(e) =>
                                setEditingAdminPassKey((prev) => ({
                                  ...prev,
                                  [adm.username]: e.target.value,
                                }))
                              }
                              className="w-24 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] text-white font-mono placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuickRowPasswordUpdate(adm.username, rowPass)}
                              disabled={!rowPass || rowPass.length < 4}
                              className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition-colors disabled:opacity-30 cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. INDIVIDUAL ACCOUNT PASSWORD CUSTOMIZER */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h3 className="font-display text-xl font-black uppercase text-white">
                Individual Admin Password Customizer
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Update authentication credentials for a specific administrator account
            </p>

            {passwordChangeSuccess && (
              <div className="rounded-xl bg-emerald-950/80 border border-emerald-500/80 p-3 text-xs text-emerald-200">
                {passwordChangeSuccess}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                  Select Admin Account
                </label>
                <select
                  value={passwordTargetAdmin}
                  onChange={(e) => setPasswordTargetAdmin(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-white"
                >
                  {authorizedAdminsList.map((adm) => (
                    <option key={adm.username} value={adm.username}>
                      {adm.name} ({adm.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                  New Password (min 4 chars)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 246824"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="gold-button w-full rounded-xl py-2.5 text-xs font-black cursor-pointer shadow"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>

          {/* Activity Logs Table */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-display text-xl font-black uppercase text-white">
                    Login Activity & Security Audit Logs
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Real-time tracking of authenticated logins, access denials, and database mutations
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Clear all security logs?')) {
                    clearActivityLogs();
                    showSaveNotice('Cleared activity logs.');
                  }
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-red-400 transition-colors"
              >
                Clear Log History
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 uppercase font-black text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Admin / User</th>
                    <th className="py-3 px-4">Event Action</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-900/40">
                      <td className="py-2.5 px-4 text-zinc-400">
                        {new Date(log.timestamp).toLocaleTimeString()} (
                        {new Date(log.timestamp).toLocaleDateString()})
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white">{log.username}</td>
                      <td className="py-2.5 px-4 text-amber-300 font-semibold">{log.action}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[9px] font-black uppercase ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : log.status === 'DENIED'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-zinc-300 max-w-xs truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 8: BACKUP, EXPORT & RESTORE                                  */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'system' && (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="font-display text-2xl font-black uppercase text-white">
              Database Export & Backup
            </h2>
            <p className="text-xs text-zinc-400">
              Download complete snapshots of EFES records, players, Ballon d&apos;Or state, and activity logs
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                const jsonStr = exportDatabaseJson();
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `efes-hall-of-fame-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                showSaveNotice('📥 Database JSON Backup Downloaded!');
              }}
              className="gold-button flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black cursor-pointer shadow"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Database Backup</span>
            </button>

            <button
              onClick={() => {
                if (
                  confirm(
                    'Reset entire database to official EFES defaults? This will restore original Hall of Fame records and Season 2 state.'
                  )
                ) {
                  resetToDefaultData();
                  showSaveNotice('🔄 Database reset to official factory defaults.');
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-950/50 px-5 py-3 text-xs font-bold text-red-300 hover:bg-red-900 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Database to Official Defaults</span>
            </button>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT HALL OF FAME RECORD                            */}
      {/* ---------------------------------------------------------------- */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-zinc-950 shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0 bg-zinc-950">
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white">
                {editingRecordId ? 'Edit Winner Record' : 'Register Hall of Fame Winner'}
              </h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Player Name (Gamer Tag)</label>
                  <input
                    type="text"
                    placeholder="e.g. KOSIKOSI"
                    value={recordForm.playerName}
                    onChange={(e) => setRecordForm({ ...recordForm, playerName: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Competition / Cup</label>
                    <select
                      value={recordForm.competitionId}
                      onChange={(e) => {
                        const comp = competitions.find((c) => c.id === e.target.value);
                        setRecordForm({
                          ...recordForm,
                          competitionId: e.target.value,
                          competitionName: comp ? comp.name : recordForm.competitionName,
                        });
                      }}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    >
                      {competitions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Club / Clan</label>
                    <input
                      type="text"
                      placeholder="e.g. Real Madrid / EFES Elite"
                      value={recordForm.club}
                      onChange={(e) => setRecordForm({ ...recordForm, club: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Trophy Count</label>
                    <input
                      type="number"
                      min="1"
                      value={recordForm.count}
                      onChange={(e) =>
                        setRecordForm({ ...recordForm, count: Math.max(1, parseInt(e.target.value) || 1) })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Season / Era</label>
                    <input
                      type="text"
                      value={recordForm.seasonOrYear}
                      onChange={(e) => setRecordForm({ ...recordForm, seasonOrYear: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Winner Photo Upload in Form */}
                <div className="pt-2">
                  <label className="block font-bold text-zinc-300 mb-2">Winner Photo Portrait</label>
                  <PhotoUploader
                    currentPhotoUrl={recordForm.photoUrl}
                    onPhotoSelected={(url) => setRecordForm({ ...recordForm, photoUrl: url })}
                    playerName={recordForm.playerName || 'Winner'}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 p-4 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button rounded-xl px-5 py-2.5 font-black text-black cursor-pointer text-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT BALLON D'OR CONTENDER                          */}
      {/* ---------------------------------------------------------------- */}
      {isContenderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-zinc-950 shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0 bg-zinc-950">
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white">
                {editingContenderId ? 'Edit Ballon d\'Or Contender' : 'Add Ballon d\'Or Season 2 Nominee'}
              </h3>
              <button
                onClick={() => setIsContenderModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContender} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Player Name</label>
                    <input
                      type="text"
                      placeholder="e.g. KOSIKOSI"
                      value={contenderForm.name}
                      onChange={(e) => setContenderForm({ ...contenderForm, name: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Club</label>
                    <input
                      type="text"
                      placeholder="e.g. Manchester City"
                      value={contenderForm.club}
                      onChange={(e) => setContenderForm({ ...contenderForm, club: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Goals</label>
                    <input
                      type="number"
                      value={contenderForm.goals}
                      onChange={(e) =>
                        setContenderForm({ ...contenderForm, goals: parseInt(e.target.value) || 0 })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Assists</label>
                    <input
                      type="number"
                      value={contenderForm.assists}
                      onChange={(e) =>
                        setContenderForm({ ...contenderForm, assists: parseInt(e.target.value) || 0 })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Rating ★</label>
                    <input
                      type="number"
                      step="0.1"
                      value={contenderForm.rating}
                      onChange={(e) =>
                        setContenderForm({ ...contenderForm, rating: parseFloat(e.target.value) || 9.0 })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">
                    Season Accolades (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Champions Cup Winner, Best Player"
                    value={contenderForm.achievements}
                    onChange={(e) => setContenderForm({ ...contenderForm, achievements: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-2">Contender Portrait Photo</label>
                  <PhotoUploader
                    currentPhotoUrl={contenderForm.photoUrl}
                    onPhotoSelected={(url) => setContenderForm({ ...contenderForm, photoUrl: url })}
                    playerName={contenderForm.name || 'Nominee'}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 p-4 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setIsContenderModalOpen(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button rounded-xl px-5 py-2.5 font-black text-black cursor-pointer text-xs"
                >
                  Save Nominee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL: PLAYER PROFILE                                            */}
      {/* ---------------------------------------------------------------- */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-zinc-950 shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0 bg-zinc-950">
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white">
                {editingPlayerId ? 'Edit Player Profile' : 'Add Player Profile'}
              </h3>
              <button
                onClick={() => setIsPlayerModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlayer} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Player Tag</label>
                    <input
                      type="text"
                      value={playerForm.name}
                      onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Club</label>
                    <input
                      type="text"
                      value={playerForm.primaryClub}
                      onChange={(e) => setPlayerForm({ ...playerForm, primaryClub: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-2">Player Photo</label>
                  <PhotoUploader
                    currentPhotoUrl={playerForm.photoUrl}
                    onPhotoSelected={(url) => setPlayerForm({ ...playerForm, photoUrl: url })}
                    playerName={playerForm.name || 'Player'}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 p-4 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPlayerModalOpen(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button rounded-xl px-5 py-2.5 font-black text-black cursor-pointer text-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL: EVENT                                                     */}
      {/* ---------------------------------------------------------------- */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-zinc-950 shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0 bg-zinc-950">
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white">
                Create Event / Tournament
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g. EFES Premier Championship Season 2"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Date</label>
                    <input
                      type="text"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1">Prize Pool</label>
                    <input
                      type="text"
                      value={eventForm.prizePool}
                      onChange={(e) => setEventForm({ ...eventForm, prizePool: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 p-4 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button rounded-xl px-5 py-2.5 font-black text-black cursor-pointer text-xs"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL: NEWS ANNOUNCEMENT                                         */}
      {/* ---------------------------------------------------------------- */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-zinc-950 shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 shrink-0 bg-zinc-950">
              <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white">
                {editingNewsId ? 'Edit News Article' : 'Publish Homepage Announcement'}
              </h3>
              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Headline / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Official Ballon d'Or Season 2 Announced"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Summary / Body</label>
                  <textarea
                    rows={3}
                    value={newsForm.summary}
                    onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    value={newsForm.imageUrl}
                    onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 p-4 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button rounded-xl px-5 py-2.5 font-black text-black cursor-pointer text-xs"
                >
                  Publish News
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
