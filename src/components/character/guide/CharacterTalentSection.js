'use client';

import { getTalentPriority } from '@/services/recommendations';
import styles from './CharacterGuide.module.css';

export default function CharacterTalentSection({ character }) {
  const talents = character.talents || [];
  const passives = character.passives || [];
  const priorities = getTalentPriority(character);

  return (
    <section className={styles.sectionContainer} id="talents">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>⚡</span> Talents & Skill Priorities
        </h2>
      </div>

      {/* Talent Leveling Priority Banner */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          Recommended Leveling Order:
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {priorities.map((item, idx) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {item.name}
              </span>
              {idx < priorities.length - 1 && (
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 'bold' }}>&gt;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Talents */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {talents.map((talent) => (
          <div key={talent.id} className={styles.talentCard}>
            <div className={styles.talentHeader}>
              <div className={styles.talentTitle}>
                <span>✨</span>
                <span>{talent.name}</span>
                {talent.unlock && (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    ({talent.unlock})
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  background: 'var(--bg-secondary)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  textTransform: 'capitalize',
                }}
              >
                {talent.type || 'Combat Talent'}
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {talent.description}
            </p>
          </div>
        ))}
      </div>

      {/* Passive Talents */}
      {passives.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
            Passive Talents
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {passives.map((passive) => (
              <div
                key={passive.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {passive.name}
                  </strong>
                  {passive.unlock && (
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)' }}>
                      {passive.unlock}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {passive.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
