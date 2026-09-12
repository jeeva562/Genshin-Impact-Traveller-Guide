'use client';

import styles from './CharacterGuide.module.css';

export default function CharacterPlayGuide({ character }) {
  const vision = character.vision || 'Pyro';

  return (
    <section className={styles.sectionContainer} id="how-to-play">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>🎮</span> How to Play & Combat Rotation
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Core Rotation */}
        <div className={styles.cardSection}>
          <h3 className={styles.cardSectionTitle}>
            <span>🔄 Core Rotation Loop</span>
          </h3>
          <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <li>Activate Support buffers (e.g. Bennett Burst, Kazuha Swirl, Furina Skill/Burst).</li>
            <li>Deploy off-field sub-DPS abilities (e.g. Xingqiu / Yelan / Fischl).</li>
            <li>Switch to <strong>{character.name}</strong>, cast Elemental Skill to engage or infuse.</li>
            <li>Execute attack combos while monitoring stamina and ability cooldowns.</li>
            <li>Unleash Elemental Burst during high buff windows for maximum reaction damage.</li>
            <li>Catch generated energy particles before rotating back to your battery unit.</li>
          </ol>
        </div>

        {/* Energy & Combat Tips */}
        <div className={styles.cardSection}>
          <h3 className={styles.cardSectionTitle}>
            <span>⚡ Energy Management & Common Mistakes</span>
          </h3>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <li>
              <strong>Energy Funneling:</strong> Generate elemental particles with a battery character and immediately switch to {character.name} to absorb them directly.
            </li>
            <li>
              <strong>Don&apos;t Ignore ER%:</strong> Prioritize meeting Energy Recharge thresholds so your Elemental Burst is off cooldown every rotation.
            </li>
            <li>
              <strong>Reaction Order:</strong> Ensure the aura element ({vision === 'Pyro' ? 'Hydro/Cryo' : 'Pyro/Electro'}) is firmly applied before triggering reaction hits.
            </li>
            <li>
              <strong>Animation Canceling:</strong> Jump or dash-cancel end lag on heavy attacks to increase overall damage per second.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
