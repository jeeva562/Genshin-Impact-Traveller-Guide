/**
 * EmptyState and ErrorState components for polished UX.
 */
import Button from './Button';
import styles from './EmptyState.module.css';

export function EmptyState({
  icon = '🔍',
  title = 'Nothing found',
  description = 'Try adjusting your filters or search terms.',
  action,
  actionLabel,
}) {
  return (
    <div className={styles.container} role="status">
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && actionLabel && (
        <Button variant="secondary" onClick={action} className={styles.action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this information right now.",
  onRetry,
}) {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon} aria-hidden="true">⚠️</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className={styles.action}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.description}>{message}</p>
    </div>
  );
}
