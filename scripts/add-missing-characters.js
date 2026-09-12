/**
 * Add missing characters to the Genshin Guide database.
 * Adds Snezhnaya V7.0 characters and any others missing from the roster.
 */

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'genshin-guide.db'));

const MISSING_CHARACTERS = [
  // Snezhnaya V7.0
  {
    id: 'odette',
    name: 'Odette',
    vision: 'Cryo',
    weapon_type: 'Catalyst',
    rarity: 5,
    nation: 'Snezhnaya',
    title: 'Prima Ballerina of the Snowlands',
    description: 'A graceful and formidable 5-star Cryo catalyst wielder from Snezhnaya, Odette commands frost with the elegance of a prima ballerina performing on the grandest stage.',
    vision_key: 'CRYO',
    weapon_type_key: 'CATALYST',
  },
  {
    id: 'alyosha',
    name: 'Alyosha',
    vision: 'Electro',
    weapon_type: 'Polearm',
    rarity: 4,
    nation: 'Snezhnaya',
    title: 'Faithful Soldier of the North',
    description: 'A dedicated 4-star Electro polearm support from Snezhnaya, Alyosha serves the Tsaritsa\'s army with unwavering loyalty and precise lightning strikes.',
    vision_key: 'ELECTRO',
    weapon_type_key: 'POLEARM',
  },
  // Natlan missing characters
  {
    id: 'varesa',
    name: 'Varesa',
    vision: 'Electro',
    weapon_type: 'Catalyst',
    rarity: 5,
    nation: 'Natlan',
    title: 'Blazing Fist of the Ring',
    description: 'A powerful 5-star Electro catalyst brawler from Natlan who channels lightning through her fists in the sacred fighting arena.',
    vision_key: 'ELECTRO',
    weapon_type_key: 'CATALYST',
  },
  {
    id: 'mizuki',
    name: 'Mizuki',
    vision: 'Anemo',
    weapon_type: 'Catalyst',
    rarity: 5,
    nation: 'Inazuma',
    title: 'Shrine Dreamer of Sacred Winds',
    description: 'A 5-star Anemo catalyst user from Inazuma whose dreamlike abilities create windborne sanctuaries that heal and protect allies.',
    vision_key: 'ANEMO',
    weapon_type_key: 'CATALYST',
  },
];

// Check which characters already exist
const existingIds = db.prepare('SELECT id FROM characters').all().map(r => r.id);

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO characters (id, name, vision, weapon_type, rarity, nation, title, description, vision_key, weapon_type_key, source)
  VALUES (@id, @name, @vision, @weapon_type, @rarity, @nation, @title, @description, @vision_key, @weapon_type_key, 'manual')
`);

let added = 0;
for (const char of MISSING_CHARACTERS) {
  if (!existingIds.includes(char.id)) {
    insertStmt.run(char);
    console.log(`✅ Added: ${char.name} (${char.rarity}★ ${char.vision} ${char.weapon_type}) — ${char.nation}`);
    added++;
  } else {
    console.log(`⏭️ Skipped: ${char.name} (already exists)`);
  }
}

console.log(`\n📊 Done. Added ${added} new characters. Total: ${db.prepare('SELECT COUNT(*) as count FROM characters').get().count}`);
db.close();
