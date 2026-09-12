import ToolsClient from '@/components/tools/ToolsClient';
import { getCharacters } from '@/database/repositories/character-repository';
import { getWeapons } from '@/database/repositories/index';

export const metadata = {
    title: 'Stat Calculator & Wish Pity Tracker | Genshin Impact',
    description: 'Calculate total character damage stats, ATK scaling, Crit multipliers, and track your gacha wish pity status with Primogem converters.',
};

export default function ToolsPage() {
    const characters = getCharacters({ sort: 'name', order: 'asc' });
    const weapons = getWeapons({ sort: 'name', order: 'asc' });

    return (
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
            <header style={{ marginBottom: 'var(--space-8)' }}>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
                    Utility Tools &amp; Calculators
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
                    Simulate character stats, calculate total attack and crit output, and manage your wish pity counter for upcoming character banners.
                </p>
            </header>

            <ToolsClient characters={characters} weapons={weapons} />
        </div>
    );
}
