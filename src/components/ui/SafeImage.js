'use client';

import { useState, useEffect } from 'react';

/**
 * Safe client image component that gracefully falls back through a sequence
 * of CDN mirrors and custom SVG fallbacks if primary CDN images fail or 404.
 */
export default function SafeImage({
  src,
  alt = '',
  fallback,
  fallbacks = [],
  style = {},
  className = '',
  loading = 'lazy',
  ...props
}) {
  // Combine single fallback and array into ordered fallbacks list, filtering out src
  const rawList = Array.isArray(fallbacks) && fallbacks.length > 0
    ? fallbacks
    : fallback ? [fallback] : [];

  const fallbackList = rawList.filter((url) => url && url !== src);

  const [currentSrcIndex, setCurrentSrcIndex] = useState(-1);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset when src changes
    setCurrentSrcIndex(-1);
    setHasError(false);
  }, [src]);

  const activeSrc = currentSrcIndex === -1 ? src : fallbackList[currentSrcIndex];

  const handleError = () => {
    const nextIndex = currentSrcIndex + 1;
    if (nextIndex < fallbackList.length) {
      setCurrentSrcIndex(nextIndex);
    } else {
      setHasError(true);
    }
  };

  if (!activeSrc || hasError) {
    // Render a minimal SVG placeholder container if all sources fail
    return (
      <div
        className={`fallback-placeholder ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          color: 'var(--text-muted, #94a3b8)',
          fontSize: '0.8rem',
          textAlign: 'center',
          padding: '8px',
          ...style,
        }}
        {...props}
      >
        <span>{alt || 'Image'}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={activeSrc}
      alt={alt}
      style={style}
      className={className}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
}


