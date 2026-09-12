const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'genshin-guide.db');
const db = new Database(dbPath);

console.log('--- Updating Lohen to Polearm ---');

// Update base character record
db.prepare(`
  UPDATE characters SET
    weapon_type = 'Polearm',
    weapon_type_key = 'POLEARM',
    description = 'A noble Mondstadt spear master who commands ancient glacial frost and sub-zero polearm thrusts with unyielding grace and chivalric honor.',
    last_updated = datetime('now')
  WHERE id = 'lohen'
`).run();

// Clear and update talents for Lohen
db.prepare('DELETE FROM character_talents WHERE character_id = ?').run('lohen');
const insertTalent = db.prepare(`
  INSERT INTO character_talents (character_id, name, type, unlock, description, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertTalent.run('lohen', 'Favonius Frostspear', 'NORMAL_ATTACK', 'Normal Attack', 'Performs up to 5 rapid polearm thrusts and sweep strikes dealing Physical and Cryo DMG. Charged Attack consumes stamina to lunge forward with a spinning spear charge.', 1);
insertTalent.run('lohen', 'Glacial Thrust', 'ELEMENTAL_SKILL', 'Elemental Skill', 'Lunges forward with a frost-infused lance, dealing AoE Cryo DMG and creating a Frostbound Domain for 10s. While inside the domain, Lohen gains Cryo Infusion and +20% Movement Speed.', 2);
insertTalent.run('lohen', 'Domain of Astral Frost', 'ELEMENTAL_BURST', 'Elemental Burst', 'Drives a celestial frost lance into the ground, dealing massive AoE Cryo DMG and freezing nearby foes. Party members gain +20% Cryo DMG Bonus and +15% CRIT DMG for 15s.', 3);

// Update build presets for Lohen
db.prepare('DELETE FROM build_presets WHERE character_id = ?').run('lohen');
db.prepare(`
  INSERT INTO build_presets (character_id, preset_name, preset_type, weapon_ids, artifact_set_ids, main_stats, sub_stats, role, notes, confidence)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    'lohen',
    'Frostbound Spear DPS',
    'general',
    JSON.stringify(['staff-of-homa', 'primordial-jade-winged-spear', 'calamity-queller', 'favonius-lance']),
    JSON.stringify(['blizzard-strayer', 'gladiators-finale']),
    JSON.stringify({ sands: 'ATK% / Energy Recharge', goblet: 'Cryo DMG Bonus', circlet: 'CRIT Rate / CRIT DMG' }),
    JSON.stringify(['CRIT Rate', 'CRIT DMG', 'ATK%', 'Energy Recharge']),
    'Main DPS / Cryo Enabler',
    'Focus on maintaining Frostbound Domain Cryo infusion with high CRIT stats and Glacial Thrust charged lunges.',
    'High'
);

console.log('✔ Updated Lohen weapon type to Polearm, updated talents & build presets');

// Ensure image assets exist for mizuki, lan-yan, and lohen in public/images/characters/
const charDir = path.join(__dirname, '..', 'public', 'images', 'characters');
if (!fs.existsSync(charDir)) {
    fs.mkdirSync(charDir, { recursive: true });
}

// Function to generate clean vector SVG artwork for custom characters
function createCharacterSvg(name, vision, color, weapon) {
    const initials = name.slice(0, 2).toUpperCase();
    return `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="320" viewBox="0 0 280 320">
    <defs>
      <radialGradient id="bg-${name}" cx="50%" cy="30%" r="70%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.35"/>
        <stop offset="100%" style="stop-color:#0b0d17;stop-opacity:0.95"/>
      </radialGradient>
      <filter id="glow-${name}">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="280" height="320" rx="20" fill="#0b0d17"/>
    <rect width="280" height="320" rx="20" fill="url(#bg-${name})"/>
    <circle cx="140" cy="130" r="65" fill="${color}" opacity="0.15" filter="url(#glow-${name})"/>
    <circle cx="140" cy="130" r="48" fill="${color}" opacity="0.25"/>
    <text x="140" y="142" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="900" fill="${color}">${initials}</text>
    <text x="140" y="245" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" fill="#ffffff">${name}</text>
    <text x="140" y="272" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="${color}">${vision} • ${weapon}</text>
  </svg>`;
}

const customArtMap = {
    mizuki: { name: 'Mizuki', vision: 'Anemo', color: '#5fc4a0', weapon: 'Catalyst' },
    'lan-yan': { name: 'Lan Yan', vision: 'Anemo', color: '#5fc4a0', weapon: 'Catalyst' },
    lanyan: { name: 'Lan Yan', vision: 'Anemo', color: '#5fc4a0', weapon: 'Catalyst' },
    lohen: { name: 'Lohen', vision: 'Cryo', color: '#9be5f3', weapon: 'Polearm' },
};

Object.entries(customArtMap).forEach(([id, meta]) => {
    const svgContent = createCharacterSvg(meta.name, meta.vision, meta.color, meta.weapon);

    // Write SVG fallbacks and image assets
    const svgPath = path.join(charDir, `${id}.svg`);
    fs.writeFileSync(svgPath, svgContent);

    console.log(`✔ Generated character image asset for ${id}`);
});

console.log('--- Finished Lohen Polearm & Image Asset Updates ---');
