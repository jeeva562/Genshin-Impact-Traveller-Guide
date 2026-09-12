/**
 * Database connection and helper utilities.
 * Uses better-sqlite3 for synchronous, fast SQLite access.
 * The database file is stored at project root as genshin-guide.db
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'genshin-guide.db');

let _db = null;

/**
 * Get or create the singleton database connection.
 */
export function getDb() {
  if (_db) return _db;

  // Ensure data directory exists
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  _db = new Database(DB_PATH);

  // Performance optimizations
  _db.pragma('journal_mode = WAL');
  _db.pragma('synchronous = NORMAL');
  _db.pragma('foreign_keys = ON');
  _db.pragma('cache_size = -64000'); // 64MB cache

  // Initialize schema if needed
  initializeSchema(_db);

  return _db;
}

/**
 * Initialize database schema.
 */
function initializeSchema(db) {
  db.exec(`
    -- Characters
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT,
      vision TEXT,
      weapon_type TEXT,
      rarity INTEGER DEFAULT 4,
      nation TEXT,
      affiliation TEXT,
      description TEXT,
      constellation_name TEXT,
      birthday TEXT,
      release_date TEXT,
      gender TEXT,
      vision_key TEXT,
      weapon_type_key TEXT,
      source TEXT DEFAULT 'genshin-api',
      source_url TEXT,
      last_updated TEXT DEFAULT (datetime('now')),
      data_version TEXT
    );

    -- Character Talents
    CREATE TABLE IF NOT EXISTS character_talents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- NORMAL_ATTACK, ELEMENTAL_SKILL, ELEMENTAL_BURST
      unlock TEXT,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );

    -- Talent Upgrades (scaling values)
    CREATE TABLE IF NOT EXISTS talent_upgrades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      talent_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      value TEXT,
      FOREIGN KEY (talent_id) REFERENCES character_talents(id)
    );

    -- Passive Talents
    CREATE TABLE IF NOT EXISTS passive_talents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      unlock TEXT,
      level INTEGER,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );

    -- Constellations
    CREATE TABLE IF NOT EXISTS constellations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      level INTEGER NOT NULL,
      unlock TEXT,
      description TEXT,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );

    -- Ascension Materials (character)
    CREATE TABLE IF NOT EXISTS character_ascension_materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id TEXT NOT NULL,
      ascension_level TEXT NOT NULL, -- e.g. "level_20", "level_40"
      material_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );

    -- Weapons
    CREATE TABLE IF NOT EXISTS weapons (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      rarity INTEGER DEFAULT 3,
      base_attack INTEGER,
      sub_stat TEXT,
      passive_name TEXT,
      passive_desc TEXT,
      location TEXT,
      ascension_material TEXT,
      source TEXT DEFAULT 'genshin-api',
      last_updated TEXT DEFAULT (datetime('now'))
    );

    -- Artifact Sets
    CREATE TABLE IF NOT EXISTS artifact_sets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      max_rarity INTEGER DEFAULT 5,
      two_piece_bonus TEXT,
      four_piece_bonus TEXT,
      source TEXT DEFAULT 'genshin-api',
      last_updated TEXT DEFAULT (datetime('now'))
    );

    -- Talent Books
    CREATE TABLE IF NOT EXISTS talent_books (
      id TEXT PRIMARY KEY,
      book_type TEXT NOT NULL,
      name TEXT NOT NULL,
      rarity INTEGER,
      source_domain TEXT,
      availability TEXT -- JSON array of days
    );

    -- Talent Book -> Character mapping
    CREATE TABLE IF NOT EXISTS talent_book_characters (
      book_type TEXT NOT NULL,
      character_id TEXT NOT NULL,
      PRIMARY KEY (book_type, character_id)
    );

    -- Build Presets (recommendation data)
    CREATE TABLE IF NOT EXISTS build_presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id TEXT NOT NULL,
      preset_name TEXT NOT NULL DEFAULT 'Best Overall',
      preset_type TEXT NOT NULL DEFAULT 'general',
      weapon_ids TEXT, -- JSON array
      artifact_set_ids TEXT, -- JSON array
      artifact_sets_config TEXT, -- JSON: [{setId, pieces}]
      main_stats TEXT, -- JSON: {sands, goblet, circlet}
      sub_stats TEXT, -- JSON array ordered by priority
      stat_targets TEXT, -- JSON: {stat: {min, good, excellent}}
      talent_priority TEXT, -- JSON array ordered
      constellation_notes TEXT, -- JSON: {1: {impact, note}, ...}
      role TEXT,
      notes TEXT,
      confidence TEXT DEFAULT 'Medium', -- High, Medium, Low
      source TEXT DEFAULT 'community',
      last_updated TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );

    -- Team Templates
    CREATE TABLE IF NOT EXISTS team_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      characters TEXT NOT NULL, -- JSON array of {characterId, role}
      reactions TEXT, -- JSON array
      synergy_notes TEXT,
      rotation TEXT, -- JSON array of steps
      strengths TEXT,
      weaknesses TEXT,
      difficulty TEXT DEFAULT 'Medium',
      source TEXT DEFAULT 'community',
      last_updated TEXT DEFAULT (datetime('now'))
    );

    -- Source tracking
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      source_name TEXT NOT NULL,
      url TEXT,
      license TEXT,
      last_synced TEXT,
      status TEXT DEFAULT 'unknown',
      entities_imported INTEGER DEFAULT 0,
      errors INTEGER DEFAULT 0
    );

    -- Sync logs
    CREATE TABLE IF NOT EXISTS sync_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      action TEXT,
      entities_count INTEGER DEFAULT 0,
      errors_count INTEGER DEFAULT 0,
      error_details TEXT,
      status TEXT DEFAULT 'success',
      duration_ms INTEGER,
      FOREIGN KEY (source_id) REFERENCES sources(id)
    );

    -- Full-text search virtual table
    CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
      entity_id,
      entity_type,
      name,
      keywords,
      content='',
      tokenize='unicode61'
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_characters_vision ON characters(vision);
    CREATE INDEX IF NOT EXISTS idx_characters_weapon ON characters(weapon_type);
    CREATE INDEX IF NOT EXISTS idx_characters_rarity ON characters(rarity);
    CREATE INDEX IF NOT EXISTS idx_characters_nation ON characters(nation);
    CREATE INDEX IF NOT EXISTS idx_weapons_type ON weapons(type);
    CREATE INDEX IF NOT EXISTS idx_weapons_rarity ON weapons(rarity);
    CREATE INDEX IF NOT EXISTS idx_talent_char ON character_talents(character_id);
    CREATE INDEX IF NOT EXISTS idx_const_char ON constellations(character_id);
    CREATE INDEX IF NOT EXISTS idx_passive_char ON passive_talents(character_id);
    CREATE INDEX IF NOT EXISTS idx_ascension_char ON character_ascension_materials(character_id);
    CREATE INDEX IF NOT EXISTS idx_build_char ON build_presets(character_id);
  `);
}

/**
 * Run a query and return all rows.
 */
export function queryAll(sql, params = []) {
  return getDb().prepare(sql).all(...(Array.isArray(params) ? params : [params]));
}

/**
 * Run a query and return first row.
 */
export function queryOne(sql, params = []) {
  return getDb().prepare(sql).get(...(Array.isArray(params) ? params : [params]));
}

/**
 * Run an insert/update/delete statement.
 */
export function execute(sql, params = []) {
  return getDb().prepare(sql).run(...(Array.isArray(params) ? params : [params]));
}

/**
 * Run multiple statements in a transaction.
 */
export function transaction(fn) {
  return getDb().transaction(fn)();
}
