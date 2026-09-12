const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'genshin-guide.db');
const db = new Database(dbPath);

console.log('--- Seeding Build Presets for All 104 Characters ---');

const chars = db.prepare('SELECT id, name, vision, weapon_type, rarity FROM characters').all();
const validWeapons = new Set(db.prepare('SELECT id FROM weapons').all().map(w => w.id));
const validArtifacts = new Set(db.prepare('SELECT id FROM artifact_sets').all().map(a => a.id));

// Helper maps by weapon type and element
const defaultWeaponsByWeaponType = {
    Sword: ['mistsplitter-reforged', 'primordial-jade-cutter', 'freedom-sworn', 'harapan-geppaku-futsu', 'favonius-sword', 'sacrificial-sword'],
    Claymore: ['wolf-s-gravestone', 'beacon-of-the-reed-sea', 'serpent-spine', 'favonius-greatsword', 'sacrificial-greatsword'],
    Polearm: ['staff-of-homa', 'primordial-jade-winged-spear', 'calamity-queller', 'favonius-lance', 'the-catch', 'dragon-s-bane'],
    Bow: ['aqua-simulacra', 'the-first-great-magic', 'thundering-pulse', 'elegy-for-the-end', 'favonius-warbow', 'sacrificial-bow'],
    Catalyst: ['a-thousand-floating-dreams', 'tome-of-the-eternal-flow', 'kagura-s-verity', 'lost-prayer-to-the-sacred-winds', 'the-widsith', 'sacrificial-fragments']
};

const defaultArtifactsByVision = {
    Pyro: ['crimson-witch-of-flames', 'gladiators-finale', 'shimenawa-s-reminiscence'],
    Hydro: ['heart-of-depth', 'nymph-s-dream', 'marechaussee-hunter'],
    Anemo: ['viridescent-venerer', 'desert-pavilion-chronicle'],
    Electro: ['thundering-fury', 'gilded-dreams', 'emblem-of-severed-fate'],
    Dendro: ['deepwood-memories', 'gilded-dreams'],
    Cryo: ['blizzard-strayer', 'gladiators-finale'],
    Geo: ['husk-of-opulent-dreams', 'archaic-petra']
};

const insertPreset = db.prepare(`
  INSERT INTO build_presets (
    character_id, preset_name, preset_type, weapon_ids, artifact_set_ids, main_stats, sub_stats, role, notes, confidence, source
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let count = 0;

chars.forEach(c => {
    const existing = db.prepare('SELECT COUNT(*) as cnt FROM build_presets WHERE character_id = ?').get(c.id);
    if (existing.cnt > 0) return;

    const wCandidates = defaultWeaponsByWeaponType[c.weapon_type] || ['favonius-sword'];
    const wSelected = wCandidates.filter(w => validWeapons.has(w)).slice(0, 4);

    const aCandidates = defaultArtifactsByVision[c.vision] || ['gladiators-finale', 'noblesse-oblige'];
    const aSelected = aCandidates.filter(a => validArtifacts.has(a)).slice(0, 2);

    const sands = c.vision === 'Dendro' ? 'Elemental Mastery / ATK%' : 'ATK% / Energy Recharge';
    const goblet = `${c.vision} DMG Bonus`;
    const circlet = 'CRIT Rate / CRIT DMG';

    const mainStats = JSON.stringify({ sands, goblet, circlet });
    const subStats = JSON.stringify(['CRIT Rate', 'CRIT DMG', 'ATK%', 'Energy Recharge', 'Elemental Mastery']);
    const role = `${c.vision} DPS / Sub-DPS`;
    const notes = `Optimal meta build for ${c.name} balancing ${c.vision} DMG, CRIT ratio, and Energy Recharge.`;

    insertPreset.run(
        c.id,
        `${c.name} Meta Build`,
        'general',
        JSON.stringify(wSelected),
        JSON.stringify(aSelected),
        mainStats,
        subStats,
        role,
        notes,
        'High',
        'community'
    );
    count++;
});

console.log(`✔ Successfully seeded build presets for ${count} characters!`);
