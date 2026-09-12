'use client';
import { useState, useEffect, useCallback } from 'react';
import { safeJsonParse } from '@/lib/utils';

/**
 * Generic localStorage hook with JSON serialization.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      setValue(safeJsonParse(stored, defaultValue));
    }
    setLoaded(true);
  }, [key, defaultValue]);

  const set = useCallback(
    (newValue) => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  const remove = useCallback(() => {
    setValue(defaultValue);
    localStorage.removeItem(key);
  }, [key, defaultValue]);

  return [value, set, remove, loaded];
}

/**
 * Favorites management hook.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('tg-favorites', {});

  const toggleFavorite = useCallback(
    (type, id) => {
      setFavorites((prev) => {
        const next = { ...prev };
        if (!next[type]) next[type] = [];
        const idx = next[type].indexOf(id);
        if (idx > -1) {
          next[type] = next[type].filter((fid) => fid !== id);
        } else {
          next[type] = [...next[type], id];
        }
        return next;
      });
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (type, id) => {
      return favorites[type]?.includes(id) || false;
    },
    [favorites]
  );

  const getFavorites = useCallback(
    (type) => {
      return favorites[type] || [];
    },
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, getFavorites };
}

/**
 * Recently viewed items tracker.
 */
export function useRecentlyViewed(maxItems = 10) {
  const [recent, setRecent] = useLocalStorage('tg-recent', []);

  const addRecent = useCallback(
    (type, id, name) => {
      setRecent((prev) => {
        const filtered = prev.filter((item) => !(item.type === type && item.id === id));
        return [{ type, id, name, timestamp: Date.now() }, ...filtered].slice(0, maxItems);
      });
    },
    [setRecent, maxItems]
  );

  return { recent, addRecent };
}

/**
 * User mode hook (beginner vs advanced).
 */
export function useMode() {
  const [mode, setMode] = useLocalStorage('tg-mode', 'beginner');

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'beginner' ? 'advanced' : 'beginner'));
  }, [setMode]);

  const isAdvanced = mode === 'advanced';

  return { mode, setMode, toggleMode, isAdvanced };
}

export { useLocalStorage as useStorage };
