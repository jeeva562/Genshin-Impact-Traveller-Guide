import styles from './Badge.module.css';

/**
 * Badge component for labels, element tags, rarity, and status.
 */
export default function Badge({
  children,
  variant = 'default',
  rarity,
  size = 'md',
  className = '',
  style,
}) {
  const classes = [
    styles.badge,
    rarity ? styles[`rarity${rarity}`] : styles[variant] || styles.default,
    size === 'lg' ? styles.lg : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}

/**
 * Star rating display for rarity.
 */
export function StarRating({ rarity = 1, size = 14 }) {
  const color =
    rarity >= 5
      ? 'var(--rarity-5)'
      : rarity >= 4
      ? 'var(--rarity-4)'
      : rarity >= 3
      ? 'var(--rarity-3)'
      : 'var(--rarity-2)';

  return (
    <span
      aria-label={`${rarity} star rarity`}
      style={{ display: 'inline-flex', gap: '1px', fontSize: `${size}px`, color }}
    >
      {Array.from({ length: rarity }, (_, i) => (
        <span key={i} aria-hidden="true">★</span>
      ))}
    </span>
  );
}
