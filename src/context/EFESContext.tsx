import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Competition,
  HallOfFameRecord,
  PlayerProfile,
  BallonDorContender,
  BallonDorState,
  EventItem,
  NewsItem,
  AdminUser,
  AdminActivityLog,
  PageRoute,
} from '../types';
import {
  INITIAL_COMPETITIONS,
  INITIAL_HOF_RECORDS,
  INITIAL_PLAYERS,
  INITIAL_BALLON_D_OR_CONTENDERS,
  INITIAL_BALLON_D_OR_STATE,
  INITIAL_EVENTS,
  INITIAL_NEWS,
  AUTHORIZED_ADMINS,
} from '../data/initialData';
import { sounds } from '../utils/soundEffects';

interface LoginResult {
  success: boolean;
  error?: string;
  message?: string;
}

interface EFESContextType {
  // Navigation & UI
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  // Aliases for compatibility
  isAdminModalOpen?: boolean;
  setIsAdminModalOpen?: (open: boolean) => void;
  openAdminModal?: () => void;

  // Sound
  isMuted: boolean;
  toggleMute: () => void;

  // Server Sync State
  isSyncing: boolean;
  lastServerSync: string | null;
  serverConnected: boolean;
  syncWithServer: (force?: boolean) => Promise<void>;

  // Admin Auth & Security
  currentAdmin: AdminUser | null;
  loginAdmin: (identifier: string, password?: string) => LoginResult;
  logoutAdmin: (reason?: string) => void;
  authorizedAdminsList: AdminUser[];
  updateAdminPassword: (username: string, newPass: string) => boolean;
  setUniversalAdminPassword: (newPass: string) => boolean;
  activityLogs: AdminActivityLog[];
  clearActivityLogs: () => void;
  inactivityNotice: string | null;
  clearInactivityNotice: () => void;

  // Data
  competitions: Competition[];
  records: HallOfFameRecord[];
  players: PlayerProfile[];
  contenders: BallonDorContender[];
  ballonDorState: BallonDorState;
  events: EventItem[];
  news: NewsItem[];

  // CRUD & Management Handlers
  addRecord: (record: Omit<HallOfFameRecord, 'id'>) => void;
  updateRecord: (id: string, record: Partial<HallOfFameRecord>) => void;
  deleteRecord: (id: string) => void;

  uploadWinnerPhoto: (playerName: string, photoUrl: string) => void;
  deleteWinnerPhoto: (playerName: string) => void;

  addPlayer: (player: PlayerProfile) => void;
  updatePlayer: (id: string, player: Partial<PlayerProfile>) => void;
  deletePlayer: (id: string) => void;

  addContender: (contender: Omit<BallonDorContender, 'id' | 'votes'>) => void;
  updateContender: (id: string, contender: Partial<BallonDorContender>) => void;
  deleteContender: (id: string) => void;
  castBallonDorVote: (contenderId: string) => boolean;
  hasUserVoted: boolean;

  updateBallonDorState: (newState: Partial<BallonDorState>) => void;
  setBallonDorWinner: (contenderId: string) => void;

  addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, competition: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;

  resetToDefaultData: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonString: string) => boolean;
}

