/**
 * Asset abstraction layer for Genshin Impact Traveller Guide.
 * Provides high-quality official game art assets sourced from community CDNs (jmp.blue & paimon.moe)
 * with styled vector fallback chains to guarantee 100% asset display.
 */

import { ELEMENTS, WEAPON_TYPES, RARITY_COLORS } from './constants';

const CDN_PRIMARY = 'https://genshin.jmp.blue';
const CDN_SECONDARY = 'https://paimon.moe/images';

/**
 * Resolve an element name (case-insensitive) to its color config.
 */
export function getElementConfig(vision) {
  if (!vision) return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' };
  const key = Object.keys(ELEMENTS).find(
    (k) => k.toLowerCase() === vision.toLowerCase()
  );
  return key
    ? { color: ELEMENTS[key].color, bg: ELEMENTS[key].bgColor }
    : { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' };
}

export const LOCAL_CUSTOM_CHARACTERS = [
  'mualani',
  'xilonen',
  'chasca',
  'mavuika',
  'citlali',
  'ororon',
  'lan-yan',
  'lanyan',
  'iansan',
  'kinich',
  'kachina',
  'mizuki',
  'varesa',
  'odette',
  'alyosha',
  'lohen',
];

/**
 * Helper to normalize character slug for Paimon.moe CDN
 */
function normalizePaimonSlug(slug) {
  if (!slug) return '';
  return slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

/**
 * Get high-quality official character art primary URL.
 * @param {string} characterId - ID/slug of character (e.g., 'hu-tao', 'raiden')
 * @param {'icon'|'icon-big'|'portrait'|'gacha-splash'|'card'} [type='icon-big']
 */
export function getCharacterImage(characterId, vision, name, type = 'icon-big') {
  if (!characterId) return getCharacterFallback(characterId, vision, name);
  const cid = characterId.toLowerCase();
  const paimonSlug = normalizePaimonSlug(cid);

  if (LOCAL_CUSTOM_CHARACTERS.includes(cid)) {
    return `/images/characters/${cid}.png`;
  }
  return `${CDN_PRIMARY}/characters/${characterId}/${type}`;
}

/**
 * Return ordered array of fallback URLs for SafeImage component.
 */
export function getCharacterImageFallbacks(characterId, vision, name, type = 'icon-big') {
  if (!characterId) return [getCharacterFallback(characterId, vision, name)];
  const cid = characterId.toLowerCase();
  const paimonSlug = normalizePaimonSlug(cid);

  const primary = getCharacterImage(characterId, vision, name, type);
  const localPng = `/images/characters/${cid}.png`;
  const localIcon = `/images/characters/${cid}-icon.png`;
  const localSvg = `/images/characters/${cid}.svg`;

  let secondary = `${CDN_SECONDARY}/characters/${paimonSlug}.png`;
  if (type === 'gacha-splash' || type === 'portrait') {
    secondary = `${CDN_SECONDARY}/characters/full/${paimonSlug}.png`;
  }

  const tertiary = `${CDN_PRIMARY}/characters/${characterId}/icon-big`;
  const quaternary = `${CDN_PRIMARY}/characters/${characterId}/portrait`;
  const svgFallback = getCharacterFallback(characterId, vision, name);

  return [primary, localPng, localIcon, localSvg, secondary, tertiary, quaternary, svgFallback];
}

/**
 * High-res full gacha splash art with fallback list.
 */
export function getCharacterSplash(characterId) {
  if (!characterId) return '';
  const cid = characterId.toLowerCase();
  const paimonSlug = normalizePaimonSlug(cid);

  if (LOCAL_CUSTOM_CHARACTERS.includes(cid) || cid === 'nahida') {
    return `/images/characters/${cid}-splash.png`;
  }
  return `${CDN_PRIMARY}/characters/${characterId}/gacha-splash`;
}

export function getCharacterSplashFallbacks(characterId, vision, name) {
  if (!characterId) return [getCharacterFallback(characterId, vision, name)];
  const cid = characterId.toLowerCase();
  const primary = getCharacterSplash(characterId);
  const paimonSlug = normalizePaimonSlug(cid);
  const localPng = `/images/characters/${cid}.png`;
  const localSvg = `/images/characters/${cid}.svg`;
  const secondary = `${CDN_SECONDARY}/characters/full/${paimonSlug}.png`;
  const tertiary = `${CDN_PRIMARY}/characters/${characterId}/gacha-splash`;
  const svgFallback = getCharacterFallback(characterId, vision, name);
  return [primary, localPng, localSvg, secondary, tertiary, svgFallback];
}

/**
 * High-res character portrait.
 */
export function getCharacterPortrait(characterId) {
  if (!characterId) return '';

  const cid = characterId.toLowerCase();
  const paimonSlug = normalizePaimonSlug(cid);
  if (LOCAL_CUSTOM_CHARACTERS.includes(cid)) {
    return `${CDN_SECONDARY}/characters/full/${paimonSlug}.png`;
  }
  return `${CDN_PRIMARY}/characters/${characterId}/portrait`;
}

/**
 * Generate fallback SVG data URI if CDN image fails or character is custom.
 */
export function getCharacterFallback(characterId, vision, name) {
  const cid = (characterId || '').toLowerCase();
  const { color } = getElementConfig(vision);
  const initials = (name || characterId || '?')
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240">
    <defs>
      <linearGradient id="bg-${characterId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.25"/>
        <stop offset="100%" style="stop-color:#0f111a;stop-opacity:0.95"/>
      </linearGradient>
    </defs>
    <rect width="200" height="240" rx="16" fill="#0f111a"/>
    <rect width="200" height="240" rx="16" fill="url(#bg-${characterId})"/>
    <circle cx="100" cy="95" r="42" fill="${color}" opacity="0.2"/>
    <circle cx="100" cy="95" r="30" fill="${color}" opacity="0.3"/>
    <text x="100" y="105" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="800" fill="${color}">${initials}</text>
    <text x="100" y="195" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#f8fafc">${(name || characterId || '').slice(0, 18)}</text>
    <text x="100" y="215" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="${color}">${vision || ''}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get high-quality official weapon icon.
 */
export function getWeaponImage(weaponId, weaponType, name, rarity) {
  if (!weaponId) return getWeaponFallback(weaponId, weaponType, name, rarity);
  const wid = weaponId.toLowerCase();
  const paimonSlug = normalizePaimonSlug(wid);
  return `${CDN_PRIMARY}/weapons/${wid}/icon`;
}

export function getWeaponImageFallbacks(weaponId, weaponType, name, rarity) {
  if (!weaponId) return [getWeaponFallback(weaponId, weaponType, name, rarity)];
  const wid = weaponId.toLowerCase();
  const paimonSlug = normalizePaimonSlug(wid);

  const localPng = `/images/weapons/${wid}.png`;
  const localSvg = `/images/weapons/${wid}.svg`;
  const primary = `${CDN_PRIMARY}/weapons/${wid}/icon`;
  const secondary = `${CDN_SECONDARY}/weapons/${paimonSlug}.png`;
  const tertiary = `${CDN_PRIMARY}/weapons/${wid}/icon-big`;
  const svgFallback = getWeaponFallback(weaponId, weaponType, name, rarity);
  return [localPng, localSvg, primary, secondary, tertiary, svgFallback];
}


export function getWeaponFallback(weaponId, weaponType, name, rarity) {
  const rarityColor = RARITY_COLORS[rarity]?.color || '#fbbf24';
  const typeIcon = WEAPON_TYPES[weaponType]?.icon || '⚔️';
  const displayName = (name || weaponId || '').slice(0, 20);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="200" viewBox="0 0 180 200">
    <rect width="180" height="200" rx="14" fill="#131722"/>
    <rect width="180" height="200" rx="14" fill="${rarityColor}" opacity="0.12"/>
    <rect x="0" y="0" width="180" height="4" rx="2" fill="${rarityColor}" opacity="0.8"/>
    <text x="90" y="90" text-anchor="middle" font-size="36">${typeIcon}</text>
    <text x="90" y="150" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#f8fafc">${displayName}</text>
    <text x="90" y="172" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="${rarityColor}">${'★'.repeat(rarity || 4)}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get high-quality official artifact piece icon.
 */
export function getArtifactImage(setId, piece = 'flower-of-life') {
  if (!setId) return getArtifactFallback(setId);
  return `${CDN_PRIMARY}/artifacts/${setId}/${piece}`;
}

export function getArtifactImageFallbacks(setId, piece = 'flower-of-life', name) {
  if (!setId) return [getArtifactFallback(setId, name)];
  const primary = `${CDN_PRIMARY}/artifacts/${setId}/${piece}`;
  const paimonSlug = normalizePaimonSlug(setId);
  const secondary = `${CDN_SECONDARY}/artifacts/${paimonSlug}_${piece.replace(/-/g, '_')}.png`;
  const svgFallback = getArtifactFallback(setId, name);
  return [primary, secondary, svgFallback];
}

export function getArtifactFallback(setId, name) {
  const displayName = (name || setId || '').slice(0, 22);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="180" height="180" rx="14" fill="#131722"/>
    <rect width="180" height="180" rx="14" fill="#a78bfa" opacity="0.1"/>
    <circle cx="90" cy="72" r="30" fill="#a78bfa" opacity="0.2"/>
    <text x="90" y="80" text-anchor="middle" font-size="26">🏵️</text>
    <text x="90" y="140" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#f8fafc">${displayName}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Generate a material placeholder SVG.
 */
export function getMaterialImage(materialId, name, rarity) {
  const rarityColor = RARITY_COLORS[rarity]?.color || '#6b7280';
  const displayName = (name || materialId || '').slice(0, 20);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <rect width="80" height="80" rx="10" fill="#131722"/>
    <rect width="80" height="80" rx="10" fill="${rarityColor}" opacity="0.15"/>
    <circle cx="40" cy="35" r="18" fill="${rarityColor}" opacity="0.25"/>
    <text x="40" y="42" text-anchor="middle" font-size="16">💎</text>
    <text x="40" y="68" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" font-weight="600" fill="#f8fafc">${displayName}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

