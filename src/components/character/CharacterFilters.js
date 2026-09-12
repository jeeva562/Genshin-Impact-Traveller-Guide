'use client';

import ElementIcon from '@/components/ui/ElementIcon';
import { ELEMENTS, WEAPON_TYPES } from '@/lib/constants';
import styles from './CharacterFilters.module.css';

/**
 * Filter bar component for characters list.
 *
 * @param {object} props
 * @param {object} props.filters - Active filters { vision, weapon_type, rarity, search }
 * @param {function} props.onFilterChange - Callback when filter changes
 * @param {number} props.totalResults - Total count of matching characters
 */
export default function CharacterFilters({
  filters,
  onFilterChange,
  totalResults,
}) {
  const { vision = '', weapon_type = '', rarity = '', search = '' } = filters;

  const handleUpdate = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: filters[key] === value ? '' : value, // toggle if already active
    });
  };

  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      vision: '',
      weapon_type: '',
      rarity: '',
      search: '',
    });
  };

  const hasActiveFilters = vision || weapon_type || rarity || search;

  return (
    <div className={styles.filtersContainer} role="region" aria-label="Character filters">
      {/* Search and Reset */}
      <div className={styles.searchRow}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search characters by name..."
            value={search}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search characters"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className={styles.clearButton}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Element / Vision Filter */}
      <div className={styles.filterGroupRow}>
        <span className={styles.groupLabel}>Element / Vision</span>
        <div className={styles.pillList} role="group" aria-label="Filter by element">
          <button
            type="button"
            className={`${styles.pill} ${!vision ? styles.pillActive : ''}`}
            onClick={() => handleUpdate('vision', '')}
          >
            All Elements
          </button>
          {Object.keys(ELEMENTS).map((elem) => (
            <button
              key={elem}
              type="button"
              className={`${styles.pill} ${vision === elem ? styles.pillActive : ''}`}
              onClick={() => handleUpdate('vision', elem)}
            >
              <ElementIcon element={elem} size={14} />
              <span>{elem}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weapon Type Filter */}
      <div className={styles.filterGroupRow}>
        <span className={styles.groupLabel}>Weapon Type</span>
        <div className={styles.pillList} role="group" aria-label="Filter by weapon type">
          <button
            type="button"
            className={`${styles.pill} ${!weapon_type ? styles.pillActive : ''}`}
            onClick={() => handleUpdate('weapon_type', '')}
          >
            All Weapons
          </button>
          {Object.entries(WEAPON_TYPES).map(([name, item]) => (
            <button
              key={name}
              type="button"
              className={`${styles.pill} ${weapon_type === name ? styles.pillActive : ''}`}
              onClick={() => handleUpdate('weapon_type', name)}
            >
              <span>{item.icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rarity Filter */}
      <div className={styles.filterGroupRow}>
        <span className={styles.groupLabel}>Rarity</span>
        <div className={styles.pillList} role="group" aria-label="Filter by rarity">
          <button
            type="button"
            className={`${styles.pill} ${!rarity ? styles.pillActive : ''}`}
            onClick={() => handleUpdate('rarity', '')}
          >
            All Rarities
          </button>
          <button
            type="button"
            className={`${styles.pill} ${rarity === '5' ? styles.pillActive : ''}`}
            onClick={() => handleUpdate('rarity', '5')}
          >
            <span style={{ color: '#fbbf24' }}>★★★★★</span> 5-Star
          </button>
          <button
            type="button"
            className={`${styles.pill} ${rarity === '4' ? styles.pillActive : ''}`}
            onClick={() => handleUpdate('rarity', '4')}
          >
            <span style={{ color: '#a78bfa' }}>★★★★</span> 4-Star
          </button>
        </div>
      </div>

      <div className={styles.activeCount}>
        Showing <strong>{totalResults}</strong> matching character{totalResults === 1 ? '' : 's'}
      </div>
    </div>
  );
}
