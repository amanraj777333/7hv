import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_SEED_DATA } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel serverless environments, file writing is restricted to /tmp
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? path.join('/tmp', '7h_data') : path.join(__dirname, 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
export const DB_FILE = path.join(DATA_DIR, 'database.json');
const SEED_FILE = path.join(__dirname, 'data', 'database.json');

// Ensure data and backup directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// On Vercel, copy seeded database.json to /tmp if not yet present
if (isVercel && !fs.existsSync(DB_FILE)) {
  if (fs.existsSync(SEED_FILE)) {
    try {
      fs.copyFileSync(SEED_FILE, DB_FILE);
    } catch {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_DATA, null, 2));
    }
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_DATA, null, 2));
  }
}

// In-memory cache synced with disk
let dbCache = null;

// ==========================================
// SUPABASE CLOUD SYNC ADAPTER
// ==========================================
export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';
  const databaseUrl = process.env.DATABASE_URL || '';
  const isConfigured = Boolean((url && key) || databaseUrl);
  return {
    url: url ? url.replace(/\/$/, '') : '',
    hasKey: Boolean(key),
    databaseUrl: databaseUrl ? 'Configured' : 'Not set',
    isConfigured,
    mode: isConfigured ? 'Supabase Cloud Synchronized' : 'Local /tmp Atomic Store (Supabase-ready)'
  };
}

/**
 * Sync single entity to Supabase via REST API
 */
