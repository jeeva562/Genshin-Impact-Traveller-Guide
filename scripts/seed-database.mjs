/**
 * Database seed script.
 * Fetches all data from genshin.jmp.blue, validates, and inserts into SQLite.
 * 
 * Usage: node scripts/seed-database.mjs
 */

const API_BASE = 'https://genshin.jmp.blue';
const RATE_LIMIT_MS = 250;

let lastReq = 0;

async function fetchJson(url) {
  const now = Date.now();
  if (now - lastReq < RATE_LIMIT_MS) {
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS - (now - lastReq)));
  }
  lastReq = Date.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${res.status} ${url}`);
  return res.json();
}

async function main() {
  console.log('🌟 Genshin Guide Database Seeder');
  console.log('================================\n');

  // Dynamic import for ESM compatibility
  const Database = (await import('better-sqlite3')).default;
  const path = await import('path');
  const fs = await import('fs');

  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const dbPath = path.join(dbDir, 'genshin-guide.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  console.log('📦 Initializing database schema...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, title TEXT, vision TEXT,
      weapon_type TEXT, rarity INTEGER DEFAULT 4, nation TEXT, affiliation TEXT,
      description TEXT, constellation_name TEXT, birthday TEXT, release_date TEXT,
      gender TEXT, vision_key TEXT, weapon_type_key TEXT,
      source TEXT DEFAULT 'genshin-api', last_updated TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS character_talents (
      id INTEGER PRIMARY KEY AUTOINCREMENT, character_id TEXT NOT NULL,
      name TEXT NOT NULL, type TEXT NOT NULL, unlock TEXT, description TEXT, sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );
    CREATE TABLE IF NOT EXISTS talent_upgrades (
      id INTEGER PRIMARY KEY AUTOINCREMENT, talent_id INTEGER NOT NULL,
      name TEXT NOT NULL, value TEXT,
      FOREIGN KEY (talent_id) REFERENCES character_talents(id)
    );
    CREATE TABLE IF NOT EXISTS passive_talents (
      id INTEGER PRIMARY KEY AUTOINCREMENT, character_id TEXT NOT NULL,
      name TEXT NOT NULL, description TEXT, unlock TEXT, level INTEGER,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );
    CREATE TABLE IF NOT EXISTS constellations (
      id INTEGER PRIMARY KEY AUTOINCREMENT, character_id TEXT NOT NULL,
      name TEXT NOT NULL, level INTEGER NOT NULL, unlock TEXT, description TEXT,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );
    CREATE TABLE IF NOT EXISTS character_ascension_materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT, character_id TEXT NOT NULL,
      ascension_level TEXT NOT NULL, material_name TEXT NOT NULL, quantity INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );
    CREATE TABLE IF NOT EXISTS weapons (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, rarity INTEGER DEFAULT 3,
      base_attack INTEGER, sub_stat TEXT, passive_name TEXT, passive_desc TEXT,
      location TEXT, ascension_material TEXT,
      source TEXT DEFAULT 'genshin-api', last_updated TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS artifact_sets (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, max_rarity INTEGER DEFAULT 5,
      two_piece_bonus TEXT, four_piece_bonus TEXT,
      source TEXT DEFAULT 'genshin-api', last_updated TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS talent_books (
      id TEXT PRIMARY KEY, book_type TEXT NOT NULL, name TEXT NOT NULL,
      rarity INTEGER, source_domain TEXT, availability TEXT
    );
    CREATE TABLE IF NOT EXISTS talent_book_characters (
      book_type TEXT NOT NULL, character_id TEXT NOT NULL,
      PRIMARY KEY (book_type, character_id)
    );
    CREATE TABLE IF NOT EXISTS build_presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT, character_id TEXT NOT NULL,
      preset_name TEXT DEFAULT 'Best Overall', preset_type TEXT DEFAULT 'general',
      weapon_ids TEXT, artifact_set_ids TEXT, artifact_sets_config TEXT,
      main_stats TEXT, sub_stats TEXT, stat_targets TEXT, talent_priority TEXT,
      constellation_notes TEXT, role TEXT, notes TEXT,
      confidence TEXT DEFAULT 'Medium', source TEXT DEFAULT 'community',
      last_updated TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );
    CREATE TABLE IF NOT EXISTS team_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      characters TEXT NOT NULL, reactions TEXT, synergy_notes TEXT,
      rotation TEXT, strengths TEXT, weaknesses TEXT,
      difficulty TEXT DEFAULT 'Medium', source TEXT DEFAULT 'community',
      last_updated TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY, source_name TEXT NOT NULL, url TEXT,
      license TEXT, last_synced TEXT, status TEXT DEFAULT 'unknown',
      entities_imported INTEGER DEFAULT 0, errors INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS sync_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, source_id TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')), action TEXT,
      entities_count INTEGER DEFAULT 0, errors_count INTEGER DEFAULT 0,
      error_details TEXT, status TEXT DEFAULT 'success', duration_ms INTEGER,
      FOREIGN KEY (source_id) REFERENCES sources(id)
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
      entity_id, entity_type, name, keywords, content='', tokenize='unicode61'
    );
    CREATE INDEX IF NOT EXISTS idx_char_vision ON characters(vision);
    CREATE INDEX IF NOT EXISTS idx_char_weapon ON characters(weapon_type);
    CREATE INDEX IF NOT EXISTS idx_char_rarity ON characters(rarity);
    CREATE INDEX IF NOT EXISTS idx_char_nation ON characters(nation);
    CREATE INDEX IF NOT EXISTS idx_weap_type ON weapons(type);
    CREATE INDEX IF NOT EXISTS idx_weap_rarity ON weapons(rarity);
    CREATE INDEX IF NOT EXISTS idx_talent_char ON character_talents(character_id);
    CREATE INDEX IF NOT EXISTS idx_build_char ON build_presets(character_id);
  `);

  // Register source
  db.prepare(`INSERT OR REPLACE INTO sources (id, source_name, url, license, status)
    VALUES ('genshin-api', 'Genshin API (genshin.jmp.blue)', 'https://genshin.jmp.blue', 'MIT', 'syncing')`).run();

  const startTime = Date.now();
  let totalChars = 0, totalWeapons = 0, totalArtifacts = 0, totalErrors = 0;

  // ====== CHARACTERS ======
  console.log('\n👤 Fetching characters...');
  const charIds = await fetchJson(`${API_BASE}/characters`);
  console.log(`   Found ${charIds.length} characters`);

  const insertChar = db.prepare(`INSERT OR REPLACE INTO characters 
    (id, name, title, vision, weapon_type, rarity, nation, affiliation, description,
     constellation_name, birthday, release_date, gender, vision_key, weapon_type_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertTalent = db.prepare(`INSERT INTO character_talents (character_id, name, type, unlock, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)`);
  const insertUpgrade = db.prepare(`INSERT INTO talent_upgrades (talent_id, name, value)
    VALUES (?, ?, ?)`);
  const insertPassive = db.prepare(`INSERT INTO passive_talents (character_id, name, description, unlock, level)
    VALUES (?, ?, ?, ?, ?)`);
  const insertConst = db.prepare(`INSERT INTO constellations (character_id, name, level, unlock, description)
    VALUES (?, ?, ?, ?, ?)`);
  const insertAscMat = db.prepare(`INSERT INTO character_ascension_materials (character_id, ascension_level, material_name, quantity)
    VALUES (?, ?, ?, ?)`);
  const insertSearch = db.prepare(`INSERT INTO search_index (entity_id, entity_type, name, keywords)
    VALUES (?, ?, ?, ?)`);

  // Clear existing character-related data for clean reseed
  db.exec(`DELETE FROM talent_upgrades WHERE talent_id IN (SELECT id FROM character_talents);
    DELETE FROM character_talents; DELETE FROM passive_talents; DELETE FROM constellations;
    DELETE FROM character_ascension_materials; DELETE FROM search_index;`);

  for (const charId of charIds) {
    try {
      const data = await fetchJson(`${API_BASE}/characters/${charId}`);
      if (!data || !data.name) { totalErrors++; continue; }

      const vision = normVision(data.vision);
      const weaponType = normWeapon(data.weapon);

      insertChar.run(
        data.id || charId, data.name, data.title || null, vision, weaponType,
        data.rarity || 4, data.nation || null, data.affiliation || null,
        data.description || null, data.constellation || null,
        data.birthday || null, data.release || null, data.gender || null,
        data.vision_key || null, data.weapon_type || null
      );

      // Talents
      (data.skillTalents || []).forEach((t, i) => {
        const type = t.type || inferType(t.unlock);
        const result = insertTalent.run(charId, t.name, type, t.unlock, t.description, i);
        const talentId = result.lastInsertRowid;
        (t.upgrades || []).forEach(u => {
          insertUpgrade.run(talentId, u.name, u.value);
        });
      });

      // Passives
      (data.passiveTalents || []).forEach(p => {
        insertPassive.run(charId, p.name, p.description, p.unlock, p.level || null);
      });

      // Constellations
      (data.constellations || []).forEach(c => {
        insertConst.run(charId, c.name, c.level, c.unlock, c.description);
      });

      // Ascension materials
      if (data.ascension_materials) {
        for (const [level, items] of Object.entries(data.ascension_materials)) {
          if (Array.isArray(items)) {
            items.forEach(item => {
              insertAscMat.run(charId, level, item.name, item.value || 0);
            });
          }
        }
      }

      // Search index
      const keywords = [data.name, vision, weaponType, data.nation, data.title].filter(Boolean).join(' ');
      insertSearch.run(charId, 'character', data.name, keywords);

      totalChars++;
      if (totalChars % 10 === 0) process.stdout.write(`   ${totalChars}/${charIds.length}\r`);
    } catch (err) {
      console.error(`   ❌ Error fetching ${charId}: ${err.message}`);
      totalErrors++;
    }
  }
  console.log(`   ✅ Imported ${totalChars} characters`);

  // ====== WEAPONS ======
  console.log('\n⚔️  Fetching weapons...');
  const weaponIds = await fetchJson(`${API_BASE}/weapons`);
  console.log(`   Found ${weaponIds.length} weapons`);

  const insertWeapon = db.prepare(`INSERT OR REPLACE INTO weapons 
    (id, name, type, rarity, base_attack, sub_stat, passive_name, passive_desc, location, ascension_material)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  for (const wId of weaponIds) {
    try {
      const data = await fetchJson(`${API_BASE}/weapons/${wId}`);
      if (!data || !data.name) { totalErrors++; continue; }

      insertWeapon.run(
        data.id || wId, data.name, normWeapon(data.type), data.rarity || 3,
        data.baseAttack || null, data.subStat || null,
        data.passiveName || null, data.passiveDesc || null,
        data.location || null, data.ascensionMaterial || null
      );

      insertSearch.run(wId, 'weapon', data.name,
        [data.name, normWeapon(data.type), data.subStat, data.rarity + '★'].filter(Boolean).join(' '));

      totalWeapons++;
      if (totalWeapons % 20 === 0) process.stdout.write(`   ${totalWeapons}/${weaponIds.length}\r`);
    } catch (err) {
      console.error(`   ❌ Error fetching weapon ${wId}: ${err.message}`);
      totalErrors++;
    }
  }
  console.log(`   ✅ Imported ${totalWeapons} weapons`);

  // ====== ARTIFACTS ======
  console.log('\n🏵️  Fetching artifacts...');
  const artIds = await fetchJson(`${API_BASE}/artifacts`);
  console.log(`   Found ${artIds.length} artifact sets`);

  const insertArt = db.prepare(`INSERT OR REPLACE INTO artifact_sets 
    (id, name, max_rarity, two_piece_bonus, four_piece_bonus)
    VALUES (?, ?, ?, ?, ?)`);

  for (const aId of artIds) {
    try {
      const data = await fetchJson(`${API_BASE}/artifacts/${aId}`);
      if (!data || !data.name) { totalErrors++; continue; }

      insertArt.run(
        data.id || aId, data.name, data.max_rarity || 5,
        data['2-piece_bonus'] || null, data['4-piece_bonus'] || null
      );

      insertSearch.run(aId, 'artifact', data.name,
        [data.name, 'artifact set'].join(' '));

      totalArtifacts++;
    } catch (err) {
      console.error(`   ❌ Error fetching artifact ${aId}: ${err.message}`);
      totalErrors++;
    }
  }
  console.log(`   ✅ Imported ${totalArtifacts} artifact sets`);

  // ====== TALENT BOOKS ======
  console.log('\n📚 Fetching talent books...');
  try {
    const books = await fetchJson(`${API_BASE}/materials/talent-book`);
    db.exec(`DELETE FROM talent_books; DELETE FROM talent_book_characters;`);

    const insertBook = db.prepare(`INSERT OR REPLACE INTO talent_books (id, book_type, name, rarity, source_domain, availability) VALUES (?, ?, ?, ?, ?, ?)`);
    const insertBookChar = db.prepare(`INSERT OR REPLACE INTO talent_book_characters (book_type, character_id) VALUES (?, ?)`);

    let bookCount = 0;
    for (const [bookType, bookData] of Object.entries(books)) {
      if (bookType === 'id') continue;
      if (bookData.items) {
        bookData.items.forEach(item => {
          insertBook.run(item.id, bookType, item.name, item.rarity || 2, bookData.source || null,
            JSON.stringify(bookData.availability || []));
        });
      }
      if (bookData.characters) {
        bookData.characters.forEach(charId => {
          insertBookChar.run(bookType, charId);
        });
      }
      bookCount++;
    }
    console.log(`   ✅ Imported ${bookCount} talent book types`);
  } catch (err) {
    console.error(`   ❌ Error fetching talent books: ${err.message}`);
    totalErrors++;
  }

  // ====== BUILD PRESETS (Community Recommendations) ======
  console.log('\n🔧 Seeding build recommendation data...');
  seedBuildPresets(db);
  console.log('   ✅ Seeded build presets');

  // ====== TEAM TEMPLATES ======
  console.log('\n👥 Seeding team templates...');
  seedTeamTemplates(db);
  console.log('   ✅ Seeded team templates');

  // Update source record
  const elapsed = Date.now() - startTime;
  db.prepare(`UPDATE sources SET last_synced = datetime('now'), status = 'healthy',
    entities_imported = ?, errors = ? WHERE id = 'genshin-api'`)
    .run(totalChars + totalWeapons + totalArtifacts, totalErrors);

  db.prepare(`INSERT INTO sync_logs (source_id, action, entities_count, errors_count, status, duration_ms)
    VALUES ('genshin-api', 'full-seed', ?, ?, ?, ?)`)
    .run(totalChars + totalWeapons + totalArtifacts, totalErrors,
      totalErrors > 0 ? 'partial' : 'success', elapsed);

  console.log('\n================================');
  console.log(`✨ Seed complete in ${(elapsed / 1000).toFixed(1)}s`);
  console.log(`   Characters: ${totalChars}`);
  console.log(`   Weapons:    ${totalWeapons}`);
  console.log(`   Artifacts:  ${totalArtifacts}`);
  console.log(`   Errors:     ${totalErrors}`);
  console.log(`   DB Path:    ${dbPath}`);

  db.close();
}

