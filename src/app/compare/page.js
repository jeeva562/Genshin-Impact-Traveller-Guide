import { getCharacters } from '@/database/repositories/character-repository';
import { getWeapons } from '@/database/repositories/index';
import CompareClient from '@/components/compare/CompareClient';

export const metadata = {
  title: 'Side-by-Side Comparison Tool | Genshin Impact',
  description: 'Compare characters and weapons side-by-side: stats, substats, base attack, and passive effects.',
};

export default function ComparePage() {
  const characters = getCharacters({ sort: 'name', order: 'asc' });
  const weapons = getWeapons({ sort: 'name', order: 'asc' });

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Side-by-Side Comparison Tool
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Evaluate two characters or weapons directly side-by-side to understand trade-offs in base attack, scaling substats, and kit mechanics.
        </p>
      </header>

      <CompareClient characters={characters} weapons={weapons} />
    </div>
  );
}
