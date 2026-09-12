'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import styles from './Header.module.css';

export default function Header({ onSearchOpen }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchOpen]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo} aria-label="Traveller Guide Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/paimon_icon.png"
              alt="Paimon Logo"
              className={styles.logoImg}
              width={34}
              height={34}
            />
            <span className={styles.logoText}>
              Traveller<span className={styles.logoAccent}> Guide</span>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_ITEMS.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname.startsWith(item.href) ? styles.navLinkActive : ''
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.searchBtn}
            onClick={onSearchOpen}
            aria-label="Open search"
          >
            <span aria-hidden="true">🔍</span>
            <span className={styles.searchLabel}>Search...</span>
            <kbd className={styles.searchKbd} aria-hidden="true">⌘K</kbd>
          </button>

          <button
            className={styles.mobileBtn}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayVisible : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile nav drawer */}
      <nav
        className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavVisible : ''}`}
        aria-label="Mobile navigation"
      >
        <button
          className={styles.mobileClose}
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        >
          ✕
        </button>

        <button
          className={styles.mobileSearchTrigger}
          onClick={() => {
            setMobileOpen(false);
            onSearchOpen?.();
          }}
        >
          <span>🔍</span> Search Guide...
        </button>

        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.mobileNavLink}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

