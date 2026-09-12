'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Interactive3DViewer.module.css';

/**
 * Interactive 360° 3D Quality Inspector Modal
 * Allows full-size viewing, drag-to-rotate 360°, auto-orbit, and zoom inspection.
 */
export default function Interactive3DViewer({
  isOpen,
  onClose,
  title,
  type = 'Entity',
  imageUrl,
  fallbackUrl,
  accentColor = '#6366f1',
  rarity = 5,
}) {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl);

  const startPosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Reset image src when url changes
  useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-Orbit animation loop
  useEffect(() => {
    if (!isAutoOrbit || !isOpen) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const loop = (now) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setRotationY((prev) => (prev + delta * 35) % 360);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoOrbit, isOpen]);

  // Drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoOrbit(false);
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      startPosRef.current = { x: e.clientX, y: e.clientY };

      setRotationY((prev) => (prev + deltaX * 0.75) % 360);
      setRotationX((prev) => Math.max(-45, Math.min(45, prev - deltaY * 0.5)));
    },
    [isDragging]
  );

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setRotationY(0);
    setRotationX(0);
    setZoom(1);
    setIsAutoOrbit(false);
  };

  if (!isOpen) return null;

  const normalizedY = ((Math.round(rotationY) % 360) + 360) % 360;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="dialog"
      aria-modal="true"
      aria-label={`360 Degree Inspector for ${title}`}
      style={{
        '--viewer-accent': accentColor,
        '--viewer-accent-glow': `${accentColor}40`,
      }}
    >
      <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>
              <span>🔮 360° Inspection &bull; {title}</span>
            </h2>
            <span className={styles.headerBadge}>
              {'★'.repeat(rarity || 5)} {type}
            </span>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close Inspector"
          >
            ✕
          </button>
        </div>

        {/* Viewport Stage */}
        <div
          className={styles.viewportStage}
          onPointerDown={handlePointerDown}
          onWheel={(e) => {
            e.preventDefault();
            setZoom((prev) => Math.max(0.7, Math.min(2.5, prev - e.deltaY * 0.0015)));
          }}
        >
          {/* Holographic orbital rings */}
          <div className={styles.holoGrid} />
          <div className={styles.holoInnerRing} />

          {/* 3D Transform Object Container */}
          <div
            className={styles.object3DWrapper}
            style={{
              transform: `scale(${zoom}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={title}
              className={styles.objectImage}
              onError={() => {
                if (fallbackUrl && imgSrc !== fallbackUrl) {
                  setImgSrc(fallbackUrl);
                } else if (!imgSrc.startsWith('data:image/svg+xml')) {
                  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
                    <rect width="300" height="360" rx="20" fill="#0f111a"/>
                    <rect width="300" height="360" rx="20" fill="${accentColor}" opacity="0.15"/>
                    <circle cx="150" cy="140" r="60" fill="${accentColor}" opacity="0.2"/>
                    <text x="150" y="150" text-anchor="middle" font-size="44">🔮</text>
                    <text x="150" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#f8fafc">${(title || 'Entity').slice(0, 22)}</text>
                    <text x="150" y="280" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="${accentColor}">${type || ''}</text>
                  </svg>`;
                  setImgSrc(`data:image/svg+xml,${encodeURIComponent(svg)}`);
                }
              }}
            />
            <div className={styles.sheenOverlay} />
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolGroup}>
            <button
              type="button"
              className={`${styles.actionBtn} ${isAutoOrbit ? styles.actionActive : ''}`}
              onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            >
              <span>{isAutoOrbit ? '⏸️' : '🔄'}</span>
              <span>{isAutoOrbit ? 'Pause Orbit' : 'Auto 360° Orbit'}</span>
            </button>

            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
              title="Zoom In"
            >
              <span>🔍+</span>
            </button>

            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.25))}
              title="Zoom Out"
            >
              <span>🔍-</span>
            </button>

            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleReset}
            >
              <span>⏮️</span>
              <span>Reset Orientation</span>
            </button>
          </div>

          <div className={styles.toolGroup}>
            <div className={styles.rotationIndicator}>
              Yaw: {normalizedY}° | Pitch: {Math.round(rotationX)}° | Zoom: {zoom.toFixed(2)}x
            </div>
            <div className={styles.dragHint}>
              <span>👆 Drag or scroll to orbit &amp; inspect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
