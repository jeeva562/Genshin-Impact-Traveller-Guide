'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from '@/lib/utils';
import styles from './GlobalSearch.module.css';

/**
 * Command-palette style global search (Ctrl+K).
 * Fetches from /api/search with categorized results.
 */
export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Debounced search
  const doSearch = useCallback(
    debounce(async (q) => {
      if (q.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 250),
    []
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(0);
    setLoading(true);
    doSearch(val);
  };

  const allItems = results.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.category }))
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && allItems[activeIndex]) {
      e.preventDefault();
      navigateTo(allItems[activeIndex]);
    }
  };

  const navigateTo = (item) => {
    if (item?.href) {
      router.push(item.href);
      onClose();
    }
  };

  const categoryIcons = {
    Characters: '👤',
    Weapons: '⚔️',
    Artifacts: '🏵️',
    Materials: '💎',
    default: '📄',
  };

  let flatCounter = 0;
  const categorizedWithIndices = results.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({
      ...item,
      flatIndex: flatCounter++,
    })),
  }));

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.modal} role="dialog" aria-label="Search" onKeyDown={handleKeyDown}>
        <div className={styles.inputWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search characters, weapons, artifacts, materials..."
            value={query}
            onChange={handleChange}
            aria-label="Search query"
          />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            ESC
          </button>
        </div>

        <div className={styles.results}>
          {query.length < 2 && !loading && (
            <div className={styles.noResults}>
              Type at least 2 characters to search
            </div>
          )}

          {query.length >= 2 && !loading && results.length === 0 && (
            <div className={styles.noResults}>
              No results for &quot;{query}&quot;
            </div>
          )}

          {categorizedWithIndices.map((cat) => (
            <div key={cat.category}>
              <div className={styles.category}>{cat.category}</div>
              {cat.items.map((item) => (
                <button
                  key={`${cat.category}-${item.id}`}
                  className={`${styles.resultItem} ${item.flatIndex === activeIndex ? styles.resultItemActive : ''
                    }`}
                  onClick={() => navigateTo(item)}
                >
                  <span
                    className={styles.resultIcon}
                    style={{ background: item.bgColor || 'var(--bg-surface)' }}
                  >
                    {categoryIcons[cat.category] || categoryIcons.default}
                  </span>
                  <div className={styles.resultInfo}>
                    <div className={styles.resultName}>{item.name}</div>
                    {item.meta && <div className={styles.resultMeta}>{item.meta}</div>}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    </>
  );
}
