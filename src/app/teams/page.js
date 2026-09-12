import { getCharacters } from '@/database/repositories/character-repository';
import { getTeamTemplates } from '@/database/repositories/index';
import TeamBuilderClient from '@/components/team/TeamBuilderClient';

export const metadata = {
  title: 'Team Builder & Reaction Optimizer | Genshin Impact',
  description: 'Assemble 4-character teams, check elemental reactions, verify resonances, and receive actionable synergy advice.',
};

export default function TeamsPage() {
  const characters = getCharacters({ sort: 'name', order: 'asc' });
  const prebuiltTeams = getTeamTemplates();

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Interactive Team Builder
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Build dream team compositions, test elemental reactions, check active party resonances, and assess synergy scores.
        </p>
      </header>

      <TeamBuilderClient characters={characters} prebuiltTeams={prebuiltTeams} />
    </div>
  );
}