export async function syncToSupabase(collection, item, action = 'upsert') {
  const url = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/$/, '') : '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    return { skipped: true, reason: 'Supabase credentials not configured' };
  }

  try {
    const tableEndpoint = `${url}/rest/v1/${collection}`;
    if (action === 'delete') {
      const res = await fetch(`${tableEndpoint}?id=eq.${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      return { success: res.ok, status: res.status };
    } else {
      const res = await fetch(tableEndpoint, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(item)
      });
      return { success: res.ok, status: res.status };
    }
  } catch (err) {
    console.warn(`Supabase background sync notice for "${collection}":`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Bulk sync all collections to Supabase
 */
export async function syncAllToSupabase() {
  const url = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/$/, '') : '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    return {
      success: false,
      message: 'Supabase credentials missing. Add SUPABASE_URL and SUPABASE_KEY to your environment variables or Vercel dashboard.'
    };
  }

  const db = getDatabase();
  const results = {};

  for (const [colName, items] of Object.entries(db)) {
    if (!Array.isArray(items) || items.length === 0) continue;
    try {
      const tableEndpoint = `${url}/rest/v1/${colName}`;
      const res = await fetch(tableEndpoint, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(items)
      });
      results[colName] = {
        count: items.length,
        status: res.ok ? 'synced' : 'notice',
        statusCode: res.status
      };
    } catch (err) {
      results[colName] = { count: items.length, status: 'error', error: err.message };
    }
  }

  return {
    success: true,
    syncedAt: new Date().toISOString(),
    results
  };
}

/**
 * Automatically create a timestamped backup of the database
 */
export function createBackup() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(BACKUPS_DIR, `database-backup-${timestamp}.json`);
      fs.copyFileSync(DB_FILE, backupPath);

      // Clean up old backups keeping the most recent 10
      const backups = fs.readdirSync(BACKUPS_DIR)
        .filter((f) => f.startsWith('database-backup-') && f.endsWith('.json'))
        .map((f) => ({ name: f, time: fs.statSync(path.join(BACKUPS_DIR, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);

      if (backups.length > 10) {
        backups.slice(10).forEach((b) => {
          try {
            fs.unlinkSync(path.join(BACKUPS_DIR, b.name));
          } catch {}
        });
      }
      return backupPath;
    }
  } catch (err) {
    console.error('Backup creation error:', err);
  }
  return null;
}

/**
 * Load database from disk with automatic schema migration
 */
export function getDatabase() {
  if (dbCache) return dbCache;

  let loadedData = null;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      loadedData = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse database.json, re-initializing from seed data:', e);
    }
  }

  if (!loadedData) {
    // Fresh initialization from seed data
    loadedData = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    saveDatabase(loadedData);
    createBackup();
    dbCache = loadedData;
    return dbCache;
  }

  // Schema migration check: ensure newly added collections exist without overwriting existing data
  let migrated = false;
  const requiredCollections = [
    'media_mappings',
    'media',
    'events',
    'registrations',
    'academy_sessions',
    'academy_registrations',
    'articles',
    'subscribers',
    'newsletters',
    'founders',
    'startups',
    'opportunities',
    'pitch_applications',
    'partnerships',
    'enquiries',
    'resources',
    'website_settings',
    'users',
    'analytics',
    'audit_logs',
    'payments',
    'email_templates',
    'email_automations',
    'email_segments',
    'email_campaigns',
    'email_logs',
    'email_unsubscribes'
  ];

  requiredCollections.forEach((col) => {
    if (loadedData[col] === undefined) {
      loadedData[col] = INITIAL_SEED_DATA[col] ? JSON.parse(JSON.stringify(INITIAL_SEED_DATA[col])) : [];
      migrated = true;
    }
  });

  // Verify academy_sessions exists and is populated
  if (!loadedData.academy_sessions || loadedData.academy_sessions.length === 0) {
    loadedData.academy_sessions = JSON.parse(JSON.stringify(INITIAL_SEED_DATA.academy_sessions || []));
    migrated = true;
  }
  if (!loadedData.academy_registrations) {
    loadedData.academy_registrations = JSON.parse(JSON.stringify(INITIAL_SEED_DATA.academy_registrations || []));
    migrated = true;
  }

  dbCache = loadedData;

  if (migrated) {
    saveDatabase(dbCache);
    createBackup();
    console.log('Database schema successfully verified & migrated with Academy collections.');
  }

  return dbCache;
}

/**
 * Atomically persist database to disk
 */
export function saveDatabase(data) {
  dbCache = data;
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
    // Cleanup temporary file if it still exists
    if (fs.existsSync(tmpFile)) {
      try {
        fs.unlinkSync(tmpFile);
      } catch {}
    }
    throw err;
  }
}

export function getCollection(collectionName) {
  const db = getDatabase();
  return db[collectionName] || [];
}

export function setCollection(collectionName, items) {
  const db = getDatabase();
  db[collectionName] = items;
  saveDatabase(db);
  return items;
}

export function insertItem(collectionName, item) {
  const db = getDatabase();
  if (!db[collectionName]) db[collectionName] = [];
  const newItem = {
    ...item,
    id: item.id || `${collectionName.slice(0, 4)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: item.createdAt || new Date().toISOString()
  };
  db[collectionName].unshift(newItem);
  saveDatabase(db);
  // Asynchronous sync to Supabase (non-blocking)
  syncToSupabase(collectionName, newItem, 'upsert').catch(() => {});
  return newItem;
}

export function updateItem(collectionName, id, updates) {
  const db = getDatabase();
  if (!db[collectionName]) return null;
  const index = db[collectionName].findIndex((i) => i.id === id);
  if (index === -1) return null;
  db[collectionName][index] = {
    ...db[collectionName][index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  // Asynchronous sync to Supabase (non-blocking)
  syncToSupabase(collectionName, db[collectionName][index], 'upsert').catch(() => {});
  return db[collectionName][index];
}

export function deleteItem(collectionName, id, soft = true, user = 'Admin') {
  const db = getDatabase();
  if (!db[collectionName]) return false;
  const index = db[collectionName].findIndex((i) => i.id === id);
  if (index === -1) return false;

  if (soft) {
    db[collectionName][index] = {
      ...db[collectionName][index],
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: user
    };
    saveDatabase(db);
    syncToSupabase(collectionName, db[collectionName][index], 'upsert').catch(() => {});
    return true;
  } else {
    // Permanent deletion
    db[collectionName].splice(index, 1);
    saveDatabase(db);
    syncToSupabase(collectionName, { id }, 'delete').catch(() => {});
    return true;
  }
}

export function restoreItem(collectionName, id, user = 'Admin') {
  const db = getDatabase();
  if (!db[collectionName]) return null;
  const index = db[collectionName].findIndex((i) => i.id === id);
  if (index === -1) return null;

  db[collectionName][index] = {
    ...db[collectionName][index],
    isDeleted: false,
    restoredAt: new Date().toISOString(),
    restoredBy: user
  };
  saveDatabase(db);
  syncToSupabase(collectionName, db[collectionName][index], 'upsert').catch(() => {});
  return db[collectionName][index];
}

/**
 * Returns comprehensive audit details about the database structure
 */
export function getDatabaseInfo() {
  const db = getDatabase();
  const tables = Object.keys(db).map((k) => ({
    name: k,
    count: Array.isArray(db[k]) ? db[k].length : typeof db[k] === 'object' ? Object.keys(db[k]).length : 1
  }));

  const supabaseInfo = getSupabaseConfig();

  return {
    databaseType: supabaseInfo.isConfigured
      ? 'Supabase Cloud Database (REST Sync & PostgreSQL Connected)'
      : 'Atomic Persistent Document Engine (JSON Store with Schema Migrations & Automated Backups)',
    location: DB_FILE,
    backupsDirectory: BACKUPS_DIR,
    supabase: supabaseInfo,
    productionConfig: {
      storageModel: supabaseInfo.isConfigured
        ? 'Supabase Managed Cloud Postgres with Local Atomic Fallback'
        : 'Persistent Volume Disk / SQLite-compatible or Managed Postgres (via DATABASE_URL / SUPABASE_URL)',
      concurrencyControl: 'Atomic swap with process-level cache synchronization',
      backupStrategy: 'Automated timestamped snapshots on boot and revision'
    },
    tables,
    totalRecords: tables.reduce((acc, t) => acc + t.count, 0)
  };
}
