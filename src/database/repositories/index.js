import { queryAll, queryOne } from '../db';

export function getWeapons({ type, rarity, search, sort = 'name', order = 'asc' } = {}) {
  let sql = 'SELECT * FROM weapons WHERE 1=1';
  const params = [];
  if (type) { sql += ' AND type = ?'; params.push(type); }
  if (rarity) { sql += ' AND rarity = ?'; params.push(Number(rarity)); }
  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  const validSorts = ['name', 'rarity', 'type', 'base_attack'];
  const sortCol = validSorts.includes(sort) ? sort : 'name';
  sql += ` ORDER BY ${sortCol} ${order === 'desc' ? 'DESC' : 'ASC'}`;
  return queryAll(sql, params);
}

export function getWeaponById(id) {
  return queryOne('SELECT * FROM weapons WHERE id = ?', [id]);
}

export function getArtifactSets({ search, sort = 'name' } = {}) {
  let sql = 'SELECT * FROM artifact_sets WHERE 1=1';
  const params = [];
  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  sql += ` ORDER BY ${sort === 'max_rarity' ? 'max_rarity DESC' : 'name ASC'}`;
  return queryAll(sql, params);
}

export function getArtifactSetById(id) {
  return queryOne('SELECT * FROM artifact_sets WHERE id = ?', [id]);
}

export function getTeamTemplates() {
  const teams = queryAll('SELECT * FROM team_templates ORDER BY name');
  return teams.map(t => {
    try {
      t.characters = JSON.parse(t.characters || '[]');
      t.reactions = JSON.parse(t.reactions || '[]');
      t.rotation = JSON.parse(t.rotation || '[]');
      t.strengths = JSON.parse(t.strengths || '[]');
      t.weaknesses = JSON.parse(t.weaknesses || '[]');
    } catch { /* keep raw */ }
    return t;
  });
}

export function getTalentBooks() {
  const books = queryAll('SELECT * FROM talent_books ORDER BY book_type, rarity');
  return books.map(b => {
    try { b.availability = JSON.parse(b.availability || '[]'); } catch { b.availability = []; }
    return b;
  });
}

export function getFarmingSchedule(filterDay = null) {
  const rows = queryAll(`
    SELECT DISTINCT 
      tb.book_type, 
      tb.name as book_name, 
      tb.source_domain, 
      tb.availability,
      c.id as char_id, 
      c.name as char_name, 
      c.vision, 
      c.rarity
    FROM talent_books tb
    JOIN talent_book_characters tbc ON tb.book_type = tbc.book_type
    JOIN characters c ON tbc.character_id = c.id
    WHERE tb.rarity = 3
    ORDER BY tb.source_domain, tb.book_type, c.name
  `);

  // Group by domain and book_type
  const groups = {};
  for (const row of rows) {
    let days = [];
    try { days = JSON.parse(row.availability || '[]'); } catch { days = []; }

    if (filterDay && !days.includes(filterDay) && filterDay !== 'Sunday') {
      continue;
    }

    const key = `${row.source_domain}-${row.book_type}`;
    if (!groups[key]) {
      groups[key] = {
        domain: row.source_domain,
        bookType: row.book_type,
        bookName: row.book_name,
        days: days,
        characters: [],
      };
    }

    groups[key].characters.push({
      id: row.char_id,
      name: row.char_name,
      vision: row.vision,
      rarity: row.rarity,
    });
  }

  return Object.values(groups);
}

export function searchEntities(query, limit = 30) {
  if (!query || query.length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();
  let results = [];

  // Try FTS5 search first
  try {
    results = queryAll(
      `SELECT entity_id, entity_type, name, keywords FROM search_index 
       WHERE search_index MATCH ? ORDER BY rank LIMIT ?`,
      [`${cleanQuery}*`, limit]
    );
  } catch {
    results = [];
  }

  // Fallback: direct LIKE query across primary entity tables if FTS returns fewer than 3 results
  if (results.length < 3) {
    const term = `%${cleanQuery}%`;
    const ftsIds = new Set(results.map(r => r.entity_id));

    // Characters
    const chars = queryAll(
      'SELECT id as entity_id, "character" as entity_type, name, (vision || " " || weapon_type || " " || nation) as keywords FROM characters WHERE name LIKE ? OR vision LIKE ? OR weapon_type LIKE ? OR nation LIKE ? LIMIT 10',
      [term, term, term, term]
    );
    for (const c of chars) {
      if (!ftsIds.has(c.entity_id)) {
        results.push(c);
        ftsIds.add(c.entity_id);
      }
    }

    // Weapons
    const weapons = queryAll(
      'SELECT id as entity_id, "weapon" as entity_type, name, type as keywords FROM weapons WHERE name LIKE ? OR type LIKE ? LIMIT 10',
      [term, term]
    );
    for (const w of weapons) {
      if (!ftsIds.has(w.entity_id)) {
        results.push(w);
        ftsIds.add(w.entity_id);
      }
    }

    // Artifact Sets
    const artifacts = queryAll(
      'SELECT id as entity_id, "artifact" as entity_type, name, "artifact" as keywords FROM artifact_sets WHERE name LIKE ? LIMIT 10',
      [term]
    );
    for (const a of artifacts) {
      if (!ftsIds.has(a.entity_id)) {
        results.push(a);
        ftsIds.add(a.entity_id);
      }
    }
  }

  return results.slice(0, limit);
}

export function getSourceHealth() {
  return queryAll('SELECT * FROM sources');
}

export function getSyncLogs(limit = 20) {
  return queryAll('SELECT * FROM sync_logs ORDER BY timestamp DESC LIMIT ?', [limit]);
}
