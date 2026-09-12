'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import styles from './CharacterCard.module.css';

/**
 * Premium CharacterCard component with high-resolution artwork
 * and interactive 360° 3D inspection support.
 */
export default function CharacterCard({ character }) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  if (!character) return null;

  const {
    id,
    name,
    vision = 'Pyro',
    weapon_type = 'Sword',
    rarity = 5,
    nation = 'Teyvat',
    role,
  } = character;

  const elementCfg = ELEMENTS[vision] || { color: '#888', bgColor: 'rgba(136,136,136,0.1)' };
  const weaponCfg = WEAPON_TYPES[weapon_type] || { icon: '⚔️', name: weapon_type };

  // Primary high-res art and fallbacks
  const cardImg = getCharacterImage(id, vision, name, 'icon-big');
  const cardFallbacks = getCharacterImageFallbacks(id, vision, name, 'icon-big');
  const splashImg = getCharacterSplash(id);

  return (
    <>
      <Link
        href={`/characters/${id}`}
        className={styles.card}
        style={{
          '--card-element-color': elementCfg.color,
          '--card-element-glow': elementCfg.bgColor || 'rgba(99, 102, 241, 0.2)',
        }}
        aria-label={`View build guide for ${name}`}
      >
        <div className={styles.imageWrapper}>
          <div className={styles.elementBadge}>
            <ElementIcon element={vision} size={16} />
            <span>{vision}</span>
          </div>

          <div className={styles.rarityBadge}>
            {'★'.repeat(rarity || 5)}
          </div>

          <SafeImage
            src={cardImg}
            fallbacks={cardFallbacks}
            alt={name}
            className={styles.image}
            loading="lazy"
          />

          <button
            type="button"
            className={styles.inspectBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsInspectorOpen(true);
            }}
            title="360° 3D Inspector"
          >
            <span>🔮</span> 360°
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.name}>{name}</h3>
            <span className={styles.weaponType}>
              {weaponCfg.icon} {weaponCfg.name}
            </span>
          </div>

          <div className={styles.metaRow}>
            {nation && <span className={styles.nationTag}>{nation}</span>}
            {role && <span className={styles.roleTag}>{role}</span>}
          </div>
        </div>
      </Link>

      {/* 360° 3D Inspection Lightbox */}
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

