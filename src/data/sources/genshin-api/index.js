/**
 * Genshin API (genshin.jmp.blue) source adapter.
 * MIT licensed community API — rate limits apply.
 * 
 * This adapter fetches, validates, and normalizes data from the API.
 */

import { API_BASE_URL, API_RATE_LIMIT_MS } from '@/lib/constants';
import { sleep } from '@/lib/utils';

let lastRequestTime = 0;

/**
 * Rate-limited fetch wrapper.
 */
async function rateLimitedFetch(url) {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < API_RATE_LIMIT_MS) {
    await sleep(API_RATE_LIMIT_MS - elapsed);
  }
  lastRequestTime = Date.now();

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText} for ${url}`);
  }

  return response.json();
}

/**
 * Fetch the list of all character IDs.
 */
export async function fetchCharacterList() {
  return rateLimitedFetch(`${API_BASE_URL}/characters`);
}

/**
 * Fetch full character data by ID.
 */
export async function fetchCharacter(id) {
  const data = await rateLimitedFetch(`${API_BASE_URL}/characters/${id}`);
  return normalizeCharacter(id, data);
}

/**
 * Fetch all weapon IDs.
 */
export async function fetchWeaponList() {
  return rateLimitedFetch(`${API_BASE_URL}/weapons`);
}

/**
 * Fetch full weapon data by ID.
 */
export async function fetchWeapon(id) {
  const data = await rateLimitedFetch(`${API_BASE_URL}/weapons/${id}`);
  return normalizeWeapon(id, data);
}

/**
 * Fetch all artifact set IDs.
 */
export async function fetchArtifactList() {
  return rateLimitedFetch(`${API_BASE_URL}/artifacts`);
}

/**
 * Fetch artifact set data by ID.
 */
export async function fetchArtifact(id) {
  const data = await rateLimitedFetch(`${API_BASE_URL}/artifacts/${id}`);
  return normalizeArtifact(id, data);
}

/**
 * Fetch talent book data.
 */
export async function fetchTalentBooks() {
  return rateLimitedFetch(`${API_BASE_URL}/materials/talent-book`);
}

/**
 * Fetch domain data.
 */
export async function fetchDomains() {
  return rateLimitedFetch(`${API_BASE_URL}/domains`);
}

/**
 * Fetch enemy data.
 */
export async function fetchEnemies() {
  return rateLimitedFetch(`${API_BASE_URL}/enemies`);
}

/**
 * Fetch nation data.
 */
export async function fetchNations() {
  return rateLimitedFetch(`${API_BASE_URL}/nations`);
}

// ============================================================
// NORMALIZERS
// ============================================================

function normalizeCharacter(id, data) {
  if (!data || !data.name) {
    return { valid: false, error: `Invalid character data for ${id}`, data: null };
  }

  return {
    valid: true,
    error: null,
    data: {
      id: data.id || id,
      name: data.name,
      title: data.title || null,
      vision: normalizeVisionStr(data.vision),
      weapon_type: normalizeWeaponStr(data.weapon),
      rarity: data.rarity || 4,
      nation: data.nation || null,
      affiliation: data.affiliation || null,
      description: data.description || null,
      constellation_name: data.constellation || null,
      birthday: data.birthday || null,
      release_date: data.release || null,
      gender: data.gender || null,
      vision_key: data.vision_key || null,
      weapon_type_key: data.weapon_type || null,
      talents: (data.skillTalents || []).map((t, i) => ({
        name: t.name,
        type: t.type || inferTalentType(t.unlock),
        unlock: t.unlock,
        description: t.description,
        sort_order: i,
        upgrades: (t.upgrades || []).map((u) => ({
          name: u.name,
          value: u.value,
        })),
      })),
      passives: (data.passiveTalents || []).map((p) => ({
        name: p.name,
        description: p.description,
        unlock: p.unlock,
        level: p.level || null,
      })),
      constellations: (data.constellations || []).map((c) => ({
        name: c.name,
        level: c.level,
        unlock: c.unlock,
        description: c.description,
      })),
      ascension_materials: normalizeAscensionMaterials(data.ascension_materials),
    },
  };
}

function normalizeWeapon(id, data) {
  if (!data || !data.name) {
    return { valid: false, error: `Invalid weapon data for ${id}`, data: null };
  }

  return {
    valid: true,
    error: null,
    data: {
      id: data.id || id,
      name: data.name,
      type: normalizeWeaponStr(data.type),
      rarity: data.rarity || 3,
      base_attack: data.baseAttack || null,
      sub_stat: data.subStat || null,
      passive_name: data.passiveName || null,
      passive_desc: data.passiveDesc || null,
      location: data.location || null,
      ascension_material: data.ascensionMaterial || null,
    },
  };
}

function normalizeArtifact(id, data) {
  if (!data || !data.name) {
    return { valid: false, error: `Invalid artifact data for ${id}`, data: null };
  }

  return {
    valid: true,
    error: null,
    data: {
      id: data.id || id,
      name: data.name,
      max_rarity: data.max_rarity || 5,
      two_piece_bonus: data['2-piece_bonus'] || null,
      four_piece_bonus: data['4-piece_bonus'] || null,
    },
  };
}

function normalizeAscensionMaterials(mats) {
  if (!mats) return [];
  const result = [];
  for (const [level, items] of Object.entries(mats)) {
    if (Array.isArray(items)) {
      for (const item of items) {
        result.push({
          ascension_level: level,
          material_name: item.name,
          quantity: item.value || 0,
        });
      }
    }
  }
  return result;
}

function normalizeVisionStr(vision) {
  if (!vision) return null;
  const map = { PYRO: 'Pyro', HYDRO: 'Hydro', ANEMO: 'Anemo', ELECTRO: 'Electro', DENDRO: 'Dendro', CRYO: 'Cryo', GEO: 'Geo' };
  return map[vision.toUpperCase()] || vision.charAt(0).toUpperCase() + vision.slice(1).toLowerCase();
}

function normalizeWeaponStr(weapon) {
  if (!weapon) return null;
  const map = { SWORD: 'Sword', CLAYMORE: 'Claymore', POLEARM: 'Polearm', BOW: 'Bow', CATALYST: 'Catalyst' };
  return map[weapon.toUpperCase()] || weapon.charAt(0).toUpperCase() + weapon.slice(1).toLowerCase();
}

function inferTalentType(unlock) {
  if (!unlock) return 'NORMAL_ATTACK';
  const lower = unlock.toLowerCase();
  if (lower.includes('normal')) return 'NORMAL_ATTACK';
  if (lower.includes('skill')) return 'ELEMENTAL_SKILL';
  if (lower.includes('burst')) return 'ELEMENTAL_BURST';
  return 'NORMAL_ATTACK';
}
