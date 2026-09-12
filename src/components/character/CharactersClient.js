'use client';

import { useState, useMemo } from 'react';
import CharacterFilters from './CharacterFilters';
import CharacterGrid from './CharacterGrid';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CharactersClient({ initialCharacters = [] }) {
  const [filters, setFilters] = useState({
    vision: '',
    weapon_type: '',
    rarity: '',
    search: '',
  });

  const filteredCharacters = useMemo(() => {
    return initialCharacters.filter((char) => {
      // Vision filter
      if (filters.vision && char.vision?.toLowerCase() !== filters.vision.toLowerCase()) {
        return false;
      }
      // Weapon filter
      if (filters.weapon_type && char.weapon_type?.toLowerCase() !== filters.weapon_type.toLowerCase()) {
        return false;
      }
      // Rarity filter
      if (filters.rarity && Number(char.rarity) !== Number(filters.rarity)) {
        return false;
      }
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = char.name?.toLowerCase().includes(query);
        const matchesVision = char.vision?.toLowerCase().includes(query);
        const matchesWeapon = char.weapon_type?.toLowerCase().includes(query);
        const matchesNation = char.nation?.toLowerCase().includes(query);
        if (!matchesName && !matchesVision && !matchesWeapon && !matchesNation) {
          return false;
        }
      }
      return true;
    });
  }, [initialCharacters, filters]);

  return (
    <div>
      <CharacterFilters
        filters={filters}
        onFilterChange={setFilters}
        totalResults={filteredCharacters.length}
      />

      {filteredCharacters.length > 0 ? (
        <CharacterGrid characters={filteredCharacters} />
      ) : (
        <EmptyState
          icon="🔍"
          title="No characters match your criteria"
          description="Try clearing your filters or searching with a different term."
          actionLabel="Reset Filters"
          onAction={() => setFilters({ vision: '', weapon_type: '', rarity: '', search: '' })}
        />
      )}
    </div>
  );
}
