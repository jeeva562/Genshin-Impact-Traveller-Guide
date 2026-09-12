import styles from './Skeleton.module.css';

/**
 * Skeleton loading placeholder.
 *
 * @param {'text'|'title'|'avatar'|'card'|'thumbnail'} variant
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) {
  const classes = [styles.skeleton, styles[variant], className].filter(Boolean).join(' ');
  const inlineStyle = {};
  if (width) inlineStyle.width = width;
  if (height) inlineStyle.height = height;

  if (count > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={classes} style={inlineStyle} />
        ))}
      </div>
    );
  }

  return <div className={classes} style={inlineStyle} />;
}

/**
 * Skeleton card for loading states in grids.
 */
export function SkeletonCard() {
  return (
    <div className={styles.skeleton} style={{
      height: '280px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-secondary)',
    }} />
  );
}
