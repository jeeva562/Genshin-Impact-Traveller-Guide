'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalSearch from '@/components/search/GlobalSearch';

export default function AppShell({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header onSearchOpen={openSearch} />
      <main id="main-content" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
        {children}
      </main>
      <Footer />
      {searchOpen && <GlobalSearch onClose={closeSearch} />}
    </>
  );
}
