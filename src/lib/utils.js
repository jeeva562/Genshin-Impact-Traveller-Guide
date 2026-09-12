/**
 * General utility functions used throughout the application.
 */

import { ELEMENTS } from './constants';

/**
 * Convert a slug like "hu-tao" to title case "Hu Tao".
 */
export function slugToTitle(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert a title like "Hu Tao" to slug "hu-tao".
 */
export function titleToSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function call.
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Format a number with commas (e.g., 1000000 → "1,000,000").
 */
export function formatNumber(num) {
  if (num == null) return 'N/A';
  return Number(num).toLocaleString();
}

/**
 * Format a percentage (e.g., 0.456 → "45.6%").
 */
export function formatPercent(value) {
  if (value == null) return 'N/A';
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Create a delay promise.
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON with a fallback.
 */
export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Get the element CSS class for a vision string.
 */
export function getElementClass(vision) {
  if (!vision) return '';
  return `element-${vision.toLowerCase()}`;
}

/**
 * Truncate text to a specified length.
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generate a stable hash for caching purposes.
 */
export function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get today's day name.
 */
export function getTodayName() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
}

/**
 * Check if a material is farmable today based on its availability days.
 */
export function isFarmableToday(availabilityDays) {
  if (!availabilityDays || !Array.isArray(availabilityDays)) return true;
  const today = getTodayName();
  return availabilityDays.includes(today);
}

/**
 * Normalize a vision string (handles API inconsistencies).
 */
export function normalizeVision(vision) {
  if (!vision) return '';
  const map = {
    PYRO: 'Pyro',
    HYDRO: 'Hydro',
    ANEMO: 'Anemo',
    ELECTRO: 'Electro',
    DENDRO: 'Dendro',
    CRYO: 'Cryo',
    GEO: 'Geo',
  };
  return map[vision.toUpperCase()] || capitalize(vision.toLowerCase());
}

/**
 * Normalize a weapon type string.
 */
export function normalizeWeaponType(type) {
  if (!type) return '';
  const map = {
    SWORD: 'Sword',
    CLAYMORE: 'Claymore',
    POLEARM: 'Polearm',
    BOW: 'Bow',
    CATALYST: 'Catalyst',
  };
  return map[type.toUpperCase()] || capitalize(type.toLowerCase());
}

/**
 * Create a CSS custom property object from element color.
 */
export function elementStyleVars(vision) {
  const key = Object.keys(ELEMENTS).find(
    (k) => k.toLowerCase() === (vision || '').toLowerCase()
  );
  if (!key) return {};
  const el = ELEMENTS[key];
  return {
    '--element-color': el.color,
    '--element-bg': el.bgColor,
    '--element-light': el.colorLight,
    '--element-dark': el.colorDark,
  };
}
