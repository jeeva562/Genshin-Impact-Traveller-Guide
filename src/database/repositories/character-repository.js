/**
 * Character repository — database queries for character data.
 */

import { queryAll, queryOne } from '../db';

/**
 * Get all characters with optional filters.
 */
export function getCharacters({ vision, weapon_type, rarity, nation, search, sort = 'name', order = 'asc' } = {}) {
  let sql = 'SELECT * FROM characters WHERE 1=1';
  const params = [];

  if (vision) { sql += ' AND vision = ?'; params.push(vision); }
  if (weapon_type) { sql += ' AND weapon_type = ?'; params.push(weapon_type); }
  if (rarity) { sql += ' AND rarity = ?'; params.push(Number(rarity)); }
  if (nation) { sql += ' AND nation = ?'; params.push(nation); }
  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }

  const validSorts = ['name', 'rarity', 'vision', 'nation', 'weapon_type'];
  const sortCol = validSorts.includes(sort) ? sort : 'name';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortCol} ${sortOrder}`;

  return queryAll(sql, params);
}

/**
 * Get a single character by ID with all related data.
 */
export function getCharacterById(id) {
  if (!id) return null;
  const cleanId = String(id).trim();
  const slugUnderscore = cleanId.toLowerCase().replace(/-/g, '_');
  const slugHyphen = cleanId.toLowerCase().replace(/_/g, '-');

  let character = queryOne('SELECT * FROM characters WHERE id = ? OR id = ? OR id = ? OR LOWER(name) = ?', [cleanId, slugUnderscore, slugHyphen, cleanId.toLowerCase()]);
  if (!character) return null;
  const charId = character.id;

  const talents = queryAll(
    'SELECT * FROM character_talents WHERE character_id = ? ORDER BY sort_order',
    [charId]
  );

  // Get upgrades for each talent
  for (const talent of talents) {
    talent.upgrades = queryAll(
      'SELECT name, value FROM talent_upgrades WHERE talent_id = ?',
      [talent.id]
    );
  }

  const passives = queryAll(
    'SELECT * FROM passive_talents WHERE character_id = ? ORDER BY level',
    [charId]
  );

  const constellations = queryAll(
    'SELECT * FROM constellations WHERE character_id = ? ORDER BY level',
    [charId]
  );

  const ascensionMaterials = queryAll(
    'SELECT * FROM character_ascension_materials WHERE character_id = ? ORDER BY ascension_level',
    [charId]
  );

  const buildPresets = queryAll(
    'SELECT * FROM build_presets WHERE character_id = ? ORDER BY id',
    [charId]
  );

  // Parse JSON fields in build presets
  for (const build of buildPresets) {
    try {
      build.weapon_ids = JSON.parse(build.weapon_ids || '[]');
      build.artifact_set_ids = JSON.parse(build.artifact_set_ids || '[]');
      build.main_stats = JSON.parse(build.main_stats || '{}');
      build.sub_stats = JSON.parse(build.sub_stats || '[]');
      build.stat_targets = JSON.parse(build.stat_targets || '{}');
      build.talent_priority = JSON.parse(build.talent_priority || '[]');
    } catch { /* keep raw strings if parse fails */ }
  }

  // Get talent book info
  const talentBooks = queryAll(
    `SELECT tb.* FROM talent_books tb
     JOIN talent_book_characters tbc ON tb.book_type = tbc.book_type
     WHERE tbc.character_id = ?`,
    [charId]
  );

  for (const book of talentBooks) {
    try { book.availability = JSON.parse(book.availability || '[]'); } catch { book.availability = []; }
  }

  // Get weapon details for build presets
  const weaponIds = [...new Set(buildPresets.flatMap(b => b.weapon_ids || []))];
  const weapons = weaponIds.length > 0
    ? queryAll(`SELECT * FROM weapons WHERE id IN (${weaponIds.map(() => '?').join(',')})`, weaponIds)
    : [];

  // Get artifact details for build presets
  const artifactIds = [...new Set(buildPresets.flatMap(b => b.artifact_set_ids || []))];
  const artifacts = artifactIds.length > 0
    ? queryAll(`SELECT * FROM artifact_sets WHERE id IN (${artifactIds.map(() => '?').join(',')})`, artifactIds)
    : [];

  // Find teams that include this character
  const teams = queryAll('SELECT * FROM team_templates');
  let characterTeams = teams.filter(t => {
    try {
      const chars = JSON.parse(t.characters || '[]');
      return chars.some(c => c.characterId === id);
    } catch { return false; }
  }).map(t => {
    try {
      t.characters = JSON.parse(t.characters || '[]');
      t.reactions = JSON.parse(t.reactions || '[]');
      t.rotation = JSON.parse(t.rotation || '[]');
      t.strengths = JSON.parse(t.strengths || '[]');
      t.weaknesses = JSON.parse(t.weaknesses || '[]');
    } catch { /* keep raw */ }
    return t;
  });

  // If no static template exists for this character, generate smart meta team compositions
  if (characterTeams.length === 0) {
    characterTeams = generateDynamicTeamsForCharacter(character);
  }

  return {
    ...character,
    talents,
    passives,
    constellations,
    ascensionMaterials,
    buildPresets,
    talentBooks,
    weapons,
    artifacts,
    teams: characterTeams,
  };
}

/**
 * Get character count by element for stats.
 */
export function getCharacterCountByElement() {
  return queryAll(
    'SELECT vision, COUNT(*) as count FROM characters GROUP BY vision ORDER BY count DESC'
  );
}

/**
 * Intelligent team composition generator for characters without explicit DB templates.
 */
function generateDynamicTeamsForCharacter(character) {
  if (!character || !character.id) return [];
  const cid = character.id;
  const name = character.name || cid;
  const vision = (character.vision || 'Pyro').toLowerCase();

  // Custom meta builds for Natlan and key characters
  if (cid === 'xilonen') {
    return [
      {
        name: 'Xilonen Universal RES Shred Hypercarry',
        playstyle: 'Universal RES Shred & Nightsoul Buffer',
        description: 'Xilonen activates Nightsoul\'s Blessing to shred elemental resistance by 36% across Hydro, Pyro, Cryo, and Electro.',
        characters: [
          { characterId: 'xilonen', characterName: 'Xilonen', role: 'Support / Buffer', vision: 'Geo' },
          { characterId: 'mavuika', characterName: 'Mavuika', role: 'Main DPS', vision: 'Pyro' },
          { characterId: 'furina', characterName: 'Furina', role: 'Sub-DPS / Buffer', vision: 'Hydro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'Healer / ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['Universal 36% RES Shred', 'Colossal DMG Amplification', 'High Roller Mobility'],
        weaknesses: ['Requires 2 non-Geo/Dendro/Anemo teammates for max shred'],
      },
      {
        name: 'Xilonen & Navia Crystallize Sovereign',
        playstyle: 'Dual Geo Burst Artillery',
        description: 'Rapid Crystallize shard generation feeds Navia Gunbrella Shrapnel while Xilonen provides massive Geo damage buffs.',
        characters: [
          { characterId: 'xilonen', characterName: 'Xilonen', role: 'Geo Support', vision: 'Geo' },
          { characterId: 'navia', characterName: 'Navia', role: 'Main DPS', vision: 'Geo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Sub-DPS', vision: 'Hydro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shield / RES Shred', vision: 'Geo' },
        ],
        strengths: ['Massive burst DMG numbers', 'Impenetrable Geo Shields', 'Smooth rotations'],
        weaknesses: ['Requires picking up crystallize shards'],
      },
    ];
  }

  if (cid === 'mualani') {
    return [
      {
        name: 'Mualani Shark Forward Vaporize Nuke',
        playstyle: 'Forward Vaporize Burst DPS',
        description: 'Mualani rides Sharky Surfer Bites into Pyro auras for 2x forward Vaporize multipliers exceeding 300k+ damage.',
        characters: [
          { characterId: 'mualani', characterName: 'Mualani', role: 'Main DPS', vision: 'Hydro' },
          { characterId: 'xiangling', characterName: 'Xiangling', role: 'Pyro Enabler', vision: 'Pyro' },
          { characterId: 'xilonen', characterName: 'Xilonen', role: 'RES Shredder', vision: 'Geo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Hydro Buffer', vision: 'Hydro' },
        ],
        strengths: ['Enormous single-target burst', 'Fast open-world surfing', 'Simple setup'],
        weaknesses: ['Requires strict Pyro aura application'],
      },
      {
        name: 'Mualani Hyperbloom Torrent',
        playstyle: 'Reaction Driver / Seed Generator',
        description: 'Mualani generates continuous Dendro Cores alongside Nahida while Raiden or Kuki triggers hyperbloom homing missiles.',
        characters: [
          { characterId: 'mualani', characterName: 'Mualani', role: 'On-Field Driver', vision: 'Hydro' },
          { characterId: 'nahida', characterName: 'Nahida', role: 'Dendro Enabler', vision: 'Dendro' },
          { characterId: 'raiden', characterName: 'Raiden Shogun', role: 'Hyperbloom Trigger', vision: 'Electro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder', vision: 'Geo' },
        ],
        strengths: ['High damage floor', 'Low gear investment requirement', 'Handles large waves'],
        weaknesses: ['Scales less with Mualani personal CRIT stats'],
      },
    ];
  }

  if (cid === 'chasca') {
    return [
      {
        name: 'Chasca Rainbow Shell Artillery',
        playstyle: 'Multi-Elemental Conversion Sniper',
        description: 'Chasca converts Phantom Shells into Pyro, Hydro, and Cryo bullets based on teammate elements for rainbow barrages.',
        characters: [
          { characterId: 'chasca', characterName: 'Chasca', role: 'Main DPS', vision: 'Anemo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Hydro Enabler', vision: 'Hydro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
          { characterId: 'ororon', characterName: 'Ororon', role: 'Electro Enabler', vision: 'Electro' },
        ],
        strengths: ['Flight mode combat', 'Simultaneous elemental reactions', 'Long-range burst'],
        weaknesses: ['Requires 3 distinct non-Anemo party members'],
      },
      {
        name: 'Chasca Nightsoul Swirl Hypercarry',
        playstyle: 'Anemo Hypercarry Swirl',
        description: 'Faruzan Anemo shred and Xilonen Nightsoul synergy propel Chasca Souleseeker shells to peak critical output.',
        characters: [
          { characterId: 'chasca', characterName: 'Chasca', role: 'Main DPS', vision: 'Anemo' },
          { characterId: 'faruzan', characterName: 'Faruzan', role: 'Anemo Buffer', vision: 'Anemo' },
          { characterId: 'xilonen', characterName: 'Xilonen', role: 'Support', vision: 'Geo' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'Healer / Buffer', vision: 'Pyro' },
        ],
        strengths: ['Immense single-target burst', 'Wide aerial attack angles'],
        weaknesses: ['Vulnerable to falling if Nightsoul depletes'],
      },
    ];
  }

  if (cid === 'mavuika') {
    return [
      {
        name: 'Mavuika Sovereign Sunburst Vaporize',
        playstyle: 'Pyro Sovereign Burst DPS',
        description: 'The Pyro Archon unleashes devastating solar slashes fueled by Nightsoul burst points from all party members.',
        characters: [
          { characterId: 'mavuika', characterName: 'Mavuika', role: 'Main DPS', vision: 'Pyro' },
          { characterId: 'xilonen', characterName: 'Xilonen', role: 'Universal Support', vision: 'Geo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Hydro Enabler / Buffer', vision: 'Hydro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['Peak Tier-0 Pyro DPS', 'All-terrain motor-drive combat', 'Full party synergy'],
        weaknesses: ['High energy and Nightsoul point demand'],
      },
      {
        name: 'Mavuika Overload Cataclysm',
        playstyle: 'Overload Reaction DPS',
        description: 'Chevreuse enables 40% Pyro & Electro shred while Ororon and Mavuika trigger non-stop Overload explosions.',
        characters: [
          { characterId: 'mavuika', characterName: 'Mavuika', role: 'Main DPS', vision: 'Pyro' },
          { characterId: 'chevreuse', characterName: 'Chevreuse', role: 'Overload Shredder', vision: 'Pyro' },
          { characterId: 'ororon', characterName: 'Ororon', role: 'Electro Enabler', vision: 'Electro' },
          { characterId: 'raiden', characterName: 'Raiden Shogun', role: 'Battery / Sub-DPS', vision: 'Electro' },
        ],
        strengths: ['40% Pyro/Electro shred without Anemo', 'High stagger values', 'Stellar AoE'],
        weaknesses: ['Requires strictly Pyro and Electro members only'],
      },
    ];
  }

  if (cid === 'citlali') {
    return [
      {
        name: 'Citlali Frost & Flame Reverse Melt',
        playstyle: 'Cryo Support / Reverse Melt Shielder',
        description: 'Citlali provides obsidian frost barriers and steady off-field Cryo application for Mavuika or Xiangling.',
        characters: [
          { characterId: 'citlali', characterName: 'Citlali', role: 'Cryo Sub-DPS / Shield', vision: 'Cryo' },
          { characterId: 'mavuika', characterName: 'Mavuika', role: 'Main DPS', vision: 'Pyro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
          { characterId: 'xilonen', characterName: 'Xilonen', role: 'RES Shredder', vision: 'Geo' },
        ],
        strengths: ['Safe shielded Melt setup', 'High Melt multiplier damage', 'Starlit crowd control'],
        weaknesses: ['Needs precise Pyro-Cryo aura management'],
      },
      {
        name: 'Citlali Permafrost Blizzard',
        playstyle: 'Freeze Crowd Control & Buffer',
        description: 'Citlali pairs with Ayaka or Wriothesley and Furina for unbreakable freezing lockouts.',
        characters: [
          { characterId: 'citlali', characterName: 'Citlali', role: 'Cryo Support', vision: 'Cryo' },
          { characterId: 'ayaka', characterName: 'Kamisato Ayaka', role: 'Main DPS', vision: 'Cryo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Hydro Enabler', vision: 'Hydro' },
          { characterId: 'kazuha', characterName: 'Kaedehara Kazuha', role: 'VV Swirl Buffer', vision: 'Anemo' },
        ],
        strengths: ['100% frozen enemy uptime', '4pc Blizzard Strayer 55% CRIT Rate boost'],
        weaknesses: ['Immune against unfreezable weekly bosses'],
      },
    ];
  }

  if (cid === 'ororon') {
    return [
      {
        name: 'Ororon Electro-Charged Nightsoul Conduit',
        playstyle: 'Off-Field Electro Nightsoul Burst',
        description: 'Ororon fires persistent shadow bolts whenever allies trigger Electro-Charged or Nightsoul bursts.',
        characters: [
          { characterId: 'ororon', characterName: 'Ororon', role: 'Off-field Sub DPS', vision: 'Electro' },
          { characterId: 'neuvillette', characterName: 'Neuvillette', role: 'Main DPS', vision: 'Hydro' },
          { characterId: 'furina', characterName: 'Furina', role: 'Hydro Buffer', vision: 'Hydro' },
          { characterId: 'xilonen', characterName: 'Xilonen', role: 'RES Shredder', vision: 'Geo' },
        ],
        strengths: ['Automatic off-field DPS', 'Activates Neuvillette Draconic Stacks easily', 'Night-Wind mobility'],
        weaknesses: ['Requires frequent reaction triggers to maximize energy'],
      },
      {
        name: 'Ororon Quicken & Aggravate Storm',
        playstyle: 'Aggravate Catalyst',
        description: 'Continuous Electro application triggering Aggravate procs alongside Nahida and Alhaitham.',
        characters: [
          { characterId: 'ororon', characterName: 'Ororon', role: 'Electro Sub-DPS', vision: 'Electro' },
          { characterId: 'alhaitham', characterName: 'Alhaitham', role: 'Main DPS', vision: 'Dendro' },
          { characterId: 'nahida', characterName: 'Nahida', role: 'Dendro Buffer', vision: 'Dendro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder', vision: 'Geo' },
        ],
        strengths: ['High sustained DPS', 'Unbreakable Zhongli shield', 'Dense particle generation'],
        weaknesses: ['Low healing if shield breaks'],
      },
    ];
  }

  if (cid === 'lan-yan' || cid === 'lanyan') {
    return [
      {
        name: 'Lan Yan Swirl & Tea Feather Martial Combo',
        playstyle: 'Anemo Swirl Support & Driver',
        description: 'Lan Yan unleashes flowing martial gale strikes to gather foes and trigger Viridescent Venerer shreds.',
        characters: [
          { characterId: 'lan-yan', characterName: 'Lan Yan', role: 'Anemo Support / Driver', vision: 'Anemo' },
          { characterId: 'hu-tao', characterName: 'Hu Tao', role: 'Main DPS', vision: 'Pyro' },
          { characterId: 'xingqiu', characterName: 'Xingqiu', role: 'Hydro Enabler', vision: 'Hydro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder', vision: 'Geo' },
        ],
        strengths: ['Accessible 4★ Anemo VV user', 'Smooth aerial crowd gathering', 'Chenyu aesthetic synergy'],
        weaknesses: ['Lower personal multiplier than 5★ Anemo units'],
      },
      {
        name: 'Lan Yan Taser Whirlwind',
        playstyle: 'Electro-Charged Swirl Driver',
        description: 'Continuous Hydro and Electro swirling generating massive AoE chain lightning numbers.',
        characters: [
          { characterId: 'lan-yan', characterName: 'Lan Yan', role: 'Swirl Driver', vision: 'Anemo' },
          { characterId: 'fischl', characterName: 'Fischl', role: 'Electro Battery', vision: 'Electro' },
          { characterId: 'beidou', characterName: 'Beidou', role: 'Electro Shield / Burst', vision: 'Electro' },
          { characterId: 'xingqiu', characterName: 'Xingqiu', role: 'Hydro Sub-DPS', vision: 'Hydro' },
        ],
        strengths: ['Exceptional AoE wave clear', 'Very high F2P accessibility', 'Damage reduction stack'],
        weaknesses: ['Lower single-target boss DPS'],
      },
    ];
  }

  if (cid === 'iansan') {
    return [
      {
        name: 'Iansan Sprint & Overload Knockout',
        playstyle: 'Electro Striker / Overload Driver',
        description: 'Iansan darts across the battlefield at breakneck velocity, detonating Overload blasts with Mavuika.',
        characters: [
          { characterId: 'iansan', characterName: 'Iansan', role: 'Electro Striker', vision: 'Electro' },
          { characterId: 'mavuika', characterName: 'Mavuika', role: 'Pyro Enabler / DPS', vision: 'Pyro' },
          { characterId: 'chevreuse', characterName: 'Chevreuse', role: 'Support / RES Shred', vision: 'Pyro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['Fast-paced athletic combat', 'Chevreuse 40% dual shred', 'High stagger'],
        weaknesses: ['Can knock light enemies away without grouping'],
      },
      {
        name: 'Iansan Aggravate Blitz',
        playstyle: 'Quicken / Aggravate Sub-DPS',
        description: 'Swift Electro strikes amplifying damage through Quicken auras provided by Nahida.',
        characters: [
          { characterId: 'iansan', characterName: 'Iansan', role: 'Electro DPS', vision: 'Electro' },
          { characterId: 'nahida', characterName: 'Nahida', role: 'Dendro Buffer', vision: 'Dendro' },
          { characterId: 'fischl', characterName: 'Fischl', role: 'Off-Field Battery', vision: 'Electro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder', vision: 'Geo' },
        ],
        strengths: ['Smooth single-target aggression', 'Fischl A4 passive synergy', 'Safe shielding'],
        weaknesses: ['Requires consistent Dendro uptime'],
      },
    ];
  }

  // Generalized elemental archetype fallbacks for ANY character
  const teamArchetypes = {
    pyro: [
      {
        name: `${name} Vaporize Hypercarry`,
        playstyle: 'Amplifying Vaporize Reactions',
        description: `${name} triggers consistent 1.5x/2x Vaporize reactions with Hydro enablers for massive critical damage.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Main / Sub DPS', vision: 'Pyro' },
          { characterId: 'xingqiu', characterName: 'Xingqiu', role: 'Hydro Enabler', vision: 'Hydro' },
          { characterId: 'kazuha', characterName: 'Kaedehara Kazuha', role: 'VV Swirl Buffer', vision: 'Anemo' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer / Healer', vision: 'Pyro' },
        ],
        strengths: ['Massive burst multipliers', 'Double Pyro resonance (+25% ATK)', 'Universal meta core'],
        weaknesses: ['Requires Bennett circle uptime'],
      },
      {
        name: `${name} Overload Firestorm`,
        playstyle: 'Overload Reaction Core',
        description: `Unleashes rapid Overload reactions with Electro off-field DPS, breaking heavy shields effortlessly.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Pyro Core', vision: 'Pyro' },
          { characterId: 'raiden', characterName: 'Raiden Shogun', role: 'Electro Battery', vision: 'Electro' },
          { characterId: 'chevreuse', characterName: 'Chevreuse', role: 'Overload RES Shredder', vision: 'Pyro' },
          { characterId: 'fischl', characterName: 'Fischl', role: 'Off-Field Sub-DPS', vision: 'Electro' },
        ],
        strengths: ['40% Pyro and Electro RES shred', 'Heavy poise break', 'Continuous reactions'],
        weaknesses: ['Knocks back small enemies'],
      },
    ],
    hydro: [
      {
        name: `${name} Hyperbloom Engine`,
        playstyle: 'Transformative Reaction Driver',
        description: `${name} generates endless Dendro Cores with Nahida, allowing Electro procs to deal 30k+ homing missiles.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Hydro Enabler', vision: 'Hydro' },
          { characterId: 'nahida', characterName: 'Nahida', role: 'Dendro Buffer', vision: 'Dendro' },
          { characterId: 'raiden', characterName: 'Raiden Shogun', role: 'Hyperbloom Trigger', vision: 'Electro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder', vision: 'Geo' },
        ],
        strengths: ['Extremely high damage floor', 'Minimal gear requirement', 'Homing target missiles'],
        weaknesses: ['Damage capped by character level and EM'],
      },
      {
        name: `${name} Electro-Charged Taser`,
        playstyle: 'Continuous Shock Waves',
        description: `Pairs Hydro with dual Electro off-field batteries for constant Electro-Charged stagger and crowd control.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Hydro Core', vision: 'Hydro' },
          { characterId: 'fischl', characterName: 'Fischl', role: 'Electro Battery', vision: 'Electro' },
          { characterId: 'beidou', characterName: 'Beidou', role: 'Electro Shield / Burst', vision: 'Electro' },
          { characterId: 'kazuha', characterName: 'Kaedehara Kazuha', role: 'VV Swirl Buffer', vision: 'Anemo' },
        ],
        strengths: ['Top-tier AoE chaining damage', 'Stagger locks enemy groups', 'High comfort'],
        weaknesses: ['Lower single-target boss DPS'],
      },
    ],
    cryo: [
      {
        name: `${name} Blizzard Permafreeze`,
        playstyle: 'Permanent Freeze Lockdown',
        description: `${name} locks enemies in place with Hydro application while enjoying +55% free CRIT Rate from Blizzard Strayer & Cryo Resonance.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Cryo Core', vision: 'Cryo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Hydro Enabler / Buffer', vision: 'Hydro' },
          { characterId: 'kazuha', characterName: 'Kaedehara Kazuha', role: 'Grouping & VV Shred', vision: 'Anemo' },
          { characterId: 'charlotte', characterName: 'Charlotte', role: 'Healer / Cryo Battery', vision: 'Cryo' },
        ],
        strengths: ['Enemies are 100% immobilized', 'Huge free CRIT stats', 'Massive comfort'],
        weaknesses: ['Bosses cannot be frozen'],
      },
      {
        name: `${name} Reverse Melt Burst`,
        playstyle: 'Amplifying Melt Damage',
        description: `${name} triggers 1.5x Melt damage on enemies marked with Pyro auras from Xiangling and Bennett.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Cryo DPS', vision: 'Cryo' },
          { characterId: 'xiangling', characterName: 'Xiangling', role: 'Pyro Enabler', vision: 'Pyro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer / Healer', vision: 'Pyro' },
          { characterId: 'shenhe', characterName: 'Shenhe', role: 'Cryo Buffer', vision: 'Cryo' },
        ],
        strengths: ['Uncapped single-target damage ceiling', 'Effective against world bosses'],
        weaknesses: ['High Energy Recharge needs for Xiangling'],
      },
    ],
    electro: [
      {
        name: `${name} Quicken & Aggravate`,
        playstyle: 'Catalyze Elemental Reaction',
        description: `${name} triggers Aggravate damage procs across continuous Dendro auras for massive flat damage additions.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Electro Core', vision: 'Electro' },
          { characterId: 'nahida', characterName: 'Nahida', role: 'Dendro Buffer', vision: 'Dendro' },
          { characterId: 'fischl', characterName: 'Fischl', role: 'Off-Field Battery', vision: 'Electro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder', vision: 'Geo' },
        ],
        strengths: ['High sustained DPS', 'Fischl A4 machine gun procs', 'Great against both mobs and bosses'],
        weaknesses: ['Requires maintaining Quicken aura'],
      },
      {
        name: `${name} Overload Shockwave`,
        playstyle: 'Overload Shred Core',
        description: `Explosive Overload setup with Chevreuse for 40% dual Pyro/Electro resistance shredding.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Electro DPS', vision: 'Electro' },
          { characterId: 'chevreuse', characterName: 'Chevreuse', role: 'RES Shredder', vision: 'Pyro' },
          { characterId: 'xiangling', characterName: 'Xiangling', role: 'Pyro Sub-DPS', vision: 'Pyro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['40% RES shred without Anemo', 'High poise disruption', 'Substantial ATK buffs'],
        weaknesses: ['Strict element restriction (Pyro + Electro only)'],
      },
    ],
    dendro: [
      {
        name: `${name} Spread & Quicken Carry`,
        playstyle: 'Dendro Spread Amplification',
        description: `${name} deals enhanced Spread damage when attacking enemies affected by Quicken.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Dendro Core', vision: 'Dendro' },
          { characterId: 'raiden', characterName: 'Raiden Shogun', role: 'Electro Enabler', vision: 'Electro' },
          { characterId: 'fischl', characterName: 'Fischl', role: 'Sub-DPS', vision: 'Electro' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder', vision: 'Geo' },
        ],
        strengths: ['Colossal personal Dendro damage', 'Consistent Quicken uptime', 'Very comfortable'],
        weaknesses: ['Requires balanced EM and CRIT stats'],
      },
      {
        name: `${name} Bloom / Burgeon Bombardment`,
        playstyle: 'Explosive Seed Detonation',
        description: `Rapid Dendro Core creation detonated by Pyro triggers for huge AoE Burgeon explosions.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Dendro Core', vision: 'Dendro' },
          { characterId: 'xingqiu', characterName: 'Xingqiu', role: 'Hydro Enabler', vision: 'Hydro' },
          { characterId: 'thoma', characterName: 'Thoma', role: 'Burgeon Trigger & Shield', vision: 'Pyro' },
          { characterId: 'furina', characterName: 'Furina', role: 'Sub-DPS / Buffer', vision: 'Hydro' },
        ],
        strengths: ['Massive multi-target AoE burst', 'Ignores enemy defense', 'Fun gameplay loop'],
        weaknesses: ['Burgeon self-damage requires proper shield'],
      },
    ],
    anemo: [
      {
        name: `${name} Swirl Resonance Shredder`,
        playstyle: 'Viridescent Venerer Res Shred',
        description: `${name} clusters enemies together and reduces their elemental resistance by 40% using 4pc Viridescent Venerer.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Anemo Support / Driver', vision: 'Anemo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Hydro Enabler', vision: 'Hydro' },
          { characterId: 'xiangling', characterName: 'Xiangling', role: 'Pyro Sub-DPS', vision: 'Pyro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['40% Elemental RES shred', 'Elite grouping and crowd control', 'High Swirl numbers'],
        weaknesses: ['Cannot swirl Geo or Dendro'],
      },
      {
        name: `${name} Anemo Hypercarry Vortex`,
        playstyle: 'Pure Anemo Critical DPS',
        description: `Faruzan and Bennett massively buff Anemo DMG and ATK to transform ${name} into an unstoppable vortex.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Anemo Core', vision: 'Anemo' },
          { characterId: 'faruzan', characterName: 'Faruzan', role: 'Anemo Buffer / Shred', vision: 'Anemo' },
          { characterId: 'furina', characterName: 'Furina', role: 'DMG Buffer', vision: 'Hydro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'Healer / ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['High raw damage unaffected by elemental immunities', 'Spectacular burst'],
        weaknesses: ['Requires high investment in Anemo buffers'],
      },
    ],
    geo: [
      {
        name: `${name} Geo Resonance Monolith`,
        playstyle: 'Dual Geo Shield & Shred',
        description: `Geo Resonance provides +15% Shield Strength and +15% DMG dealt to shielded characters, plus 20% Geo RES shred.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Geo Core', vision: 'Geo' },
          { characterId: 'zhongli', characterName: 'Zhongli', role: 'Shielder / RES Shred', vision: 'Geo' },
          { characterId: 'furina', characterName: 'Furina', role: 'Universal Buffer', vision: 'Hydro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['Unbreakable shields', 'Universal resistance shred', 'Smooth rotation'],
        weaknesses: ['Geo does not trigger damaging reactions'],
      },
      {
        name: `${name} Crystallize Artillery`,
        playstyle: 'Crystallize Shards & Buffs',
        description: `Pairs with high off-field application units to generate infinite Crystallize shields and trigger set buffs.`,
        characters: [
          { characterId: cid, characterName: name, role: 'Geo Core', vision: 'Geo' },
          { characterId: 'chiori', characterName: 'Chiori', role: 'Geo Sub-DPS', vision: 'Geo' },
          { characterId: 'xiangling', characterName: 'Xiangling', role: 'Pyro Enabler', vision: 'Pyro' },
          { characterId: 'bennett', characterName: 'Bennett', role: 'ATK Buffer', vision: 'Pyro' },
        ],
        strengths: ['Consistent off-field Geo damage', 'Strong defensive layer', 'High sustained DPS'],
        weaknesses: ['Positioning around Geo constructs'],
      },
    ],
  };

  return teamArchetypes[vision] || teamArchetypes.pyro;
}
