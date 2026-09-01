import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_COMPETITIONS,
  INITIAL_HOF_RECORDS,
  INITIAL_PLAYERS,
  INITIAL_BALLON_D_OR_CONTENDERS,
  INITIAL_BALLON_D_OR_STATE,
  INITIAL_EVENTS,
  INITIAL_NEWS,
} from './src/data/initialData';

const app = express();
const PORT = 3000;

// High payload limit for handling optimized photo uploads and full database snapshots
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure server data and uploads directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
}

// Serve uploaded images statically with proper caching
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '30d',
}));

// Helper function to save a base64 image to disk and return permanent URL
function saveBase64ImageToDisk(base64String: string, prefix = 'photo'): string | null {
  try {
    if (!base64String || typeof base64String !== 'string') return null;
    if (!base64String.startsWith('data:image/')) return null;

    const commaIdx = base64String.indexOf(';base64,');
    if (commaIdx === -1) return null;

    const mime = base64String.substring(5, commaIdx).toLowerCase();
    const base64Data = base64String.substring(commaIdx + 8);

    let ext = 'jpg';
    if (mime.includes('png')) ext = 'png';
    else if (mime.includes('webp')) ext = 'webp';
    else if (mime.includes('gif')) ext = 'gif';
    else if (mime.includes('svg')) ext = 'svg';

    const buffer = Buffer.from(base64Data, 'base64');
    if (!buffer || buffer.length === 0) return null;

    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 24);
    const filename = `${cleanPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    console.log(`[EFES Image Server] Saved image to permanent disk storage: ${filename} (${buffer.length} bytes)`);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('[EFES Image Server] Error saving image to disk:', err);
    return null;
  }
}

const DB_FILE_PATH = path.join(DATA_DIR, 'efes_store.json');

interface EFESDatabaseState {
  competitions: any[];
  records: any[];
  players: any[];
  contenders: any[];
  ballonDorState: any;
  events: any[];
  news: any[];
  activityLogs: any[];
  lastUpdated: string;
}

const getInitialState = (): EFESDatabaseState => ({
  competitions: INITIAL_COMPETITIONS,
  records: INITIAL_HOF_RECORDS,
  players: INITIAL_PLAYERS,
  contenders: INITIAL_BALLON_D_OR_CONTENDERS,
  ballonDorState: INITIAL_BALLON_D_OR_STATE,
  events: INITIAL_EVENTS,
  news: INITIAL_NEWS,
  activityLogs: [
    {
      id: `log-init-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: 'SYSTEM',
      role: 'SUPER_ADMIN',
      action: 'RECORD_MUTATION',
      status: 'SUCCESS',
      details: 'EFES Cloud Database online & synchronized.',
    },
  ],
  lastUpdated: new Date().toISOString(),
});

// Load or initialize persistent database
let currentDb: EFESDatabaseState;

try {
  if (fs.existsSync(DB_FILE_PATH)) {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    currentDb = {
      ...getInitialState(),
      ...parsed,
    };
    console.log(`[EFES Server] Loaded persistent database from disk (${currentDb.players?.length || 0} players, ${currentDb.records?.length || 0} records).`);
  } else {
    currentDb = getInitialState();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(currentDb, null, 2), 'utf-8');
    console.log('[EFES Server] Initialized new persistent database file.');
  }
} catch (e) {
  console.error('[EFES Server] Failed to read database, starting with default state:', e);
  currentDb = getInitialState();
}

const saveDbToDisk = () => {
  try {
    currentDb.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(currentDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[EFES Server] Error saving database to disk:', err);
  }
};

// ==========================================
// API ROUTES FIRST
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'EFES Cloud Master Server',
    lastUpdated: currentDb.lastUpdated,
    playersCount: currentDb.players?.length || 0,
    recordsCount: currentDb.records?.length || 0,
  });
});

