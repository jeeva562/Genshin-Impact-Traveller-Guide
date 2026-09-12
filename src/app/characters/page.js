import { getCharacters } from '@/database/repositories/character-repository';
import CharactersClient from '@/components/character/CharactersClient';

export const metadata = {
  title: 'Character Database & Build Guides | Genshin Impact',
  description: 'Explore full builds, best weapons, artifacts, talent priorities, and team synergies for all 90+ Genshin Impact characters.',
};

export default function CharactersPage() {
  const characters = getCharacters({ sort: 'rarity', order: 'desc' });

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Character Database
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Explore build guides, optimal weapon rankings, artifact sets, talent leveling orders, and synergies for every playable character in Teyvat.
        </p>
      </header>

      <CharactersClient initialCharacters={characters} />
    </div>
  );
}
