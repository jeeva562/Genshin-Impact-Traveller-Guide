'use client';

import { ELEMENTS } from '@/lib/constants';

/**
 * Original SVG element icons for Genshin Impact elements.
 * Custom vector path representation for Pyro, Hydro, Anemo, Electro, Dendro, Cryo, Geo.
 *
 * @param {object} props
 * @param {string} props.element - Vision name (e.g., 'Pyro', 'Hydro')
 * @param {number|string} [props.size=20] - Size in pixels
 * @param {string} [props.className=''] - Extra classes
 * @param {boolean} [props.showLabel=false] - Whether to render text label next to icon
 */
export default function ElementIcon({
  element,
  size = 20,
  className = '',
  showLabel = false,
  style = {},
}) {
  if (!element) return null;

  const normalized = Object.keys(ELEMENTS).find(
    (k) => k.toLowerCase() === element.toLowerCase()
  ) || 'Pyro';

  const cfg = ELEMENTS[normalized] || { color: '#888', name: element };
  const numSize = typeof size === 'number' ? size : parseInt(size, 10) || 20;

  // Custom original SVG glyph paths for each element
  const renderGlyph = () => {
    switch (normalized.toLowerCase()) {
      case 'pyro':
        // Stylized flame with teardrop core
        return (
          <path
            d="M12 2C10.5 4.8 11.2 7 9.8 8.8C8.5 10.4 6 12 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 11 14 8 13.8 5C13.5 4 13 2.8 12 2ZM12 18.5C10.6 18.5 9.5 17.4 9.5 16C9.5 14.3 10.8 13 12 11.5C13.2 13 14.5 14.3 14.5 16C14.5 17.4 13.4 18.5 12 18.5Z"
            fill="currentColor"
          />
        );
      case 'hydro':
        // Elegant water droplet with splash curves
        return (
          <path
            d="M12 2.5C10.2 5.5 6 11.2 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 11.2 13.8 5.5 12 2.5ZM12 19C10.1 19 8.5 17.4 8.5 15.5C8.5 13.2 10.8 9.5 12 7.5C13.2 9.5 15.5 13.2 15.5 15.5C15.5 17.4 13.9 19 12 19Z"
            fill="currentColor"
          />
        );
      case 'anemo':
        // Dynamic wind swirl / triskelion curves
        return (
          <path
            d="M12 3C8.5 3 5 5.5 5 9C5 11.8 7.2 13.2 9.5 13C10.8 12.9 11.5 11.8 11.5 10.5C11.5 9.1 10.4 8 9 8C7.9 8 7 8.9 7 10M12 21C15.5 21 19 18.5 19 15C19 12.2 16.8 10.8 14.5 11C13.2 11.1 12.5 12.2 12.5 13.5C12.5 14.9 13.6 16 15 16C16.1 16 17 15.1 17 14M4 14C5 17 8 19 12 19M20 10C19 7 16 5 12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'electro':
        // Sharp lightning spark with energy bolts
        return (
          <path
            d="M13 2L4 13H11L9 22L20 9H13L15 2H13Z"
            fill="currentColor"
          />
        );
      case 'dendro':
        // Living leaf sprig / sprouting vine
        return (
          <path
            d="M12 21C12 21 7 17 7 11C7 6.5 10.5 3 12 3C13.5 3 17 6.5 17 11C17 17 12 21 12 21ZM12 6C10.5 7.5 9 10 9 12.5C9 14.4 10.3 16 12 17M12 10C13 11 14 12.5 14 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'cryo':
        // Six-fold crystalline snowflake star
        return (
          <path
            d="M12 2V22M2 12H22M4.9 4.9L19.1 19.1M4.9 19.1L19.1 4.9M12 5L10 3M12 5L14 3M12 19L10 21M12 19L14 21M5 12L3 10M5 12L3 14M19 12L21 10M19 12L21 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'geo':
        // Solid interlocking diamond crest / prism
        return (
          <path
            d="M12 2L21 12L12 22L3 12L12 2ZM12 6.8L6.8 12L12 17.2L17.2 12L12 6.8Z"
            fill="currentColor"
          />
        );
      default:
        return <circle cx="12" cy="12" r="8" fill="currentColor" />;
    }
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: cfg.color,
        lineHeight: 1,
        verticalAlign: 'middle',
        ...style,
      }}
      title={cfg.name}
    >
      <svg
        width={numSize}
        height={numSize}
        viewBox="0 0 24 24"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {renderGlyph()}
      </svg>
      {showLabel && (
        <span style={{ fontWeight: 600, fontSize: `${Math.max(12, numSize * 0.7)}px` }}>
          {cfg.name}
        </span>
      )}
    </span>
  );
}
