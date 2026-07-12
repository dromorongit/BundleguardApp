import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

export interface Bundle {
  id: number;
  carrier: string;
  size_mb: number;
  cost_ghc: number;
  purchased_at: string;
  expires_at: string;
}

export interface UsageSnapshot {
  id: number;
  bundle_id: number;
  total_used_mb: number;
  recorded_at: string;
}

export interface AppUsage {
  id: number;
  snapshot_id: number;
  app_name: string;
  package_name: string;
  used_mb: number;
}

let db: SQLiteDatabase | null = null;

export async function initDatabase() {
  if (db) return db;

  db = await openDatabaseAsync('bundleguard.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bundles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carrier TEXT NOT NULL,
      size_mb INTEGER NOT NULL,
      cost_ghc REAL NOT NULL,
      purchased_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usage_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bundle_id INTEGER NOT NULL,
      total_used_mb REAL NOT NULL,
      recorded_at TEXT NOT NULL,
      FOREIGN KEY (bundle_id) REFERENCES bundles(id) ON DELETE CASCADE
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snapshot_id INTEGER NOT NULL,
      app_name TEXT NOT NULL,
      package_name TEXT NOT NULL,
      used_mb REAL NOT NULL,
      FOREIGN KEY (snapshot_id) REFERENCES usage_snapshots(id) ON DELETE CASCADE
    );
  `);

  console.log('SQLite database initialized successfully');
  return db;
}

export async function getDb() {
  if (!db) {
    await initDatabase();
  }
  return db!;
}

export async function insertBundle(bundle: Omit<Bundle, 'id'>): Promise<number> {
  const database = await getDb();
  const result = await database.runAsync(
    'INSERT INTO bundles (carrier, size_mb, cost_ghc, purchased_at, expires_at) VALUES (?, ?, ?, ?, ?)',
    [bundle.carrier, bundle.size_mb, bundle.cost_ghc, bundle.purchased_at, bundle.expires_at]
  );
  return result.lastInsertRowId;
}

export async function getActiveBundle(): Promise<Bundle | null> {
  const database = await getDb();
  const result = await database.getFirstAsync<Bundle>(
    'SELECT * FROM bundles WHERE expires_at > datetime("now") ORDER BY purchased_at DESC LIMIT 1'
  );
  return result ?? null;
}

export async function insertUsageSnapshot(snapshot: Omit<UsageSnapshot, 'id'>): Promise<number> {
  const database = await getDb();
  const result = await database.runAsync(
    'INSERT INTO usage_snapshots (bundle_id, total_used_mb, recorded_at) VALUES (?, ?, ?)',
    [snapshot.bundle_id, snapshot.total_used_mb, snapshot.recorded_at]
  );
  return result.lastInsertRowId;
}

export async function insertAppUsage(appUsage: { snapshot_id: number; app_name: string; package_name: string; used_mb: number }): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    'INSERT INTO app_usage (snapshot_id, app_name, package_name, used_mb) VALUES (?, ?, ?, ?)',
    [appUsage.snapshot_id, appUsage.app_name, appUsage.package_name, appUsage.used_mb]
  );
}

export async function getSnapshotsForBundle(bundleId: number): Promise<UsageSnapshot[]> {
  const database = await getDb();
  return await database.getAllAsync<UsageSnapshot>(
    'SELECT * FROM usage_snapshots WHERE bundle_id = ? ORDER BY recorded_at DESC',
    [bundleId]
  );
}