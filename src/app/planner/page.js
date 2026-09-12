import { getCharacters } from '@/database/repositories/character-repository';
import PlannerClient from '@/components/planner/PlannerClient';

export const metadata = {
  title: 'Build Planner & Upgrade Optimizer | Genshin Impact',
  description: 'Input your character stats, weapon levels, and talent ranks to calculate what to upgrade next with maximum resin return.',
};

export default function PlannerPage() {
  const characters = getCharacters({ sort: 'name', order: 'asc' });

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Progression Planner &amp; Optimizer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Stop wasting fragile resin. Enter your character&apos;s current stats and receive an optimized, prioritized list of guaranteed upgrade steps.
        </p>
      </header>

      <PlannerClient characters={characters} />
    </div>
  );
}
