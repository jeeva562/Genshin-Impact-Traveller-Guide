import { getArtifactSets } from '@/database/repositories/index';
import ArtifactsClient from '@/components/artifact/ArtifactsClient';

export const metadata = {
  title: 'Artifact Sets & Set Bonuses | Genshin Impact',
  description: 'Full artifact database: 2-piece and 4-piece set bonuses, optimal character assignments, and domain farming locations.',
};

export default function ArtifactsPage() {
  const artifacts = getArtifactSets({ sort: 'max_rarity' });

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Artifact Sets Database
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Explore all 5-star and 4-star artifact sets, 2-piece and 4-piece bonuses, and optimal character pairings.
        </p>
      </header>

      <ArtifactsClient initialArtifacts={artifacts} />
    </div>
  );
}
