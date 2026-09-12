import styles from './Card.module.css';

/**
 * Layered card with depth, hover effects, and optional accent stripe.
 *
 * @param {object} props
 * @param {boolean} props.interactive - Adds hover lift effect
 * @param {boolean} props.elevated - Elevated background + shadow
 * @param {boolean} props.glass - Glassmorphism variant (use sparingly)
 * @param {'top'|'left'|null} props.accent - Element color accent stripe
 * @param {'none'|'sm'|'md'|'lg'} props.padding
 * @param {object} props.style - Custom inline styles (e.g., element CSS vars)
 */
export default function Card({
  children,
  interactive = false,
  elevated = false,
  glass = false,
  accent = null,
  padding = 'md',
  header,
  footer,
  className = '',
  style,
  onClick,
  ...props
}) {
  const classes = [
    styles.card,
    interactive ? styles.interactive : '',
    elevated ? styles.elevated : '',
    glass ? styles.glass : '',
    accent === 'top' ? styles.accentTop : '',
    accent === 'left' ? styles.accentLeft : '',
    padding === 'none' ? styles.padNone : '',
    padding === 'sm' ? styles.padSm : '',
    padding === 'lg' ? styles.padLg : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={classes}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Tag>
  );
}
