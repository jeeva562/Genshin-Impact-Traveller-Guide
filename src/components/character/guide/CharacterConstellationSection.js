'use client';

import styles from './CharacterGuide.module.css';

export default function CharacterConstellationSection({ constellations = [] }) {
  if (!constellations.length) return null;

  // Compute impact tags based on constellation level
  const getImpactBadge = (level) => {
    switch (level) {
      case 1:
        return { label: 'Quality of Life', color: '#10b981' };
      case 2:
        return { label: 'High Impact / Spike', color: '#f59e0b' };
      case 3:
      case 5:
        return { label: 'Talent Level +3', color: '#6b7280' };
      case 4:
        return { label: 'Utility / Support', color: '#8b5cf6' };
      case 6:
        return { label: 'Game Changing', color: '#ef4444' };
      default:
        return { label: 'Constellation', color: '#6b7280' };
    }
  };

  return (
    <section className={styles.sectionContainer} id="constellations">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>🌟</span> Constellations & Impact Analysis
        </h2>
      </div>

      <div className={styles.constellationGrid}>
        {constellations.map((c) => {
          const badge = getImpactBadge(c.level);
          return (
            <div key={c.id || c.level} className={styles.constellationCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className={styles.cLevel}>C{c.level}</div>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {c.name}
                  </strong>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${badge.color}18`,
                    color: badge.color,
                    border: `1px solid ${badge.color}40`,
                  }}
                >
                  {badge.label}
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {c.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
