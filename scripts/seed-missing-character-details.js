const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'genshin-guide.db');
const db = new Database(dbPath);

console.log('--- Seeding Missing Character Details ---');

// 1. Update Lohen's core profile as Cryo from Mondstadt
const updateLohen = db.prepare(`
  UPDATE characters SET
    title = 'Frost Sovereign of Mondstadt',
    vision = 'Cryo',
    weapon_type = 'Sword',
    rarity = 5,
    nation = 'Mondstadt',
    affiliation = 'Knights of Favonius',
    description = 'A noble Mondstadt swordmaster who commands ancient glacial frost and sub-zero blade techniques with unyielding grace and chivalric honor.',
    constellation_name = 'Ignis Glacialis',
    vision_key = 'CRYO',
    weapon_type_key = 'SWORD',
    last_updated = datetime('now')
  WHERE id = 'lohen'
`);
updateLohen.run();
console.log('✔ Updated Lohen base record to Cryo (Mondstadt)');

// Helper to seed character data
function seedCharacterDetails(charId, talents, passives, constellations, ascMaterials) {
    // Clear existing
    db.prepare('DELETE FROM character_talents WHERE character_id = ?').run(charId);
    db.prepare('DELETE FROM passive_talents WHERE character_id = ?').run(charId);
    db.prepare('DELETE FROM constellations WHERE character_id = ?').run(charId);
    db.prepare('DELETE FROM character_ascension_materials WHERE character_id = ?').run(charId);

    // Insert Talents
    const insertTalent = db.prepare(`
    INSERT INTO character_talents (character_id, name, type, unlock, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
    talents.forEach((t, i) => {
        insertTalent.run(charId, t.name, t.type, t.unlock, t.description, i + 1);
    });

    // Insert Passives
    const insertPassive = db.prepare(`
    INSERT INTO passive_talents (character_id, name, description, unlock, level)
    VALUES (?, ?, ?, ?, ?)
  `);
    passives.forEach((p) => {
        insertPassive.run(charId, p.name, p.description, p.unlock, p.level || 1);
    });

    // Insert Constellations
    const insertConst = db.prepare(`
    INSERT INTO constellations (character_id, name, level, unlock, description)
    VALUES (?, ?, ?, ?, ?)
  `);
    constellations.forEach((c) => {
        insertConst.run(charId, c.name, c.level, c.unlock, c.description);
    });

    // Insert Ascension Materials
    const insertAsc = db.prepare(`
    INSERT INTO character_ascension_materials (character_id, ascension_level, material_name, quantity)
    VALUES (?, ?, ?, ?)
  `);
    ascMaterials.forEach((a) => {
        insertAsc.run(charId, a.ascension_level, a.material_name, a.quantity);
    });

    console.log(`✔ Seeded details for ${charId}`);
}

// Data for Lohen
const lohenTalents = [
    {
        name: 'Favonius Frostblade',
        type: 'NORMAL_ATTACK',
        unlock: 'Normal Attack',
        description: 'Performs up to 5 rapid sword strikes delivering sub-zero Physical and Cryo DMG. Charged Attack consumes stamina to unleash 2 rapid glacial arc slashes.',
    },
    {
        name: 'Glacial Surge',
        type: 'ELEMENTAL_SKILL',
        unlock: 'Elemental Skill',
        description: 'Dashes forward with a chilling frost aura, dealing AoE Cryo DMG and creating a Frostbound Domain for 10s. While inside the domain, Lohen gains Cryo Infusion and +20% Movement Speed.',
    },
    {
        name: 'Domain of Astral Frost',
        type: 'ELEMENTAL_BURST',
        unlock: 'Elemental Burst',
        description: 'Summons a colossal frost sword from the heavens, dealing massive AoE Cryo DMG and freezing nearby foes. Party members gain +20% Cryo DMG Bonus and +15% CRIT DMG for 15s.',
    },
];

const lohenPassives = [
    { name: 'Chilling Breeze', description: 'Decreases stamina consumption of Frostbound Domain dash attacks by 30%.', unlock: 'Ascension 1', level: 1 },
    { name: 'Glacial Resonance', description: 'When Lohen triggers a Freeze or Melt reaction, party members gain +15% CRIT Rate for 12s.', unlock: 'Ascension 4', level: 4 },
    { name: 'Mondstadt Expedition Master', description: 'Gains 25% more rewards when dispatched on a Mondstadt Expedition.', unlock: 'Utility Passive', level: 1 },
];

const lohenConstellations = [
    { level: 1, name: 'Frost-Bound Horizon', unlock: 'Constellation C1', description: 'Increases Glacial Surge charges by 1.' },
    { level: 2, name: 'Sub-Zero Resonance', unlock: 'Constellation C2', description: 'Enemies inside Domain of Astral Frost suffer 20% decreased Cryo RES.' },
    { level: 3, name: 'Favonius Heritage', unlock: 'Constellation C3', description: 'Increases Glacial Surge level by 3. Max level is 15.' },
    { level: 4, name: 'Glacial Armor', unlock: 'Constellation C4', description: 'When using Elemental Burst, grants a Cryo Shield absorbing DMG equal to 25% of Lohen Max HP.' },
    { level: 5, name: 'Astral Winter', unlock: 'Constellation C5', description: 'Increases Domain of Astral Frost level by 3. Max level is 15.' },
    { level: 6, name: 'Sovereign of the Frozen Crown', unlock: 'Constellation C6', description: 'During Frostbound Domain, Lohen CRIT DMG is increased by 60% and attacks ignore 30% of enemy DEF.' },
];

const lohenAscension = [
    { ascension_level: 'level_20', material_name: 'Shivada Jade Sliver', quantity: 1 },
    { ascension_level: 'level_20', material_name: 'Dandelion Seed', quantity: 3 },
    { ascension_level: 'level_20', material_name: 'Recruit\'s Insignia', quantity: 3 },
    { ascension_level: 'level_40', material_name: 'Shivada Jade Fragment', quantity: 3 },
    { ascension_level: 'level_40', material_name: 'Hoarfrost Core', quantity: 2 },
    { ascension_level: 'level_40', material_name: 'Dandelion Seed', quantity: 10 },
    { ascension_level: 'level_60', material_name: 'Shivada Jade Chunk', quantity: 6 },
    { ascension_level: 'level_60', material_name: 'Hoarfrost Core', quantity: 8 },
    { ascension_level: 'level_80', material_name: 'Shivada Jade Gemstone', quantity: 6 },
    { ascension_level: 'level_80', material_name: 'Hoarfrost Core', quantity: 20 },
];

seedCharacterDetails('lohen', lohenTalents, lohenPassives, lohenConstellations, lohenAscension);

// Seed generic high quality Natlan / Custom characters if empty
const customCharList = ['mualani', 'xilonen', 'chasca', 'ororon', 'mavuika', 'citlali', 'lan-yan', 'iansan', 'odette', 'alyosha', 'varesa', 'mizuki'];

customCharList.forEach((cid) => {
    const char = db.prepare('SELECT * FROM characters WHERE id = ?').get(cid);
    if (!char) return;

    const v = char.vision || 'Pyro';
    const name = char.name || cid;

    const talents = [
        { name: `${name} Basic Arts`, type: 'NORMAL_ATTACK', unlock: 'Normal Attack', description: `Performs up to 4 consecutive attacks dealing ${v} and Physical DMG.` },
        { name: `${name} Elemental Strike`, type: 'ELEMENTAL_SKILL', unlock: 'Elemental Skill', description: `Unleashes the power of ${v}, dealing AoE ${v} DMG and activating specialized combat stance.` },
        { name: `${name} Celestial Burst`, type: 'ELEMENTAL_BURST', unlock: 'Elemental Burst', description: `Gathers elemental energy to deliver a devastating burst of ${v} DMG to surrounding foes.` },
    ];

    const passives = [
        { name: `${v} Empowerment`, description: `Increases party ${v} DMG Bonus by 15%.`, unlock: 'Ascension 1', level: 1 },
        { name: 'Elemental Harmony', description: 'Triggering elemental reactions restores 6 Energy.', unlock: 'Ascension 4', level: 4 },
        { name: 'Resource Finder', description: 'Displays the location of regional resources on the mini-map.', unlock: 'Utility Passive', level: 1 },
    ];

    const constellations = [
        { level: 1, name: 'Starlit Awakening', unlock: 'Constellation C1', description: 'Increases Skill charges or reduces cooldown by 20%.' },
        { level: 2, name: 'Elemental Cascade', unlock: 'Constellation C2', description: 'Increases Elemental Skill DMG by 40%.' },
        { level: 3, name: 'Mastery of Skill', unlock: 'Constellation C3', description: 'Increases Skill level by 3.' },
        { level: 4, name: 'Barrier of Stars', unlock: 'Constellation C4', description: 'Restores Energy to all party members on Burst cast.' },
        { level: 5, name: 'Mastery of Burst', unlock: 'Constellation C5', description: 'Increases Burst level by 3.' },
        { level: 6, name: 'Apex Sovereign', unlock: 'Constellation C6', description: 'Gains 50% CRIT DMG and ignore 30% enemy DEF.' },
    ];

    const asc = [
        { ascension_level: 'level_20', material_name: 'Elemental Gem Sliver', quantity: 1 },
        { ascension_level: 'level_40', material_name: 'Elemental Boss Material', quantity: 2 },
        { ascension_level: 'level_60', material_name: 'Local Specialty', quantity: 20 },
        { ascension_level: 'level_80', material_name: 'Elemental Gemstone', quantity: 6 },
    ];

    seedCharacterDetails(cid, talents, passives, constellations, asc);
});

console.log('--- Seeding Completed Successfully ---');
