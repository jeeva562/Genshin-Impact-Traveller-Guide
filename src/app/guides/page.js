import Link from 'next/link';

export const metadata = {
  title: 'Genshin Impact Guides & Theorycrafting Library',
  description: 'Comprehensive guides covering resin efficiency, energy recharge loops, elemental gauge theory, and artifact optimization.',
};

export const GUIDES = [
  {
    slug: 'energy-recharge-and-rotations',
    title: 'Energy Recharge & Combat Rotations 101',
    category: 'Combat & Mechanics',
    readTime: '6 min read',
    description: 'Understand white particles vs. elemental energy, particle funneling techniques, and how to keep bursts off cooldown.',
    icon: '⚡',
  },
  {
    slug: 'elemental-reactions-and-gauge-theory',
    title: 'Elemental Reactions & Gauge Theory Demystified',
    category: 'Theorycrafting',
    readTime: '10 min read',
    description: 'Learn how ICD (Internal Cooldown), elemental gauges (1U, 2U), and aura priority govern reaction damage.',
    icon: '🔥',
  },
  {
    slug: 'resin-efficiency-and-progression',
    title: 'Resin Efficiency: The AR 1 to AR 60 Roadmap',
    category: 'Account Progression',
    readTime: '8 min read',
    description: 'Guaranteed returns vs. RNG artifact domains: Exactly when to farm weapon mats, talents, and artifact sets.',
    icon: '💎',
  },
  {
    slug: 'artifact-optimization-and-crit-ratio',
    title: 'Artifact Roll Value & The 1:2 CRIT Golden Rule',
    category: 'Optimization',
    readTime: '7 min read',
    description: 'How to evaluate artifact substat rolls, avoid diminishing returns, and compute effective damage roll values.',
    icon: '📊',
  },
];

export default function GuidesPage() {
  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Guides &amp; Theorycrafting Library
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Deep-dive references and beginner masterclasses written for clear, actionable decision-making in Teyvat.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'transform var(--duration-fast), border-color var(--duration-fast)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '32px' }}>{guide.icon}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                {guide.readTime}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {guide.category}
              </span>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '4px 0 0' }}>
                {guide.title}
              </h2>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {guide.description}
            </p>

            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 'bold', marginTop: 'auto' }}>
              Read Full Guide &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
