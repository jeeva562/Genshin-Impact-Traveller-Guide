import styles from './Button.module.css';

/**
 * Premium button component with multiple variants and sizes.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'|'elementAccent'} props.variant
 * @param {'sm'|'md'|'lg'} props.size
 * @param {boolean} props.iconOnly
 * @param {React.ReactNode} props.children
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  className = '',
  style,
  ...props
}) {
  const classes = [
    styles.btn,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    iconOnly ? styles.iconOnly : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} style={style} {...props}>
      {children}
    </button>
  );
}
