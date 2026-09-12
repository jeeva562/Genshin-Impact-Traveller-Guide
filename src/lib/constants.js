/** Genshin Impact element definitions with colors and SVG paths */

export const ELEMENTS = {
  Pyro: {
    id: 'pyro',
    name: 'Pyro',
    color: '#e8553a',
    colorLight: '#ff7b5e',
    colorDark: '#b83d28',
    bgColor: 'rgba(232, 85, 58, 0.12)',
    cssClass: 'element-pyro',
    description: 'The element of fire',
  },
  Hydro: {
    id: 'hydro',
    name: 'Hydro',
    color: '#4f8fd4',
    colorLight: '#72aee8',
    colorDark: '#3a6da6',
    bgColor: 'rgba(79, 143, 212, 0.12)',
    cssClass: 'element-hydro',
    description: 'The element of water',
  },
  Anemo: {
    id: 'anemo',
    name: 'Anemo',
    color: '#5fc4a0',
    colorLight: '#7dd8b8',
    colorDark: '#43957a',
    bgColor: 'rgba(95, 196, 160, 0.12)',
    cssClass: 'element-anemo',
    description: 'The element of wind',
  },
  Electro: {
    id: 'electro',
    name: 'Electro',
    color: '#9b6ed6',
    colorLight: '#b48de8',
    colorDark: '#7952a8',
    bgColor: 'rgba(155, 110, 214, 0.12)',
    cssClass: 'element-electro',
    description: 'The element of lightning',
  },
  Dendro: {
    id: 'dendro',
    name: 'Dendro',
    color: '#7bb42d',
    colorLight: '#98d14a',
    colorDark: '#5e8a20',
    bgColor: 'rgba(123, 180, 45, 0.12)',
    cssClass: 'element-dendro',
    description: 'The element of nature',
  },
  Cryo: {
    id: 'cryo',
    name: 'Cryo',
    color: '#72b8d4',
    colorLight: '#97d0e8',
    colorDark: '#5490a6',
    bgColor: 'rgba(114, 184, 212, 0.12)',
    cssClass: 'element-cryo',
    description: 'The element of ice',
  },
  Geo: {
    id: 'geo',
    name: 'Geo',
    color: '#d4a832',
    colorLight: '#e8c050',
    colorDark: '#a68425',
    bgColor: 'rgba(212, 168, 50, 0.12)',
    cssClass: 'element-geo',
    description: 'The element of earth',
  },
};

export const WEAPON_TYPES = {
  Sword: { id: 'sword', name: 'Sword', icon: '⚔️' },
  Claymore: { id: 'claymore', name: 'Claymore', icon: '🗡️' },
  Polearm: { id: 'polearm', name: 'Polearm', icon: '🔱' },
  Bow: { id: 'bow', name: 'Bow', icon: '🏹' },
  Catalyst: { id: 'catalyst', name: 'Catalyst', icon: '📖' },
};

export const RARITY_COLORS = {
  5: { color: '#c8913a', bg: 'rgba(200, 145, 58, 0.15)', label: '5★' },
  4: { color: '#9370db', bg: 'rgba(147, 112, 219, 0.15)', label: '4★' },
  3: { color: '#4682b4', bg: 'rgba(70, 130, 180, 0.15)', label: '3★' },
  2: { color: '#2e8b57', bg: 'rgba(46, 139, 87, 0.15)', label: '2★' },
  1: { color: '#808080', bg: 'rgba(128, 128, 128, 0.15)', label: '1★' },
};

export const CHARACTER_ROLES = [
  'Main DPS',
  'Sub DPS',
  'Support',
  'Healer',
  'Shielder',
  'Buffer',
  'Reaction Enabler',
];

export const REGIONS = [
  { id: 'mondstadt', name: 'Mondstadt' },
  { id: 'liyue', name: 'Liyue' },
  { id: 'inazuma', name: 'Inazuma' },
  { id: 'sumeru', name: 'Sumeru' },
  { id: 'fontaine', name: 'Fontaine' },
  { id: 'natlan', name: 'Natlan' },
  { id: 'snezhnaya', name: 'Snezhnaya' },
];

export const STAT_NAMES = {
  hp: 'HP',
  atk: 'ATK',
  def: 'DEF',
  em: 'Elemental Mastery',
  er: 'Energy Recharge',
  cr: 'CRIT Rate',
  cd: 'CRIT DMG',
  healingBonus: 'Healing Bonus',
  pyroDmg: 'Pyro DMG Bonus',
  hydroDmg: 'Hydro DMG Bonus',
  electroDmg: 'Electro DMG Bonus',
  anemoDmg: 'Anemo DMG Bonus',
  cryoDmg: 'Cryo DMG Bonus',
  geoDmg: 'Geo DMG Bonus',
  dendroDmg: 'Dendro DMG Bonus',
  physDmg: 'Physical DMG Bonus',
};

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const NAV_ITEMS = [
  { label: 'Characters', href: '/characters', icon: 'users' },
  { label: 'Weapons', href: '/weapons', icon: 'sword' },
  { label: 'Artifacts', href: '/artifacts', icon: 'shield' },
  { label: 'Teams', href: '/teams', icon: 'team' },
  { label: 'World & Map', href: '/world', icon: 'globe' },
  { label: 'Farming', href: '/farming', icon: 'calendar' },
  { label: 'Planner', href: '/planner', icon: 'chart' },
  { label: 'Guides', href: '/guides', icon: 'book' },
];

export const API_BASE_URL = 'https://genshin.jmp.blue';
export const API_RATE_LIMIT_MS = 200; // Minimum ms between API calls
export const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache
export const SITE_NAME = 'Traveller Guide';
export const SITE_DESCRIPTION = 'Build Smarter. Play Better. — A professional Genshin Impact companion.';
