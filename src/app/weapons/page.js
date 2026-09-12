import { getWeapons } from '@/database/repositories/index';
import WeaponsClient from '@/components/weapon/WeaponsClient';

export const metadata = {
  title: 'Weapons Database & Stats | Genshin Impact',
  description: 'Complete weapon database: Base ATK, substats, passive descriptions, and ranking tiers for swords, claymores, polearms, bows, and catalysts.',
};

export default function WeaponsPage() {
  const weapons = getWeapons({ sort: 'rarity', order: 'desc' });

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Weapons Database
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Explore all weapons in Genshin Impact with base stats, scaling substats, passive effects, and character synergy.
        </p>
      </header>

      <WeaponsClient initialWeapons={weapons} />
    </div>
  );
}
