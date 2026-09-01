export type LegendTier = 'IMMORTAL' | 'ELITE' | 'VETERAN' | 'HOF_INDUCTEE';

export interface TrophyEntry {
  competitionId: string;
  competitionName: string;
  count: number;
  club: string;
  edition?: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  displayName: string;
  photoUrl: string;
  primaryClub: string;
  secondaryClubs?: string[];
  totalTrophies: number;
  legendStatus: string;
  legendTier: LegendTier;
  nationality?: string;
  preferredPosition?: string;
  overallRating?: number;
  trophies: TrophyEntry[];
  achievements: string[];
  awardsWon: string[];
  bio?: string;
  highlightMatch?: string;
  joinedYear?: string;
  updatedAt?: string;
}

export interface HallOfFameRecord {
  id: string;
  competitionId: string;
  competitionName: string;
  playerName: string;
  club: string;
  count: number;
  seasonOrYear?: string;
  trophyType?: string;
  notes?: string;
  photoUrl?: string;
  updatedAt?: string;
}

export interface Competition {
  id: string;
  name: string;
  iconName: string;
  category: 'CUP' | 'LEAGUE' | 'SPECIAL' | 'INTERNATIONAL';
  trophyDescription: string;
  bannerGradient: string;
}

export interface BallonDorContender {
  id: string;
  name: string;
  club: string;
  photoUrl: string;
  position: string;
  seasonStats: {
    matches: number;
    goals: number;
    assists: number;
    rating: number; // e.g. 8.9
    cleanSheets?: number;
    winRate: number; // e.g. 78%
  };
  achievements: string[];
  seasonTrophies: string[];
  votes: number;
  nominatedBy?: string;
}

export interface BallonDorState {
  season: number; // 3
  isVotingOpen: boolean;
  announcementTitle: string;
  announcementSubtitle: string;
  comingSoonBannerVisible: boolean;
  votingDeadline?: string;
  winnerAnnounced: boolean;
  winnerContenderId?: string;
  pastWinners: {
    season: number;
    winnerName: string;
    club: string;
    trophiesWon: string[];
    year: string;
    photoUrl?: string;
  }[];
}

export interface EventItem {
  id: string;
  title: string;
  type: 'TOURNAMENT' | 'BALLON_D_OR' | 'COMMUNITY' | 'LEAGUE_UPDATE';
  date: string;
  status: 'UPCOMING' | 'REGISTRATION_OPEN' | 'ONGOING' | 'COMPLETED';
  description: string;
  prizePool?: string;
  locationOrPlatform: string;
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  author: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface AdminUser {
  username: string;
  name: string;
  email?: string;
  role: 'SUPER_ADMIN' | 'COMMUNITY_ADMIN';
  avatar?: string;
  password?: string;
  aliases?: string[];
}

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  username: string;
  role?: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'INACTIVITY_LOGOUT' | 'RECORD_MUTATION' | 'BALLONDOR_UPDATE';
  status: 'SUCCESS' | 'DENIED' | 'WARNING';
  ipOrDevice?: string;
  details?: string;
}

export type PageRoute = 'home' | 'hall-of-fame' | 'trophy-leaders' | 'legends' | 'ballon-dor' | 'events' | 'admin';
