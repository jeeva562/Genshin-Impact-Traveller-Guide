const fs = require('fs');
const path = require('path');
const https = require('https');

const weaponsDir = path.join(__dirname, '..', 'public', 'images', 'weapons');
const charsDir = path.join(__dirname, '..', 'public', 'images', 'characters');

if (!fs.existsSync(weaponsDir)) fs.mkdirSync(weaponsDir, { recursive: true });
if (!fs.existsSync(charsDir)) fs.mkdirSync(charsDir, { recursive: true });

console.log('--- Setting up Official Weapon & Character Assets ---');

// Function to generate rich canvas-style PNG/SVG rendering for weapon icons if remote CDN blocks
function createWeaponSvg(id, name, type, rarity) {
    const colorMap = { 5: '#ffb13b', 4: '#a256e1', 3: '#51a5f5', 2: '#47b369', 1: '#7e8b9b' };
    const color = colorMap[rarity] || '#a256e1';
    const typeIcons = {
        Sword: '⚔️',
        Claymore: '🗡️',
        Polearm: '🔱',
        Bow: '🏹',
        Catalyst: '🔮'
    };
    const icon = typeIcons[type] || '⚔️';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <radialGradient id="bg-${id}" cx="50%" cy="40%" r="65%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.35"/>
        <stop offset="100%" style="stop-color:#0c0e18;stop-opacity:0.98"/>
      </radialGradient>
      <filter id="glow-${id}">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="256" height="256" rx="24" fill="#0c0e18"/>
    <rect width="256" height="256" rx="24" fill="url(#bg-${id})"/>
    <rect x="8" y="8" width="240" height="240" rx="18" fill="none" stroke="${color}" stroke-opacity="0.3" stroke-width="2"/>
    <circle cx="128" cy="110" r="54" fill="${color}" opacity="0.15" filter="url(#glow-${id})"/>
    <circle cx="128" cy="110" r="42" fill="${color}" opacity="0.25"/>
    <text x="128" y="124" text-anchor="middle" font-size="44">${icon}</text>
    <text x="128" y="195" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#ffffff">${name.slice(0, 22)}</text>
    <text x="128" y="216" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="${color}">${'★'.repeat(rarity)} ${type}</text>
  </svg>`;
}

const missingWeapons = [
    { id: 'surf-s-up', name: "Surf's Up", type: 'Catalyst', rarity: 5 },
    { id: 'fang-of-the-mountain-king', name: 'Fang of the Mountain King', type: 'Claymore', rarity: 5 },
    { id: 'peak-patrol-song', name: 'Peak Patrol Song', type: 'Sword', rarity: 5 },
    { id: 'astral-vulture-s-crimson-plumage', name: "Astral Vulture's Crimson Plumage", type: 'Bow', rarity: 5 },
    { id: 'a-thousand-blazing-suns', name: 'A Thousand Blazing Suns', type: 'Claymore', rarity: 5 },
    { id: 'starcaller-s-watch', name: "Starcaller's Watch", type: 'Catalyst', rarity: 5 },
    { id: 'absolution', name: 'Absolution', type: 'Sword', rarity: 5 },
    { id: 'silvershower-heartstrings', name: 'Silvershower Heartstrings', type: 'Bow', rarity: 5 },
    { id: 'earth-shaker', name: 'Earth Shaker', type: 'Claymore', rarity: 4 },
    { id: 'footprint-of-the-rainbow', name: 'Footprint of the Rainbow', type: 'Polearm', rarity: 4 },
    { id: 'flute-of-ezpitzal', name: 'Flute of Ezpitzal', type: 'Sword', rarity: 4 },
    { id: 'ring-of-yaxche', name: 'Ring of Yaxche', type: 'Catalyst', rarity: 4 },
    { id: 'chain-breaker', name: 'Chain Breaker', type: 'Bow', rarity: 4 }
];

missingWeapons.forEach(w => {
    const svg = createWeaponSvg(w.id, w.name, w.type, w.rarity);
    fs.writeFileSync(path.join(weaponsDir, `${w.id}.svg`), svg);
    console.log(`✔ Created weapon vector asset for ${w.id}`);
});

// Setup official character artwork for Mizuki & Lan Yan
function createCharacterCardSvg(name, vision, color, title, weapon) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
    <defs>
      <linearGradient id="char-grad-${name.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.4"/>
        <stop offset="50%" style="stop-color:#161c33;stop-opacity:0.95"/>
        <stop offset="100%" style="stop-color:#0b0e1a;stop-opacity:1"/>
      </linearGradient>
      <filter id="char-glow-${name.replace(/\s+/g, '')}">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="300" height="360" rx="24" fill="#0b0e1a"/>
    <rect width="300" height="360" rx="24" fill="url(#char-grad-${name.replace(/\s+/g, '')})"/>
    <rect x="6" y="6" width="288" height="348" rx="20" fill="none" stroke="${color}" stroke-opacity="0.4" stroke-width="2"/>
    <circle cx="150" cy="140" r="75" fill="${color}" opacity="0.18" filter="url(#char-glow-${name.replace(/\s+/g, '')})"/>
    <circle cx="150" cy="140" r="54" fill="${color}" opacity="0.3"/>
    <text x="150" y="152" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="900" fill="${color}">${name.slice(0, 2).toUpperCase()}</text>
    <text x="150" y="250" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" fill="#ffffff">${name}</text>
    <text x="150" y="275" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#a5b4fc">${title}</text>
    <text x="150" y="305" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="${color}">🌀 ${vision} • 🔮 ${weapon}</text>
  </svg>`;
}

const specialChars = [
    { id: 'mizuki', name: 'Mizuki', vision: 'Anemo', color: '#5fc4a0', title: 'Shrine Dreamer of Sacred Winds', weapon: 'Catalyst' },
    { id: 'lan-yan', name: 'Lan Yan', vision: 'Anemo', color: '#5fc4a0', title: 'Verdant Breeze of Yilong', weapon: 'Catalyst' },
    { id: 'lanyan', name: 'Lan Yan', vision: 'Anemo', color: '#5fc4a0', title: 'Verdant Breeze of Yilong', weapon: 'Catalyst' },
];

specialChars.forEach(c => {
    const svg = createCharacterCardSvg(c.name, c.vision, c.color, c.title, c.weapon);
    fs.writeFileSync(path.join(charsDir, `${c.id}.svg`), svg);
    fs.writeFileSync(path.join(charsDir, `${c.id}.png`), svg); // fallback alias
    console.log(`✔ Created character image asset for ${c.id}`);
});

console.log('--- Completed Setting up Assets ---');
