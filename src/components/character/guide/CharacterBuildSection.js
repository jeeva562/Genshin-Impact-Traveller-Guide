'use client';

import { useState } from 'react';
import { getStatRecommendations, scoreWeaponsForCharacter, scoreArtifactsForCharacter } from '@/services/recommendations';
import {
  getWeaponImage,
  getWeaponImageFallbacks,
  getWeaponFallback,
  getArtifactImage,
  getArtifactImageFallbacks,
  getArtifactFallback,
} from '@/lib/assets';
import SafeImage from '@/components/ui/SafeImage';
import Interactive3DViewer from '@/components/ui/Interactive3DViewer';
import styles from './CharacterGuide.module.css';

export default function CharacterBuildSection({ character, allWeapons = [], allArtifacts = [] }) {
  const [activePreset, setActivePreset] = useState('overall');
  const [inspectItem, setInspectItem] = useState(null);

  const stats = getStatRecommendations(character);
  const recommendedWeapons = scoreWeaponsForCharacter(character, allWeapons);
  const recommendedArtifacts = scoreArtifactsForCharacter(character, allArtifacts);

  return (
    <section className={styles.sectionContainer} id="build-guide">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>⚔️</span> Recommended Builds
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={activePreset === 'overall' ? styles.badgeItem : styles.pill}
            style={activePreset === 'overall' ? { background: 'var(--color-primary)', color: '#fff' } : {}}
            onClick={() => setActivePreset('overall')}
          >
            Best Overall
          </button>
          <button
            type="button"
            className={activePreset === 'f2p' ? styles.badgeItem : styles.pill}
            style={activePreset === 'f2p' ? { background: 'var(--color-primary)', color: '#fff' } : {}}
            onClick={() => setActivePreset('f2p')}
          >
            F2P Friendly
          </button>
        </div>
      </div>

      <div className={styles.buildLayout}>
        {/* Left Column: Weapons & Artifacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Weapons */}
          <div className={styles.cardSection}>
            <h3 className={styles.cardSectionTitle}>
              <span>🗡️ Best Weapons</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Ranked Order</span>
            </h3>

            <div className={styles.rankingList}>
              {recommendedWeapons.map((item, idx) => {
                const weaponImg = getWeaponImage(item.weapon.id, item.weapon.type, item.weapon.name, item.weapon.rarity);
                const weaponFallbacks = getWeaponImageFallbacks(item.weapon.id, item.weapon.type, item.weapon.name, item.weapon.rarity);
                const fallbackImg = getWeaponFallback(item.weapon.id, item.weapon.type, item.weapon.name, item.weapon.rarity);

                return (
                  <div key={item.weapon.id} className={styles.rankingItem}>
                    <div className={styles.rankNumber}>{idx + 1}</div>

                    {/* Weapon Thumbnail with 360° trigger */}
                    <div
                      style={{
                        position: 'relative',
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      onClick={() =>
                        setInspectItem({
                          title: item.weapon.name,
                          type: `${item.weapon.rarity}★ ${item.weapon.type}`,
                          imageUrl: weaponImg,
                          fallbackUrl: fallbackImg,
                          accentColor: '#fbbf24',
                          rarity: item.weapon.rarity,
                        })
                      }
                      title="Click to inspect 360°"
                    >
                      <SafeImage
                        src={weaponImg}
                        fallbacks={weaponFallbacks}
                        alt={item.weapon.name}
                        style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                      />
                      <span style={{ position: 'absolute', bottom: '1px', right: '2px', fontSize: '9px' }}>🔮</span>
                    </div>

                    <div className={styles.rankingInfo}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.rankingName}>{item.weapon.name}</span>
                        <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
                          {'★'.repeat(item.weapon.rarity || 4)}
                        </span>
                      </div>
                      <span className={styles.rankingMeta}>
                        Base ATK: {item.weapon.base_attack} | Substat: {item.weapon.sub_stat || 'None'}
                      </span>
                      <p className={styles.rankingDesc}>{item.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Artifact Sets */}
          <div className={styles.cardSection}>
            <h3 className={styles.cardSectionTitle}>
              <span>🏵️ Best Artifact Sets</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Synergy Match</span>
            </h3>

            <div className={styles.rankingList}>
              {recommendedArtifacts.map((item, idx) => {
                const artImg = getArtifactImage(item.set.id, 'flower-of-life');
                const artFallbacks = getArtifactImageFallbacks(item.set.id, 'flower-of-life', item.set.name);
                const artFallback = getArtifactFallback(item.set.id, item.set.name);

                return (
                  <div key={item.set.id} className={styles.rankingItem}>
                    <div className={styles.rankNumber}>{idx + 1}</div>

                    {/* Artifact Icon with 360° trigger */}
                    <div
                      style={{
                        position: 'relative',
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      onClick={() =>
                        setInspectItem({
                          title: item.set.name,
                          type: `${item.set.max_rarity || 5}★ Artifact Set`,
                          imageUrl: artImg,
                          fallbackUrl: artFallback,
                          accentColor: '#a78bfa',
                          rarity: item.set.max_rarity || 5,
                        })
                      }
                      title="Click to inspect 360°"
                    >
                      <SafeImage
                        src={artImg}
                        fallbacks={artFallbacks}
                        alt={item.set.name}
                        style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                      />
                      <span style={{ position: 'absolute', bottom: '1px', right: '2px', fontSize: '9px' }}>🔮</span>
                    </div>

                    <div className={styles.rankingInfo}>
                      <span className={styles.rankingName}>{item.set.name}</span>
                      <p className={styles.rankingDesc} style={{ margin: '4px 0 2px' }}>
                        <strong>2-Piece:</strong> {item.set.two_piece_bonus}
                      </p>
                      {item.set.four_piece_bonus && (
                        <p className={styles.rankingDesc}>
                          <strong>4-Piece:</strong> {item.set.four_piece_bonus}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Target Benchmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Main Stats */}
          <div className={styles.cardSection}>
            <h3 className={styles.cardSectionTitle}>
              <span>🎯 Optimal Main Stats</span>
            </h3>

            <div className={styles.statMainRow}>
              <div className={styles.statMainBox}>
                <div className={styles.statSlotLabel}>⏳ Sands</div>
                <div className={styles.statSlotValue}>{stats.mainStats.sands}</div>
              </div>
              <div className={styles.statMainBox}>
                <div className={styles.statSlotLabel}>🏆 Goblet</div>
                <div className={styles.statSlotValue}>{stats.mainStats.goblet}</div>
              </div>
              <div className={styles.statMainBox}>
                <div className={styles.statSlotLabel}>👑 Circlet</div>
                <div className={styles.statSlotValue}>{stats.mainStats.circlet}</div>
              </div>
            </div>
          </div>

          {/* Substat Priority */}
          <div className={styles.cardSection}>
            <h3 className={styles.cardSectionTitle}>
              <span>📊 Substat Priority Hierarchy</span>
            </h3>

            <div className={styles.substatList}>
              {stats.subStats.map((sub, index) => (
                <div key={sub} className={styles.substatItem}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {index + 1}. {sub}
                  </span>
                  <span className={styles.priorityBadge}>
                    {index === 0 ? 'Highest Priority' : index === 1 ? 'High Priority' : 'Secondary'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stat Targets */}
          <div className={styles.cardSection}>
            <h3 className={styles.cardSectionTitle}>
              <span>📈 Recommended Stat Targets</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {Object.entries(stats.statTargets).map(([statKey, targets]) => (
                <div
                  key={statKey}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{statKey}</span>
                    <span style={{ color: 'var(--color-primary)' }}>Target: {targets.good}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    <div>Min: {targets.min}</div>
                    <div style={{ color: '#10b981' }}>Good: {targets.good}</div>
                    <div style={{ color: '#fbbf24' }}>Excellent: {targets.excellent}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 360° Inspector for weapons/artifacts */}
      {inspectItem && (
        <Interactive3DViewer
          isOpen={true}
          onClose={() => setInspectItem(null)}
          title={inspectItem.title}
          type={inspectItem.type}
          imageUrl={inspectItem.imageUrl}
          fallbackUrl={inspectItem.fallbackUrl}
          accentColor={inspectItem.accentColor}
          rarity={inspectItem.rarity}
        />
      )}
    </section>
  );
}