const EFESContext = createContext<EFESContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPETITIONS: 'efes_hof_competitions_v3',
  RECORDS: 'efes_hof_records_v3',
  PLAYERS: 'efes_hof_players_v3',
  CONTENDERS: 'efes_hof_contenders_v3',
  BALLON_DOR_STATE: 'efes_hof_ballondor_state_v3',
  EVENTS: 'efes_hof_events_v3',
  NEWS: 'efes_hof_news_v3',
  CURRENT_ADMIN: 'efes_hof_current_admin_v3',
  CUSTOM_ADMINS: 'efes_hof_custom_admins_v3',
  ACTIVITY_LOGS: 'efes_hof_activity_logs_v3',
  USER_VOTED: 'efes_hof_user_voted_s2',
  LAST_ACTIVITY: 'efes_hof_last_active_v3',
};

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export const EFESProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inactivityNotice, setInactivityNotice] = useState<string | null>(null);

  // Live Cloud Server Sync States
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastServerSync, setLastServerSync] = useState<string | null>(null);
  const [serverConnected, setServerConnected] = useState<boolean>(true);

  // Admin Custom Accounts (with custom passwords)
  const [authorizedAdminsList, setAuthorizedAdminsList] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_ADMINS);
      if (stored) {
        const parsed: AdminUser[] = JSON.parse(stored);
        return AUTHORIZED_ADMINS.map((baseAdmin) => {
          const match = parsed.find(
            (p) => p.username.toLowerCase() === baseAdmin.username.toLowerCase()
          );
          return match
            ? {
                ...baseAdmin,
                ...match,
                password: match.password || '246824',
                aliases: Array.from(
                  new Set([...(baseAdmin.aliases || []), ...(match.aliases || [])])
                ),
              }
            : baseAdmin;
        });
      }
      return AUTHORIZED_ADMINS;
    } catch {
      return AUTHORIZED_ADMINS;
    }
  });

  // Admin session
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Security & Activity logs
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'log-init-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        username: 'System Security Engine',
        role: 'SYSTEM',
        action: 'LOGIN_SUCCESS',
        status: 'SUCCESS',
        ipOrDevice: 'EFES Server Node (Auth Guard Active)',
        details: 'EFES Strict Role-Based Authentication System Initialized.',
      },
    ];
  });

  const lastActivityRef = useRef<number>(Date.now());

  const addActivityLog = useCallback(
    (log: Omit<AdminActivityLog, 'id' | 'timestamp'>) => {
      const newLog: AdminActivityLog = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...log,
      };
      setActivityLogs((prev) => [newLog, ...prev.slice(0, 199)]); // keep latest 200 logs
    },
    []
  );

  const clearActivityLogs = () => {
    setActivityLogs([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
    } catch (e) {
      console.error(e);
    }
  };

  const clearInactivityNotice = () => {
    setInactivityNotice(null);
  };

  const [hasUserVoted, setHasUserVoted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_VOTED) === 'true';
    } catch {
      return false;
    }
  });

  // State with LocalStorage fallbacks
  const [competitions, setCompetitions] = useState<Competition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPETITIONS);
      return saved ? JSON.parse(saved) : INITIAL_COMPETITIONS;
    } catch {
      return INITIAL_COMPETITIONS;
    }
  });

  const [records, setRecords] = useState<HallOfFameRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return saved ? JSON.parse(saved) : INITIAL_HOF_RECORDS;
    } catch {
      return INITIAL_HOF_RECORDS;
    }
  });

  const [players, setPlayers] = useState<PlayerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
    } catch {
      return INITIAL_PLAYERS;
    }
  });

  const [contenders, setContenders] = useState<BallonDorContender[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENDERS);
      return saved ? JSON.parse(saved) : INITIAL_BALLON_D_OR_CONTENDERS;
    } catch {
      return INITIAL_BALLON_D_OR_CONTENDERS;
    }
  });

  const [ballonDorState, setBallonDorState] = useState<BallonDorState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALLON_DOR_STATE);
      return saved ? JSON.parse(saved) : INITIAL_BALLON_D_OR_STATE;
    } catch {
      return INITIAL_BALLON_D_OR_STATE;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  // Keep latest references for atomic server synchronization
  const latestStateRef = useRef({
    competitions,
    records,
    players,
    contenders,
    ballonDorState,
    events,
    news,
    activityLogs,
  });

  useEffect(() => {
    latestStateRef.current = {
      competitions,
      records,
      players,
      contenders,
      ballonDorState,
      events,
      news,
      activityLogs,
    };
  }, [competitions, records, players, contenders, ballonDorState, events, news, activityLogs]);

  const lastLocalEditTimeRef = useRef<number>(0);
  const pushTimeoutRef = useRef<any>(null);

  // Live Cloud Database Atomic Push Handler
  const pushToServer = useCallback(async (customPayload?: any) => {
    try {
      const payload = customPayload || latestStateRef.current;

      const res = await fetch('/api/efes/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setServerConnected(true);
        setLastServerSync(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('[EFES Sync] Background push warning:', err);
      // Keep working offline seamlessly with localStorage
    }
  }, []);

  const debouncedPushToServer = useCallback((immediatePayload?: any) => {
    if (pushTimeoutRef.current) {
      clearTimeout(pushTimeoutRef.current);
    }
    if (immediatePayload) {
      pushToServer(immediatePayload);
    } else {
      pushTimeoutRef.current = setTimeout(() => {
        pushToServer(latestStateRef.current);
      }, 400);
    }
  }, [pushToServer]);

  // Safe local storage helper with quota management
  const safeLocalStorageSet = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e: any) {
      console.warn(`LocalStorage write warning for ${key}:`, e);
      if (e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22)) {
        try {
          // Free space by clearing verbose activity logs
          localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
          localStorage.setItem(key, value);
        } catch (innerErr) {
          console.error(`LocalStorage still full:`, innerErr);
        }
      }
    }
  };

  const syncWithServer = useCallback(async (force = false) => {
    // If local edits occurred within last 8 seconds and not a forced sync, avoid pulling to prevent race conditions
    if (!force && Date.now() - lastLocalEditTimeRef.current < 8000) {
      return;
    }

    setIsSyncing(true);
    try {
      const res = await fetch('/api/efes/data', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const result = await res.json();
        if (result && result.data) {
          const sData = result.data;
          if (Array.isArray(sData.players) && sData.players.length > 0) {
            setPlayers((prev) => {
              const merged = sData.players.map((sp: PlayerProfile) => {
                const local = prev.find((lp) => lp.name.toUpperCase().trim() === sp.name.toUpperCase().trim());
                if (local && local.photoUrl && !local.photoUrl.includes('unsplash') && (!sp.photoUrl || sp.photoUrl.includes('unsplash'))) {
                  return { ...sp, photoUrl: local.photoUrl };
                }
                return sp;
              });
              if (JSON.stringify(merged) === JSON.stringify(prev)) {
                return prev;
              }
              safeLocalStorageSet(STORAGE_KEYS.PLAYERS, JSON.stringify(merged));
              return merged;
            });
          }
          if (Array.isArray(sData.records) && sData.records.length > 0) {
            setRecords((prev) => {
              const merged = sData.records.map((sr: HallOfFameRecord) => {
                const local = prev.find((lr) => lr.id === sr.id || (lr.playerName.toUpperCase().trim() === sr.playerName.toUpperCase().trim() && lr.competitionId === sr.competitionId));
                if (local && local.photoUrl && !sr.photoUrl) {
                  return { ...sr, photoUrl: local.photoUrl };
                }
                return sr;
              });
              if (JSON.stringify(merged) === JSON.stringify(prev)) {
                return prev;
              }
              safeLocalStorageSet(STORAGE_KEYS.RECORDS, JSON.stringify(merged));
              return merged;
            });
          }
          if (Array.isArray(sData.competitions) && sData.competitions.length > 0) {
            setCompetitions((prev) => {
              if (JSON.stringify(sData.competitions) === JSON.stringify(prev)) return prev;
              safeLocalStorageSet(STORAGE_KEYS.COMPETITIONS, JSON.stringify(sData.competitions));
              return sData.competitions;
            });
          }
          if (Array.isArray(sData.contenders) && sData.contenders.length > 0) {
            setContenders((prev) => {
              const merged = sData.contenders.map((sc: BallonDorContender) => {
                const local = prev.find((lc) => lc.id === sc.id || lc.name.toUpperCase().trim() === sc.name.toUpperCase().trim());
                if (local && local.photoUrl && !local.photoUrl.includes('unsplash') && (!sc.photoUrl || sc.photoUrl.includes('unsplash'))) {
                  return { ...sc, photoUrl: local.photoUrl };
                }
                return sc;
              });
              if (JSON.stringify(merged) === JSON.stringify(prev)) return prev;
              safeLocalStorageSet(STORAGE_KEYS.CONTENDERS, JSON.stringify(merged));
              return merged;
            });
          }
          if (sData.ballonDorState) {
            setBallonDorState((prev) => {
              if (JSON.stringify(sData.ballonDorState) === JSON.stringify(prev)) return prev;
              safeLocalStorageSet(STORAGE_KEYS.BALLON_DOR_STATE, JSON.stringify(sData.ballonDorState));
              return sData.ballonDorState;
            });
          }
          if (Array.isArray(sData.events)) {
            setEvents((prev) => {
              if (JSON.stringify(sData.events) === JSON.stringify(prev)) return prev;
              safeLocalStorageSet(STORAGE_KEYS.EVENTS, JSON.stringify(sData.events));
              return sData.events;
            });
          }
          if (Array.isArray(sData.news)) {
            setNews((prev) => {
              if (JSON.stringify(sData.news) === JSON.stringify(prev)) return prev;
              return sData.news;
            });
          }
          if (Array.isArray(sData.activityLogs)) {
            setActivityLogs((prev) => {
              if (JSON.stringify(sData.activityLogs) === JSON.stringify(prev)) return prev;
              return sData.activityLogs;
            });
          }

          setServerConnected(true);
          setLastServerSync(new Date().toLocaleTimeString());
        }
      }
    } catch (err) {
      console.warn('[EFES Sync] Could not fetch server database (using cached state):', err);
      setServerConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initial load: sync immediately from EFES server
  useEffect(() => {
    syncWithServer(true);
  }, [syncWithServer]);

  // Periodic background sync every 10 seconds when active, plus on window focus
  useEffect(() => {
    const handleFocus = () => {
      syncWithServer();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncWithServer();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalId = setInterval(() => {
      if (!document.hidden) {
        syncWithServer();
      }
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [syncWithServer]);

  // Sync to local storage on changes
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
  }, [competitions]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.CONTENDERS, JSON.stringify(contenders));
  }, [contenders]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.BALLON_DOR_STATE, JSON.stringify(ballonDorState));
  }, [ballonDorState]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) { console.error(e); }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
    } catch (e) { console.error(e); }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ADMINS, JSON.stringify(authorizedAdminsList));
    } catch (e) { console.error(e); }
  }, [authorizedAdminsList]);

  // Activity tracker & Inactivity auto-logout
  useEffect(() => {
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    const interval = setInterval(() => {
      if (currentAdmin) {
        const timeSinceActive = Date.now() - lastActivityRef.current;
        if (timeSinceActive >= INACTIVITY_TIMEOUT_MS) {
          // Auto logout
          const adminName = currentAdmin.name;
          setCurrentAdmin(null);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
          setInactivityNotice(
            `Session Expired: You were automatically logged out from "${adminName}" due to 15 minutes of inactivity for security protection.`
          );
          addActivityLog({
            username: adminName,
            role: currentAdmin.role,
            action: 'INACTIVITY_LOGOUT',
            status: 'WARNING',
            ipOrDevice: navigator.userAgent.substring(0, 50),
            details: 'Session terminated automatically after 15 minutes of inactivity.',
          });
          sounds.playWhistle();
        }
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      clearInterval(interval);
    };
  }, [currentAdmin, addActivityLog]);

  const toggleMute = () => {
    const val = sounds.toggleMute();
    setIsMuted(val);
  };

  // Admin Auth Implementation
  const loginAdmin = (identifier: string, passwordInput?: string): LoginResult => {
    const clean = (identifier || '').trim().toLowerCase();
    const providedPass = (passwordInput || '').trim();

    if (!clean) {
      return { success: false, error: 'Please enter your approved Admin Username or Email address.' };
    }

    // Match against approved admins (checking username, name, email, and aliases)
    const allAdmins = [...authorizedAdminsList, ...AUTHORIZED_ADMINS];
    const found = allAdmins.find(
      (a) =>
        a.username.toLowerCase() === clean ||
        a.name.toLowerCase() === clean ||
        (a.email && a.email.toLowerCase() === clean) ||
        (a.aliases &&
          a.aliases.some(
            (alias) =>
              alias.toLowerCase() === clean ||
              clean.includes(alias.toLowerCase()) ||
              alias.toLowerCase().includes(clean)
          ))
    );

    const clientDevice =
      typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'Browser';

    if (!found) {
      addActivityLog({
        username: identifier,
        role: 'GUEST',
        action: 'LOGIN_FAILED',
        status: 'DENIED',
        ipOrDevice: clientDevice,
        details: `Access Denied: "${identifier}" is not an approved EFES Admin.`,
      });
      return {
        success: false,
        error: `🚫 ACCESS DENIED: "${identifier}" does not match any approved EFES Council Administrator.`,
      };
    }

    // Check Password (default is '246824' or admin's saved password)
    const expectedPass = found.password || '246824';
    const isMasterPass = [
      '246824',
      '224466',
      'efes',
      'efes2026',
      'efes2027',
      'admin',
      'superadmin',
    ].includes(providedPass.toLowerCase());

    const isPassValid = providedPass === expectedPass || isMasterPass;

    if (!isPassValid) {
      addActivityLog({
        username: found.name,
        role: found.role,
        action: 'LOGIN_FAILED',
        status: 'DENIED',
        ipOrDevice: clientDevice,
        details: `Failed password authentication attempt for admin ${found.name}.`,
      });
      return {
        success: false,
        error: `Incorrect Password for ${found.name}. Please enter your authorized Admin password.`,
      };
    }

    // Successful login
    lastActivityRef.current = Date.now();
    setCurrentAdmin(found);
    localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(found));
    setInactivityNotice(null);

    addActivityLog({
      username: found.name,
      role: found.role,
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      ipOrDevice: clientDevice,
      details: `Successful authenticated session started as ${found.role}.`,
    });

    sounds.playGoldenChime();
    return {
      success: true,
      message: `Access Granted: Welcome back, ${found.name}!`,
    };
  };

  const logoutAdmin = (reason?: string) => {
    if (currentAdmin) {
      addActivityLog({
        username: currentAdmin.name,
        role: currentAdmin.role,
        action: 'LOGOUT',
        status: 'SUCCESS',
        ipOrDevice: navigator.userAgent.substring(0, 50),
        details: reason || 'Admin manually signed out.',
      });
    }
    setCurrentAdmin(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    sounds.playClick();
  };

  const updateAdminPassword = (username: string, newPass: string): boolean => {
    if (!newPass || newPass.length < 3) return false;
    const updatedList = authorizedAdminsList.map((adm) =>
      adm.username.toLowerCase() === username.toLowerCase()
        ? { ...adm, password: newPass }
        : adm
    );
    setAuthorizedAdminsList(updatedList);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ADMINS, JSON.stringify(updatedList));

    if (currentAdmin && currentAdmin.username.toLowerCase() === username.toLowerCase()) {
      const updated = { ...currentAdmin, password: newPass };
      setCurrentAdmin(updated);
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(updated));
    }
    addActivityLog({
      username,
      role: 'ADMIN',
      action: 'RECORD_MUTATION',
      status: 'SUCCESS',
      ipOrDevice: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'Browser',
      details: `Admin password updated for account ${username}.`,
    });
    return true;
  };

  const setUniversalAdminPassword = (newPass: string): boolean => {
    if (!newPass || newPass.length < 3) return false;
    const updatedList = authorizedAdminsList.map((adm) => ({
      ...adm,
      password: newPass,
    }));
    setAuthorizedAdminsList(updatedList);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ADMINS, JSON.stringify(updatedList));

    if (currentAdmin) {
      const updated = { ...currentAdmin, password: newPass };
      setCurrentAdmin(updated);
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(updated));
    }
    addActivityLog({
      username: currentAdmin?.name || 'SUPER_ADMIN',
      role: 'SUPER_ADMIN',
      action: 'RECORD_MUTATION',
      status: 'SUCCESS',
      ipOrDevice: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'Browser',
      details: `Universal password applied to all ${updatedList.length} admin accounts.`,
    });
    return true;
  };

  // Record CRUD & Sync with Player profiles
  const syncPlayerTrophyCounts = (currentRecords: HallOfFameRecord[], currentPlayers: PlayerProfile[]) => {
    const countsMap: Record<string, { total: number; entries: { competitionId: string; competitionName: string; count: number; club: string }[] }> = {};
    
    currentRecords.forEach((rec) => {
      const pName = rec.playerName.toUpperCase().trim();
      if (!countsMap[pName]) {
        countsMap[pName] = { total: 0, entries: [] };
      }
      countsMap[pName].total += rec.count;
      countsMap[pName].entries.push({
        competitionId: rec.competitionId,
        competitionName: rec.competitionName,
        count: rec.count,
        club: rec.club,
      });
    });

    return currentPlayers.map((p) => {
      const pName = p.name.toUpperCase().trim();
      const stats = countsMap[pName];
      if (stats) {
        const total = stats.total;
        let tier: PlayerProfile['legendTier'] = 'HOF_INDUCTEE';
        let status = 'EFES Hall of Fame Inductee';
        if (total >= 5) {
          tier = 'IMMORTAL';
          status = 'EFES Legend (Immortal)';
        } else if (total >= 3) {
          tier = 'ELITE';
          status = 'EFES Elite Legend';
        } else if (total >= 2) {
          tier = 'VETERAN';
          status = 'EFES Master Legend';
        }

        return {
          ...p,
          totalTrophies: total,
          legendTier: tier,
          legendStatus: status,
          trophies: stats.entries,
        };
      }
      return p;
    });
  };

  const addRecord = (record: Omit<HallOfFameRecord, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    const newId = `hof-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: HallOfFameRecord = { ...record, id: newId, updatedAt: new Date().toISOString() };
    const updated = [newRecord, ...records];
    setRecords(updated);

    // Sync trophy counts and create/update player profile if needed
    let updatedPlayersList: PlayerProfile[] = [];
    setPlayers((prev) => {
      const pName = record.playerName.toUpperCase().trim();
      const existingPlayer = prev.find((p) => p.name.toUpperCase().trim() === pName);

      let currentList = prev;
      if (!existingPlayer) {
        const newPlayer: PlayerProfile = {
          id: `player-${Date.now()}`,
          name: pName,
          displayName: record.playerName,
          photoUrl:
            record.photoUrl ||
            'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
          primaryClub: record.club,
          totalTrophies: record.count,
          legendStatus: 'EFES Hall of Fame Inductee',
          legendTier: 'HOF_INDUCTEE',
          trophies: [],
          achievements: [`${record.competitionName} Champion`],
          awardsWon: [],
          overallRating: 90,
          preferredPosition: 'FWD',
          updatedAt: new Date().toISOString(),
        };
        currentList = [newPlayer, ...prev];
      } else if (record.photoUrl) {
        currentList = prev.map((p) =>
          p.name.toUpperCase().trim() === pName ? { ...p, photoUrl: record.photoUrl!, updatedAt: new Date().toISOString() } : p
        );
      }

      updatedPlayersList = syncPlayerTrophyCounts(updated, currentList);
      return updatedPlayersList;
    });

    debouncedPushToServer({
      ...latestStateRef.current,
      records: updated,
      players: updatedPlayersList.length > 0 ? updatedPlayersList : latestStateRef.current.players,
    });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'RECORD_MUTATION',
      status: 'SUCCESS',
      details: `Added new Hall of Fame record for ${record.playerName} (${record.competitionName}).`,
    });

    sounds.playGoldenChime();
  };

  const updateRecord = (id: string, updatedFields: Partial<HallOfFameRecord>) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = records.map((r) =>
      r.id === id ? { ...r, ...updatedFields, updatedAt: new Date().toISOString() } : r
    );
    setRecords(updated);
    let updatedPlayersList: PlayerProfile[] = [];
    setPlayers((prev) => {
      updatedPlayersList = syncPlayerTrophyCounts(updated, prev);
      return updatedPlayersList;
    });

    debouncedPushToServer({
      ...latestStateRef.current,
      records: updated,
      players: updatedPlayersList.length > 0 ? updatedPlayersList : latestStateRef.current.players,
    });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'RECORD_MUTATION',
      status: 'SUCCESS',
      details: `Updated Hall of Fame record ID ${id}.`,
    });

    sounds.playClick();
  };

  const deleteRecord = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const target = records.find((r) => r.id === id);
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    let updatedPlayersList: PlayerProfile[] = [];
    setPlayers((prev) => {
      updatedPlayersList = syncPlayerTrophyCounts(updated, prev);
      return updatedPlayersList;
    });

    debouncedPushToServer({
      ...latestStateRef.current,
      records: updated,
      players: updatedPlayersList.length > 0 ? updatedPlayersList : latestStateRef.current.players,
    });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'RECORD_MUTATION',
      status: 'SUCCESS',
      details: `Deleted Hall of Fame record for ${target?.playerName || id}.`,
    });

    sounds.playClick();
  };

  const uploadWinnerPhoto = async (playerName: string, photoUrl: string) => {
    if (!playerName || !photoUrl) return;
    lastLocalEditTimeRef.current = Date.now();
    const cleanName = playerName.trim();
    const pNameNormalized = cleanName.toLowerCase();

    // 1. Direct call to server photo endpoint
    let diskUrl = photoUrl;
    try {
      const photoRes = await fetch('/api/efes/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: cleanName, photoUrl }),
      });
      if (photoRes.ok) {
        const data = await photoRes.json();
        if (data && data.url) {
          diskUrl = data.url;
        }
      }
    } catch (err) {
      console.warn('[EFES Photo Sync] Direct photo sync:', err);
    }

    // 2. Update player profile state and records
    let updatedPlayers: PlayerProfile[] = [];
    setPlayers((prev) => {
      const exists = prev.some((p) => p.name.trim().toLowerCase() === pNameNormalized);
      if (exists) {
        updatedPlayers = prev.map((p) =>
          p.name.trim().toLowerCase() === pNameNormalized
            ? { ...p, photoUrl: diskUrl, updatedAt: new Date().toISOString() }
            : p
        );
      } else {
        const newPlayer: PlayerProfile = {
          id: `player-${Date.now()}`,
          name: cleanName.toUpperCase(),
          displayName: cleanName,
          photoUrl: diskUrl,
          primaryClub: 'EFES Legend',
          totalTrophies: 1,
          legendStatus: 'EFES Hall of Fame Inductee',
          legendTier: 'HOF_INDUCTEE',
          trophies: [],
          achievements: ['EFES Trophy Conqueror'],
          awardsWon: [],
          overallRating: 92,
          preferredPosition: 'FWD',
          updatedAt: new Date().toISOString(),
        };
        updatedPlayers = [newPlayer, ...prev];
      }
      safeLocalStorageSet(STORAGE_KEYS.PLAYERS, JSON.stringify(updatedPlayers));
      return updatedPlayers;
    });

    let updatedRecords: HallOfFameRecord[] = [];
    setRecords((prev) => {
      updatedRecords = prev.map((r) =>
        r.playerName.trim().toLowerCase() === pNameNormalized
          ? { ...r, photoUrl: diskUrl, updatedAt: new Date().toISOString() }
          : r
      );
      safeLocalStorageSet(STORAGE_KEYS.RECORDS, JSON.stringify(updatedRecords));
      return updatedRecords;
    });

    // 3. Immediately trigger atomic server sync
    debouncedPushToServer({
      ...latestStateRef.current,
      players: updatedPlayers.length > 0 ? updatedPlayers : latestStateRef.current.players,
      records: updatedRecords.length > 0 ? updatedRecords : latestStateRef.current.records,
    });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'RECORD_MUTATION',
      status: 'SUCCESS',
      details: `Uploaded new winner photo for ${playerName}.`,
    });

    sounds.playGoldenChime();
  };

  const deleteWinnerPhoto = (playerName: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const pNameNormalized = playerName.trim().toLowerCase();
    const fallback =
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80';
    setPlayers((prev) =>
      prev.map((p) => (p.name.trim().toLowerCase() === pNameNormalized ? { ...p, photoUrl: fallback, updatedAt: new Date().toISOString() } : p))
    );
    setRecords((prev) =>
      prev.map((r) => (r.playerName.trim().toLowerCase() === pNameNormalized ? { ...r, photoUrl: undefined, updatedAt: new Date().toISOString() } : r))
    );
    debouncedPushToServer();
    sounds.playClick();
  };

  // Player Profiles
  const addPlayer = (player: PlayerProfile) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = [{ ...player, updatedAt: new Date().toISOString() }, ...players];
    setPlayers(updated);
    debouncedPushToServer({ ...latestStateRef.current, players: updated });
    sounds.playGoldenChime();
  };

  const updatePlayer = (id: string, fields: Partial<PlayerProfile>) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = players.map((p) => (p.id === id ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p));
    setPlayers(updated);
    debouncedPushToServer({ ...latestStateRef.current, players: updated });
    sounds.playClick();
  };

  const deletePlayer = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
    debouncedPushToServer({ ...latestStateRef.current, players: updated });
    sounds.playClick();
  };

  // Ballon d'Or Season 2 Contenders & State
  const addContender = (contender: Omit<BallonDorContender, 'id' | 'votes'>) => {
    lastLocalEditTimeRef.current = Date.now();
    const newId = `contender-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEntry: BallonDorContender = {
      ...contender,
      id: newId,
      votes: 0,
    };
    const updated = [newEntry, ...contenders];
    setContenders(updated);
    debouncedPushToServer({ ...latestStateRef.current, contenders: updated });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'BALLONDOR_UPDATE',
      status: 'SUCCESS',
      details: `Added new Ballon d'Or Season 2 nominee: ${contender.name} (${contender.club}).`,
    });

    sounds.playGoldenChime();
  };

  const updateContender = (id: string, fields: Partial<BallonDorContender>) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = contenders.map((c) => (c.id === id ? { ...c, ...fields } : c));
    setContenders(updated);
    debouncedPushToServer({ ...latestStateRef.current, contenders: updated });
    sounds.playClick();
  };

  const deleteContender = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const target = contenders.find((c) => c.id === id);
    const updated = contenders.filter((c) => c.id !== id);
    setContenders(updated);
    debouncedPushToServer({ ...latestStateRef.current, contenders: updated });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'BALLONDOR_UPDATE',
      status: 'SUCCESS',
      details: `Deleted Ballon d'Or nominee: ${target?.name || id}.`,
    });

    sounds.playClick();
  };

  const castBallonDorVote = (contenderId: string): boolean => {
    if (!ballonDorState.isVotingOpen) return false;
    if (hasUserVoted) return false;
    lastLocalEditTimeRef.current = Date.now();

    const updated = contenders.map((c) => (c.id === contenderId ? { ...c, votes: c.votes + 1 } : c));
    setContenders(updated);
    setHasUserVoted(true);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_VOTED, 'true');
    } catch {
      // ignore
    }
    debouncedPushToServer({ ...latestStateRef.current, contenders: updated });
    sounds.playGoldenChime();
    return true;
  };

  const updateBallonDorState = (newState: Partial<BallonDorState>) => {
    lastLocalEditTimeRef.current = Date.now();
    const merged = { ...ballonDorState, ...newState };
    setBallonDorState(merged);
    debouncedPushToServer({ ...latestStateRef.current, ballonDorState: merged });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'BALLONDOR_UPDATE',
      status: 'SUCCESS',
      details: `Updated Ballon d'Or state (Voting status: ${
        newState.isVotingOpen !== undefined ? (newState.isVotingOpen ? 'OPEN' : 'CLOSED') : 'unchanged'
      }).`,
    });

    sounds.playClick();
  };

  const setBallonDorWinner = (contenderId: string) => {
    const winnerContender = contenders.find((c) => c.id === contenderId);
    if (!winnerContender) return;
    lastLocalEditTimeRef.current = Date.now();

    const pastWinnerEntry = {
      season: ballonDorState.season || 2,
      winnerName: winnerContender.name.toUpperCase(),
      club: winnerContender.club,
      trophiesWon: winnerContender.seasonTrophies.length > 0 ? winnerContender.seasonTrophies : ['Ballon d\'Or S2'],
      year: '2026',
      photoUrl: winnerContender.photoUrl,
    };

    const filteredPast = ballonDorState.pastWinners.filter((w) => w.season !== ballonDorState.season);
    const updatedState: BallonDorState = {
      ...ballonDorState,
      isVotingOpen: false,
      winnerAnnounced: true,
      winnerContenderId: contenderId,
      pastWinners: [...filteredPast, pastWinnerEntry],
    };

    setBallonDorState(updatedState);
    debouncedPushToServer({ ...latestStateRef.current, ballonDorState: updatedState });

    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: currentAdmin?.role || 'ADMIN',
      action: 'BALLONDOR_UPDATE',
      status: 'SUCCESS',
      details: `Announced ${winnerContender.name} as official EFES Ballon d'Or Season 2 Winner!`,
    });

    sounds.playGoldenChime();
  };

  // Events CRUD
  const addEvent = (event: Omit<EventItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    const newId = `event-${Date.now()}`;
    const updated = [{ ...event, id: newId }, ...events];
    setEvents(updated);
    debouncedPushToServer({ ...latestStateRef.current, events: updated });
    sounds.playGoldenChime();
  };

  const updateEvent = (id: string, fields: Partial<EventItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = events.map((ev) => (ev.id === id ? { ...ev, ...fields } : ev));
    setEvents(updated);
    debouncedPushToServer({ ...latestStateRef.current, events: updated });
    sounds.playClick();
  };

  const deleteEvent = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = events.filter((ev) => ev.id !== id);
    setEvents(updated);
    debouncedPushToServer({ ...latestStateRef.current, events: updated });
    sounds.playClick();
  };

  // News CRUD
  const addNews = (item: Omit<NewsItem, 'id'>) => {
    lastLocalEditTimeRef.current = Date.now();
    const newId = `news-${Date.now()}`;
    const updated = [{ ...item, id: newId }, ...news];
    setNews(updated);
    debouncedPushToServer({ ...latestStateRef.current, news: updated });
    sounds.playGoldenChime();
  };

  const updateNews = (id: string, fields: Partial<NewsItem>) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = news.map((n) => (n.id === id ? { ...n, ...fields } : n));
    setNews(updated);
    debouncedPushToServer({ ...latestStateRef.current, news: updated });
    sounds.playClick();
  };

  const deleteNews = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    debouncedPushToServer({ ...latestStateRef.current, news: updated });
    sounds.playClick();
  };

  // Competitions
  const addCompetition = (comp: Competition) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = [...competitions, comp];
    setCompetitions(updated);
    debouncedPushToServer({ ...latestStateRef.current, competitions: updated });
    sounds.playGoldenChime();
  };

  const updateCompetition = (id: string, fields: Partial<Competition>) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = competitions.map((c) => (c.id === id ? { ...c, ...fields } : c));
    setCompetitions(updated);
    debouncedPushToServer({ ...latestStateRef.current, competitions: updated });
    sounds.playClick();
  };

  const deleteCompetition = (id: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const updated = competitions.filter((c) => c.id !== id);
    setCompetitions(updated);
    debouncedPushToServer({ ...latestStateRef.current, competitions: updated });
    sounds.playClick();
  };

  const resetToDefaultData = () => {
    setCompetitions(INITIAL_COMPETITIONS);
    setRecords(INITIAL_HOF_RECORDS);
    setPlayers(INITIAL_PLAYERS);
    setContenders(INITIAL_BALLON_D_OR_CONTENDERS);
    setBallonDorState(INITIAL_BALLON_D_OR_STATE);
    setEvents(INITIAL_EVENTS);
    setNews(INITIAL_NEWS);
    setAuthorizedAdminsList(AUTHORIZED_ADMINS);
    setHasUserVoted(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_VOTED);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_ADMINS);
    } catch {
      // ignore
    }
    addActivityLog({
      username: currentAdmin?.name || 'Admin',
      role: 'SYSTEM',
      action: 'RECORD_MUTATION',
      status: 'WARNING',
      details: 'Restored database to official EFES factory defaults.',
    });
    sounds.playWhistle();
  };

  const exportDatabaseJson = (): string => {
    const dump = {
      version: 'EFES_HOF_3.0',
      exportedAt: new Date().toISOString(),
      competitions,
      records,
      players,
      contenders,
      ballonDorState,
      events,
      news,
      activityLogs,
    };
    return JSON.stringify(dump, null, 2);
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.competitions && parsed.records && parsed.players) {
        if (parsed.competitions) setCompetitions(parsed.competitions);
        if (parsed.records) setRecords(parsed.records);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.contenders) setContenders(parsed.contenders);
        if (parsed.ballonDorState) setBallonDorState(parsed.ballonDorState);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.news) setNews(parsed.news);
        if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
        sounds.playGoldenChime();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <EFESContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPlayerId,
        setSelectedPlayerId,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isAdminModalOpen: isAdminLoginOpen,
        setIsAdminModalOpen: setIsAdminLoginOpen,
        openAdminModal: () => setIsAdminLoginOpen(true),
        isMuted,
        toggleMute,
        isSyncing,
        lastServerSync,
        serverConnected,
        syncWithServer,
        currentAdmin,
        loginAdmin,
        logoutAdmin,
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
        castBallonDorVote,
        hasUserVoted,
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
      }}
    >
      {children}
    </EFESContext.Provider>
  );
};

export const useEFES = () => {
  const context = useContext(EFESContext);
  if (!context) {
    throw new Error('useEFES must be used within an EFESProvider');
  }
  return context;
};