// ============================================================
// BUILD PRESETS — Community consensus recommendations
// ============================================================
function seedBuildPresets(db) {
  const insert = db.prepare(`INSERT OR REPLACE INTO build_presets 
    (character_id, preset_name, preset_type, weapon_ids, artifact_set_ids, 
     main_stats, sub_stats, stat_targets, talent_priority, role, notes, confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const presets = [
    {
      character_id: 'hu-tao', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['staff-of-homa', 'dragons-bane', 'deathmatch', 'blackcliff-pole', 'white-tassel']),
      artifact_set_ids: JSON.stringify(['crimson-witch-of-flames', 'shimenawa-s-reminiscence']),
      main_stats: JSON.stringify({ sands: 'HP%', goblet: 'Pyro DMG Bonus', circlet: 'CRIT DMG' }),
      sub_stats: JSON.stringify(['CRIT DMG', 'CRIT Rate', 'HP%', 'Elemental Mastery', 'ATK%']),
      stat_targets: JSON.stringify({ cr: { min: 50, good: 60, excellent: 70 }, cd: { min: 150, good: 200, excellent: 250 }, hp: { min: 25000, good: 30000, excellent: 35000 } }),
      talent_priority: JSON.stringify(['Elemental Skill', 'Normal Attack', 'Elemental Burst']),
      role: 'Main DPS',
      notes: 'Hu Tao excels as a Pyro Main DPS who scales heavily with HP. Staff of Homa is her signature weapon. Crimson Witch 4pc maximizes Vaporize/Melt reactions. Dragon\'s Bane is an excellent 4★ alternative for Vaporize teams.',
      confidence: 'High',
    },
    {
      character_id: 'raiden', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['engulfing-lightning', 'the-catch', 'staff-of-homa', 'skyward-spine', 'favonius-lance']),
      artifact_set_ids: JSON.stringify(['emblem-of-severed-fate']),
      main_stats: JSON.stringify({ sands: 'Energy Recharge / ATK%', goblet: 'Electro DMG Bonus', circlet: 'CRIT Rate / CRIT DMG' }),
      sub_stats: JSON.stringify(['CRIT Rate', 'CRIT DMG', 'Energy Recharge', 'ATK%']),
      stat_targets: JSON.stringify({ cr: { min: 50, good: 60, excellent: 70 }, cd: { min: 100, good: 130, excellent: 160 }, er: { min: 200, good: 250, excellent: 280 } }),
      talent_priority: JSON.stringify(['Elemental Burst', 'Elemental Skill', 'Normal Attack']),
      role: 'Sub DPS / Support',
      notes: 'Raiden Shogun provides energy regeneration for the team while dealing significant Burst damage. Emblem of Severed Fate 4pc is her best set as it converts her high ER into Burst DMG. The Catch (F2P) is nearly as good as her signature weapon.',
      confidence: 'High',
    },
    {
      character_id: 'ganyu', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['amos-bow', 'aqua-simulacra', 'prototype-crescent', 'hamayumi', 'blackcliff-warbow']),
      artifact_set_ids: JSON.stringify(['blizzard-strayer', 'wanderer-s-troupe']),
      main_stats: JSON.stringify({ sands: 'ATK%', goblet: 'Cryo DMG Bonus', circlet: 'CRIT DMG' }),
      sub_stats: JSON.stringify(['CRIT DMG', 'ATK%', 'CRIT Rate', 'Energy Recharge']),
      stat_targets: JSON.stringify({ cr: { min: 20, good: 30, excellent: 40 }, cd: { min: 180, good: 220, excellent: 260 } }),
      talent_priority: JSON.stringify(['Normal Attack', 'Elemental Burst', 'Elemental Skill']),
      role: 'Main DPS',
      notes: 'Ganyu is a premier Cryo DPS. In Freeze teams, use Blizzard Strayer 4pc (allows low CRIT Rate due to set bonus). In Melt teams, use Wanderer\'s Troupe 4pc. Amos\' Bow is best-in-slot for Charged Attack playstyle.',
      confidence: 'High',
    },
    {
      character_id: 'bennett', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['mistsplitter-reforged', 'aquila-favonia', 'skyward-blade', 'sacrificial-sword', 'favonius-sword', 'prototype-rancour']),
      artifact_set_ids: JSON.stringify(['noblesse-oblige']),
      main_stats: JSON.stringify({ sands: 'Energy Recharge', goblet: 'HP%', circlet: 'Healing Bonus / HP%' }),
      sub_stats: JSON.stringify(['Energy Recharge', 'HP%', 'HP', 'CRIT Rate']),
      stat_targets: JSON.stringify({ er: { min: 180, good: 200, excellent: 230 } }),
      talent_priority: JSON.stringify(['Elemental Burst', 'Elemental Skill', 'Normal Attack']),
      role: 'Support / Healer',
      notes: 'Bennett is widely considered the best support in Genshin Impact. Noblesse Oblige 4pc provides an additional ATK buff. His Burst provides healing and a massive ATK buff based on his Base ATK (character + weapon only). Use the highest Base ATK sword available.',
      confidence: 'High',
    },
    {
      character_id: 'xingqiu', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['primordial-jade-cutter', 'sacrificial-sword', 'favonius-sword', 'harbinger-of-dawn', 'iron-sting']),
      artifact_set_ids: JSON.stringify(['emblem-of-severed-fate', 'noblesse-oblige']),
      main_stats: JSON.stringify({ sands: 'Energy Recharge / ATK%', goblet: 'Hydro DMG Bonus', circlet: 'CRIT Rate / CRIT DMG' }),
      sub_stats: JSON.stringify(['CRIT Rate', 'CRIT DMG', 'Energy Recharge', 'ATK%']),
      stat_targets: JSON.stringify({ er: { min: 160, good: 180, excellent: 200 }, cr: { min: 50, good: 60, excellent: 70 } }),
      talent_priority: JSON.stringify(['Elemental Burst', 'Elemental Skill', 'Normal Attack']),
      role: 'Sub DPS',
      notes: 'Xingqiu provides off-field Hydro application and damage through his Burst. Sacrificial Sword is ideal for energy generation. Emblem 4pc maximizes his Burst damage.',
      confidence: 'High',
    },
    {
      character_id: 'xiangling', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['staff-of-homa', 'the-catch', 'dragons-bane', 'favonius-lance', 'kitain-cross-spear']),
      artifact_set_ids: JSON.stringify(['emblem-of-severed-fate', 'crimson-witch-of-flames']),
      main_stats: JSON.stringify({ sands: 'Energy Recharge / ATK%', goblet: 'Pyro DMG Bonus', circlet: 'CRIT Rate / CRIT DMG' }),
      sub_stats: JSON.stringify(['CRIT Rate', 'CRIT DMG', 'Energy Recharge', 'ATK%', 'Elemental Mastery']),
      stat_targets: JSON.stringify({ er: { min: 160, good: 180, excellent: 200 }, cr: { min: 50, good: 60, excellent: 70 } }),
      talent_priority: JSON.stringify(['Elemental Burst', 'Elemental Skill', 'Normal Attack']),
      role: 'Sub DPS',
      notes: 'Xiangling\'s Pyronado is one of the strongest off-field damage abilities. The Catch (free from fishing) is an excellent weapon. She needs high Energy Recharge unless paired with Bennett.',
      confidence: 'High',
    },
    {
      character_id: 'zhongli', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['staff-of-homa', 'vortex-vanquisher', 'black-tassel', 'favonius-lance', 'deathmatch']),
      artifact_set_ids: JSON.stringify(['tenacity-of-the-millelith', 'archaic-petra']),
      main_stats: JSON.stringify({ sands: 'HP%', goblet: 'HP%', circlet: 'HP%' }),
      sub_stats: JSON.stringify(['HP%', 'HP', 'Energy Recharge', 'CRIT Rate']),
      stat_targets: JSON.stringify({ hp: { min: 40000, good: 50000, excellent: 55000 } }),
      talent_priority: JSON.stringify(['Elemental Skill', 'Elemental Burst', 'Normal Attack']),
      role: 'Shielder / Support',
      notes: 'Zhongli provides the strongest shield in the game, scaling with HP. Tenacity of the Millelith 4pc provides ATK buff when his Skill\'s Stone Stele hits enemies. Black Tassel (3★) is his best F2P shielder weapon.',
      confidence: 'High',
    },
    {
      character_id: 'kazuha', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['freedom-sworn', 'iron-sting', 'favonius-sword', 'sacrificial-sword', 'xiphos-moonlight']),
      artifact_set_ids: JSON.stringify(['viridescent-venerer']),
      main_stats: JSON.stringify({ sands: 'Elemental Mastery', goblet: 'Elemental Mastery', circlet: 'Elemental Mastery' }),
      sub_stats: JSON.stringify(['Elemental Mastery', 'Energy Recharge', 'CRIT Rate', 'CRIT DMG']),
      stat_targets: JSON.stringify({ em: { min: 700, good: 850, excellent: 1000 }, er: { min: 140, good: 160, excellent: 180 } }),
      talent_priority: JSON.stringify(['Elemental Skill', 'Elemental Burst', 'Normal Attack']),
      role: 'Support / Buffer',
      notes: 'Kazuha provides elemental DMG% bonus based on his EM through his passive. Full EM build maximizes team damage. Viridescent Venerer 4pc is mandatory for the 40% resistance shred. Iron Sting is an excellent craftable option.',
      confidence: 'High',
    },
    {
      character_id: 'nahida', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['a-thousand-floating-dreams', 'kagura-s-verity', 'sacrificial-fragments', 'magic-guide', 'mappa-mare']),
      artifact_set_ids: JSON.stringify(['deepwood-memories', 'gilded-dreams']),
      main_stats: JSON.stringify({ sands: 'Elemental Mastery', goblet: 'Dendro DMG Bonus', circlet: 'CRIT Rate / CRIT DMG' }),
      sub_stats: JSON.stringify(['CRIT Rate', 'CRIT DMG', 'Elemental Mastery', 'ATK%']),
      stat_targets: JSON.stringify({ em: { min: 600, good: 800, excellent: 1000 }, cr: { min: 50, good: 60, excellent: 70 } }),
      talent_priority: JSON.stringify(['Elemental Skill', 'Elemental Burst', 'Normal Attack']),
      role: 'Sub DPS / Support',
      notes: 'Nahida is the premier Dendro enabler. Use Deepwood 4pc if no one else has it, otherwise use Gilded Dreams 4pc. A Thousand Floating Dreams is her signature. Magic Guide (3★) is surprisingly effective as a budget option.',
      confidence: 'High',
    },
    {
      character_id: 'furina', preset_name: 'Best Overall', preset_type: 'general',
      weapon_ids: JSON.stringify(['splendor-of-tranquil-waters', 'festering-desire', 'favonius-sword', 'fleuve-cendre-ferryman', 'sacrificial-sword']),
      artifact_set_ids: JSON.stringify(['golden-troupe']),
      main_stats: JSON.stringify({ sands: 'HP%', goblet: 'HP%', circlet: 'CRIT Rate / CRIT DMG' }),
      sub_stats: JSON.stringify(['CRIT Rate', 'CRIT DMG', 'HP%', 'Energy Recharge']),
      stat_targets: JSON.stringify({ hp: { min: 35000, good: 40000, excellent: 45000 }, er: { min: 140, good: 160, excellent: 180 } }),
      talent_priority: JSON.stringify(['Elemental Skill', 'Elemental Burst', 'Normal Attack']),
      role: 'Sub DPS / Buffer',
      notes: 'Furina provides massive team damage bonus through Fanfare stacks. Her Skill summons provide off-field Hydro application. Golden Troupe 4pc is her best-in-slot as her damage comes from her Skill summons.',
      confidence: 'High',
    },
  ];

  db.exec(`DELETE FROM build_presets;`);
  for (const p of presets) {
    insert.run(p.character_id, p.preset_name, p.preset_type, p.weapon_ids,
      p.artifact_set_ids, p.main_stats, p.sub_stats, p.stat_targets,
      p.talent_priority, p.role, p.notes, p.confidence);
  }
}

// ============================================================
// TEAM TEMPLATES
// ============================================================
function seedTeamTemplates(db) {
  const insert = db.prepare(`INSERT INTO team_templates 
    (name, characters, reactions, synergy_notes, rotation, strengths, weaknesses, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  db.exec(`DELETE FROM team_templates;`);

  const teams = [
    {
      name: 'National Team',
      characters: JSON.stringify([
        { characterId: 'xiangling', role: 'Sub DPS' },
        { characterId: 'xingqiu', role: 'Sub DPS' },
        { characterId: 'bennett', role: 'Support / Healer' },
        { characterId: 'sucrose', role: 'Support' },
      ]),
      reactions: JSON.stringify(['Vaporize', 'Swirl']),
      synergy_notes: 'The classic National team. Bennett provides ATK buff and energy for Xiangling. Xingqiu provides off-field Hydro for Vaporize. Sucrose provides EM buff and VV shred.',
      rotation: JSON.stringify([
        { step: 1, character: 'Bennett', action: 'Elemental Skill → Elemental Burst' },
        { step: 2, character: 'Xingqiu', action: 'Elemental Skill → Elemental Burst' },
        { step: 3, character: 'Sucrose', action: 'Elemental Skill (Swirl Pyro)' },
        { step: 4, character: 'Xiangling', action: 'Elemental Burst → Elemental Skill → Normal Attacks' },
      ]),
      strengths: JSON.stringify(['Very high damage', 'All 4★ characters', 'Accessible', 'Strong reactions']),
      weaknesses: JSON.stringify(['No shielder', 'Bennett circle restricts movement', 'High energy requirements']),
      difficulty: 'Medium',
    },
    {
      name: 'Hu Tao Vaporize',
      characters: JSON.stringify([
        { characterId: 'hu-tao', role: 'Main DPS' },
        { characterId: 'xingqiu', role: 'Sub DPS' },
        { characterId: 'zhongli', role: 'Shielder' },
        { characterId: 'albedo', role: 'Sub DPS' },
      ]),
      reactions: JSON.stringify(['Vaporize', 'Crystallize']),
      synergy_notes: 'Hu Tao Vaporizes with Xingqiu\'s rain swords. Zhongli provides shield and resistance shred. Albedo provides off-field Geo damage and EM from Crystallize.',
      rotation: JSON.stringify([
        { step: 1, character: 'Zhongli', action: 'Hold Elemental Skill (Shield)' },
        { step: 2, character: 'Albedo', action: 'Elemental Skill (Solar Isotoma)' },
        { step: 3, character: 'Xingqiu', action: 'Elemental Skill → Elemental Burst' },
        { step: 4, character: 'Hu Tao', action: 'Elemental Skill → Charged Attacks → Elemental Burst' },
      ]),
      strengths: JSON.stringify(['Very high single target damage', 'Strong shield', 'Consistent Vaporize']),
      weaknesses: JSON.stringify(['Requires 5★ characters', 'Stamina management', 'Weak AoE']),
      difficulty: 'Medium',
    },
    {
      name: 'Freeze (Morgana)',
      characters: JSON.stringify([
        { characterId: 'ganyu', role: 'Main DPS' },
        { characterId: 'mona', role: 'Sub DPS' },
        { characterId: 'venti', role: 'Support' },
        { characterId: 'diona', role: 'Healer / Shielder' },
      ]),
      reactions: JSON.stringify(['Freeze', 'Swirl']),
      synergy_notes: 'Ganyu provides Cryo DPS and application. Mona extends Freeze duration and provides Omen DMG bonus. Venti groups enemies. Diona provides Cryo resonance, shield, and healing.',
      rotation: JSON.stringify([
        { step: 1, character: 'Diona', action: 'Hold Elemental Skill → Elemental Burst' },
        { step: 2, character: 'Venti', action: 'Elemental Burst (absorb Cryo)' },
        { step: 3, character: 'Mona', action: 'Elemental Burst → Elemental Skill' },
        { step: 4, character: 'Ganyu', action: 'Elemental Burst → Charged Attacks' },
      ]),
      strengths: JSON.stringify(['Excellent crowd control', 'Enemies permanently frozen', 'Good AoE']),
      weaknesses: JSON.stringify(['Weak vs. bosses that can\'t be frozen', 'Multiple 5★ required']),
      difficulty: 'Medium',
    },
    {
      name: 'Raiden National',
      characters: JSON.stringify([
        { characterId: 'raiden', role: 'Main DPS / Battery' },
        { characterId: 'xiangling', role: 'Sub DPS' },
        { characterId: 'xingqiu', role: 'Sub DPS' },
        { characterId: 'bennett', role: 'Support / Healer' },
      ]),
      reactions: JSON.stringify(['Vaporize', 'Overloaded', 'Electro-Charged']),
      synergy_notes: 'Raiden provides energy for the entire team while dealing burst damage. The National core (Xiangling/Xingqiu/Bennett) provides strong off-field damage and reactions.',
      rotation: JSON.stringify([
        { step: 1, character: 'Raiden', action: 'Elemental Skill' },
        { step: 2, character: 'Bennett', action: 'Elemental Skill → Elemental Burst' },
        { step: 3, character: 'Xingqiu', action: 'Elemental Skill → Elemental Burst' },
        { step: 4, character: 'Xiangling', action: 'Elemental Burst → Elemental Skill' },
        { step: 5, character: 'Raiden', action: 'Elemental Burst → Normal Attacks (during Burst)' },
      ]),
      strengths: JSON.stringify(['Excellent energy economy', 'Very high damage', 'Easy rotation', 'Strong reactions']),
      weaknesses: JSON.stringify(['Uses Bennett (locks him)', 'Overloaded can knock enemies away']),
      difficulty: 'Easy',
    },
  ];

  for (const t of teams) {
    insert.run(t.name, t.characters, t.reactions, t.synergy_notes, t.rotation, t.strengths, t.weaknesses, t.difficulty);
  }
}

// Helpers
function normVision(v) {
  if (!v) return null;
  const m = { PYRO:'Pyro', HYDRO:'Hydro', ANEMO:'Anemo', ELECTRO:'Electro', DENDRO:'Dendro', CRYO:'Cryo', GEO:'Geo' };
  return m[v.toUpperCase()] || v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
}
function normWeapon(w) {
  if (!w) return null;
  const m = { SWORD:'Sword', CLAYMORE:'Claymore', POLEARM:'Polearm', BOW:'Bow', CATALYST:'Catalyst' };
  return m[w.toUpperCase()] || w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}
function inferType(unlock) {
  if (!unlock) return 'NORMAL_ATTACK';
  const l = unlock.toLowerCase();
  if (l.includes('skill')) return 'ELEMENTAL_SKILL';
  if (l.includes('burst')) return 'ELEMENTAL_BURST';
  return 'NORMAL_ATTACK';
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