// 1. Upload image binary/base64 to disk and return permanent URL
app.post('/api/efes/upload-image', (req, res) => {
  try {
    const { dataUrl, playerName, category = 'portrait' } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    // If already a URL (e.g. https://... or /uploads/...), return as is
    if (typeof dataUrl === 'string' && !dataUrl.startsWith('data:image/')) {
      return res.json({ success: true, url: dataUrl });
    }

    const prefix = playerName
      ? `player_${playerName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15)}`
      : category;

    const savedUrl = saveBase64ImageToDisk(dataUrl, prefix);
    if (!savedUrl) {
      return res.status(400).json({ success: false, error: 'Invalid or unsupported image format' });
    }

    // If player name was specified, update database immediately on disk
    if (playerName) {
      const cleanName = playerName.trim().toLowerCase();
      currentDb.players = currentDb.players.map((p) =>
        p.name.trim().toLowerCase() === cleanName
          ? { ...p, photoUrl: savedUrl, updatedAt: new Date().toISOString() }
          : p
      );
      currentDb.records = currentDb.records.map((r) =>
        r.playerName.trim().toLowerCase() === cleanName
          ? { ...r, photoUrl: savedUrl, updatedAt: new Date().toISOString() }
          : r
      );
      saveDbToDisk();
    }

    res.json({
      success: true,
      url: savedUrl,
      lastUpdated: currentDb.lastUpdated,
    });
  } catch (err: any) {
    console.error('[EFES Server] Upload error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to upload image' });
  }
});

// 2. Get entire shared EFES database
app.get('/api/efes/data', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({
    success: true,
    data: currentDb,
    lastUpdated: currentDb.lastUpdated,
  });
});

// 3. Generic update endpoint (for batch or individual section updates)
app.post('/api/efes/update', (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }

    // Sanitize any base64 images inside players/records/contenders into disk files
    if (Array.isArray(updates.players)) {
      updates.players = updates.players.map((p: any) => {
        if (p.photoUrl && p.photoUrl.startsWith('data:image/')) {
          const diskUrl = saveBase64ImageToDisk(p.photoUrl, `player_${(p.name || 'avatar').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15)}`);
          if (diskUrl) p.photoUrl = diskUrl;
        }
        return p;
      });
    }

    if (Array.isArray(updates.records)) {
      updates.records = updates.records.map((r: any) => {
        if (r.photoUrl && r.photoUrl.startsWith('data:image/')) {
          const diskUrl = saveBase64ImageToDisk(r.photoUrl, `record_${(r.playerName || 'win').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15)}`);
          if (diskUrl) r.photoUrl = diskUrl;
        }
        return r;
      });
    }

    if (Array.isArray(updates.contenders)) {
      updates.contenders = updates.contenders.map((c: any) => {
        if (c.photoUrl && c.photoUrl.startsWith('data:image/')) {
          const diskUrl = saveBase64ImageToDisk(c.photoUrl, `contender_${(c.name || 'nominee').toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15)}`);
          if (diskUrl) c.photoUrl = diskUrl;
        }
        return c;
      });
    }

    if (updates.competitions !== undefined) currentDb.competitions = updates.competitions;
    if (updates.records !== undefined) currentDb.records = updates.records;
    if (updates.players !== undefined) currentDb.players = updates.players;
    if (updates.contenders !== undefined) currentDb.contenders = updates.contenders;
    if (updates.ballonDorState !== undefined) currentDb.ballonDorState = updates.ballonDorState;
    if (updates.events !== undefined) currentDb.events = updates.events;
    if (updates.news !== undefined) currentDb.news = updates.news;
    if (updates.activityLogs !== undefined) {
      // Keep up to 200 activity logs
      currentDb.activityLogs = (updates.activityLogs || []).slice(0, 200);
    }

    saveDbToDisk();

    console.log(`[EFES Server] Database updated by manager at ${currentDb.lastUpdated}`);
    res.json({
      success: true,
      lastUpdated: currentDb.lastUpdated,
      playersCount: currentDb.players.length,
      recordsCount: currentDb.records.length,
    });
  } catch (err: any) {
    console.error('[EFES Server] Update error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
});

