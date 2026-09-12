'use client';

import { useState } from 'react';
import ElementIcon from '@/components/ui/ElementIcon';
import SafeImage from '@/components/ui/SafeImage';
import Interactive3DViewer from '@/components/ui/Interactive3DViewer';
import { ELEMENTS, WEAPON_TYPES } from '@/lib/constants';
import {
  getCharacterImage,
  getCharacterSplash,
  getCharacterFallback,
  getCharacterImageFallbacks,
} from '@/lib/assets';
import styles from './CharacterGuide.module.css';

export default function CharacterHeader({ character }) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  if (!character) return null;

  const {
    id,
    name,
    title,
    vision = 'Pyro',
    weapon_type = 'Sword',
    rarity = 5,
    nation = 'Teyvat',
    description,
  } = character;

  const elementCfg = ELEMENTS[vision] || { color: '#888', bgColor: 'rgba(136,136,136,0.1)' };
  const weaponCfg = WEAPON_TYPES[weapon_type] || { icon: '⚔️', name: weapon_type };
  const splashImg = getCharacterSplash(id);
  const cardImg = getCharacterImage(id, vision, name, 'icon-big');
  const cardFallbacks = getCharacterImageFallbacks(id, vision, name, 'icon-big');

  return (
    <>
      <div
        className={styles.headerBanner}
        style={{
          '--banner-accent': elementCfg.color,
          '--banner-glow': elementCfg.bgColor,
        }}
      >
        <div className={styles.characterVisual} style={{ position: 'relative' }}>
          <SafeImage
            src={cardImg}
            fallbacks={cardFallbacks}
            alt={name}
          />

          <button
            type="button"
            onClick={() => setIsInspectorOpen(true)}
            style={{
              position: 'absolute',
              bottom: '12px',
              background: 'rgba(15, 17, 26, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              transition: 'transform 0.15s, background 0.15s',
            }}
          >
            <span>🔮</span> 360° Inspection
          </button>
        </div>

        <div className={styles.headerDetails}>
          <div className={styles.titleRow}>
            <h1 className={styles.characterName}>{name}</h1>
            {title && <span className={styles.characterTitle}>— {title}</span>}
          </div>

          <div className={styles.metaBadges}>
            <div className={styles.badgeItem} style={{ borderColor: elementCfg.color }}>
              <ElementIcon element={vision} size={16} />
              <span>{vision}</span>
            </div>

            <div className={styles.badgeItem}>
              <span>{weaponCfg.icon}</span>
              <span>{weaponCfg.name}</span>
            </div>

            <div className={styles.badgeItem} style={{ color: '#fbbf24' }}>
              {'★'.repeat(rarity || 5)} <span>{rarity}-Star</span>
            </div>

            {nation && (
              <div className={styles.badgeItem}>
                <span>📍 {nation}</span>
              </div>
            )}
          </div>

          {description && <p className={styles.description}>{description}</p>}

          <div className={styles.quickStatsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Role</span>
              <span className={styles.statBoxValue}>{character.role || (rarity === 5 ? 'Main DPS' : 'Sub DPS')}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Build Difficulty</span>
              <span className={styles.statBoxValue}>{rarity === 5 ? 'Moderate' : 'F2P Friendly'}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Investment</span>
              <span className={styles.statBoxValue}>{rarity === 5 ? 'High Return' : 'Cost Effective'}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Affiliation</span>
              <span className={styles.statBoxValue}>{nation || 'Teyvat'}</span>
            </div>
          </div>
        </div>
      </div>

      <Interactive3DViewer
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        title={name}
        type={`${rarity}★ ${vision} ${weapon_type}`}
        imageUrl={splashImg}
        fallbackUrl={cardImg}
        accentColor={elementCfg.color}
        rarity={rarity}
      />
    </>
  );
}