// 4. Upsert a specific player profile directly
app.post('/api/efes/player', (req, res) => {
  try {
    const { player } = req.body;
    if (!player || !player.name) {
      return res.status(400).json({ success: false, error: 'Player data with name is required' });
    }

    let finalPhotoUrl = player.photoUrl;
    if (finalPhotoUrl && finalPhotoUrl.startsWith('data:image/')) {
      const diskUrl = saveBase64ImageToDisk(finalPhotoUrl, `player_${player.name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15)}`);
      if (diskUrl) finalPhotoUrl = diskUrl;
    }

    const cleanName = player.name.trim().toLowerCase();
    const existingIndex = currentDb.players.findIndex(
      (p) => p.id === player.id || p.name.trim().toLowerCase() === cleanName
    );

    const updatedPlayerData = {
      ...player,
      photoUrl: finalPhotoUrl,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      currentDb.players[existingIndex] = {
        ...currentDb.players[existingIndex],
        ...updatedPlayerData,
      };
    } else {
      currentDb.players.unshift(updatedPlayerData);
    }

    // If player has photo, sync to records with matching name
    if (finalPhotoUrl) {
      currentDb.records = currentDb.records.map((r) =>
        r.playerName.trim().toLowerCase() === cleanName
          ? { ...r, photoUrl: finalPhotoUrl, updatedAt: new Date().toISOString() }
          : r
      );
    }

    saveDbToDisk();
    console.log(`[EFES Server] Player profile updated: ${player.name} (${finalPhotoUrl})`);

    res.json({
      success: true,
      lastUpdated: currentDb.lastUpdated,
      player: updatedPlayerData,
    });
  } catch (err: any) {
    console.error('[EFES Server] Player update error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to update player' });
  }
});

// 5. Update winner photo across player and records
app.post('/api/efes/photo', (req, res) => {
  try {
    const { playerName, photoUrl } = req.body;
    if (!playerName || !photoUrl) {
      return res.status(400).json({ success: false, error: 'playerName and photoUrl required' });
    }

    let finalPhotoUrl = photoUrl;
    if (finalPhotoUrl.startsWith('data:image/')) {
      const diskUrl = saveBase64ImageToDisk(finalPhotoUrl, `player_${playerName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15)}`);
      if (diskUrl) finalPhotoUrl = diskUrl;
    }

    const cleanName = playerName.trim().toLowerCase();

    // Update in players
    let playerFound = false;
    currentDb.players = currentDb.players.map((p) => {
      if (p.name.trim().toLowerCase() === cleanName) {
        playerFound = true;
        return { ...p, photoUrl: finalPhotoUrl, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    if (!playerFound) {
      currentDb.players.unshift({
        id: `player-${Date.now()}`,
        name: playerName.trim().toUpperCase(),
        displayName: playerName.trim(),
        photoUrl: finalPhotoUrl,
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
      });
    }

    // Update in records
    currentDb.records = currentDb.records.map((r) =>
      r.playerName.trim().toLowerCase() === cleanName
        ? { ...r, photoUrl: finalPhotoUrl, updatedAt: new Date().toISOString() }
        : r
    );

    saveDbToDisk();

    res.json({
      success: true,
      url: finalPhotoUrl,
      lastUpdated: currentDb.lastUpdated,
    });
  } catch (err: any) {
    console.error('[EFES Server] Photo update error:', err);
    res.status(500).json({ success: false, error: err?.message });
  }
});

// 5. Full sync / import from admin
app.post('/api/efes/sync', (req, res) => {
  try {
    const { fullDatabase } = req.body;
    if (!fullDatabase || !Array.isArray(fullDatabase.players)) {
      return res.status(400).json({ success: false, error: 'Invalid database payload' });
    }

    currentDb = {
      ...getInitialState(),
      ...fullDatabase,
      lastUpdated: new Date().toISOString(),
    };

    saveDbToDisk();
    res.json({
      success: true,
      lastUpdated: currentDb.lastUpdated,
      message: 'EFES database successfully synchronized to server disk.',
    });
  } catch (err: any) {
    console.error('[EFES Server] Sync error:', err);
    res.status(500).json({ success: false, error: err?.message });
  }
});

// 6. Reset database to default
app.post('/api/efes/reset', (req, res) => {
  try {
    currentDb = getInitialState();
    saveDbToDisk();
    res.json({
      success: true,
      lastUpdated: currentDb.lastUpdated,
      message: 'EFES database reset to default initial state.',
    });
  } catch (err: any) {
    console.error('[EFES Server] Reset error:', err);
    res.status(500).json({ success: false, error: err?.message });
  }
});

// ==========================================
// VITE MIDDLEWARE SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EFES Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
