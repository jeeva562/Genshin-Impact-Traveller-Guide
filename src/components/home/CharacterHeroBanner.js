'use client';

import { useState } from 'react';
import Link from 'next/link';
import ElementIcon from '@/components/ui/ElementIcon';
import SafeImage from '@/components/ui/SafeImage';
import Interactive3DViewer from '@/components/ui/Interactive3DViewer';
import {
  getCharacterSplash,
  getCharacterSplashFallbacks,
  getCharacterImage,
  getCharacterImageFallbacks,
} from '@/lib/assets';
import styles from './CharacterHeroBanner.module.css';

const SHOWCASE_CHARACTERS = [
  {
    id: 'raiden',
    name: 'Raiden Shogun',
    title: 'Plane of Euthymia &bull; Electro Archon',
    element: 'Electro',
    color: '#9b6ed6',
    weapon: 'Polearm',
    role: 'Sub DPS / Battery / Burst DPS',
    quote: '“The world remains constant over the span of a thousand ages, as does the thunder that commands it.”',
    tags: ['Energy Battery', 'Universal Burst Buff', 'Hyperbloom Enabler'],
  },
  {
    id: 'furina',
    name: 'Furina',
    title: 'Endless Solo of Solitude &bull; Fontaine',
    element: 'Hydro',
    color: '#4f8fd4',
    weapon: 'Sword',
    role: 'Universal Damage Buffer / Sub DPS',
    quote: '“Let the world bear witness to the greatest performance! The curtains shall never fall on justice.”',
    tags: ['Fanfare Global DMG Buff', 'Pneuma/Ousia Switching', 'Off-field Hydro'],
  },
  {
    id: 'hu-tao',
    name: 'Hu Tao',
    title: '77th Director of the Wangsheng Funeral Parlor',
    element: 'Pyro',
    color: '#e8553a',
    weapon: 'Polearm',
    role: 'On-Field Hypercarry / Main DPS',
    quote: '“When the sun’s out, bathe in sunlight! When the moon’s out, bathe in moonlight~ Balance in all things!”',
    tags: ['Vaporize DPS Floor', 'HP-to-ATK Conversion', 'Charge Attack King'],
  },
  {
    id: 'nahida',
    name: 'Nahida',
    title: 'Lesser Lord Kusanali &bull; Dendro Archon',
    element: 'Dendro',
    color: '#7bb42d',
    weapon: 'Catalyst',
    role: 'Dendro Reaction Enabler / EM Buffer',
    quote: '“Knowledge is like water; it seeks out every vessel. Let us unravel the mysteries of this world together.”',
    tags: ['Tri-Karma Purification', '250 EM Party Buff', 'Permanent Dendro Aura'],
  },
  {
    id: 'neuvillette',
    name: 'Neuvillette',
    title: 'Iudex of Fontaine &bull; Reborn Hydro Sovereign',
    element: 'Hydro',
    color: '#3b82f6',
    weapon: 'Catalyst',
    role: 'Hypercarry / Solo Abyss Sovereign',
    quote: '“Water carries memories, tears, and justice. When the torrent breaks, none can stay the judgment of the tides.”',
    tags: ['Equitable Judgment', 'Self-Sustain Healing', 'Hydro Sovereign'],
  },
];

const PAIMON_QUOTES = [
  'Paimon is the best travel guide in all of Teyvat! ✨',
  'Ehe te nandayo?! 💢',
  'Need help optimizing your party? Try our Team Builder! ⚔️',
  'Look at all these awesome 5-star characters! 🌟',
  'How about we explore the area ahead of us later? 😉',
  "Don't forget your daily domain talent books today! 📜",
];

export default function CharacterHeroBanner() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [is3DOpen, setIs3DOpen] = useState(false);
  const [paimonQuoteIdx, setPaimonQuoteIdx] = useState(0);
  const [showPaimonBubble, setShowPaimonBubble] = useState(false);

  const char = SHOWCASE_CHARACTERS[activeIdx];
  const splashUrl = getCharacterSplash(char.id);
  const splashFallbacks = getCharacterSplashFallbacks(char.id, char.element, char.name);
  const cardUrl = getCharacterImage(char.id, char.element, char.name, 'icon-big');

  const handlePaimonClick = () => {
    setPaimonQuoteIdx((prev) => (prev + 1) % PAIMON_QUOTES.length);
    setShowPaimonBubble(true);
  };

  return (
    <>
      <div className={styles.heroWrapper}>
        {/* Big size cute Paimon floating and waving her hand BEHIND the banner */}
        <div
          className={styles.paimonContainer}
          onClick={handlePaimonClick}
          onMouseEnter={() => setShowPaimonBubble(true)}
          onMouseLeave={() => setShowPaimonBubble(false)}
          title="Click Paimon for advice!"
        >
          <div className={`${styles.paimonBubble} ${showPaimonBubble ? styles.bubbleVisible : ''}`}>
            <span className={styles.paimonBubbleTitle}>Paimon:</span>
            <span>{PAIMON_QUOTES[paimonQuoteIdx]}</span>
          </div>
          <SafeImage
            src="/images/paimon_portrait.png"
            alt="Paimon Floating Companion"
            className={styles.paimonImg}
          />
        </div>

        <section
          className={styles.bannerContainer}
          style={{
            '--hero-accent': char.color,
            '--hero-accent-glow': `${char.color}50`,
          }}
          aria-label="Featured Character Showcase Banner"
        >
          {/* Left Column Info */}
          <div className={styles.contentCol}>
            <div className={styles.elementBadge}>
              <ElementIcon element={char.element} size={16} />
              <span>{char.element} &bull; 5-Star {char.weapon}</span>
            </div>

            <div>
              <div
                className={styles.charTitle}
                dangerouslySetInnerHTML={{ __html: char.title }}
              />
              <h2 className={styles.charName}>{char.name}</h2>
            </div>

            <blockquote className={styles.quote}>{char.quote}</blockquote>

            <div className={styles.tagRow}>
              <span className={styles.tag}>Role: {char.role}</span>
              {char.tags.map((t, idx) => (
                <span key={idx} className={styles.tag}>
                  ✓ {t}
                </span>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <Link href={`/characters/${char.id}`} className={styles.btnBuild}>
                View Complete {char.name} Guide &rarr;
              </Link>

              <button
                type="button"
                className={styles.btn3D}
                onClick={() => setIs3DOpen(true)}
              >
                <span>🔮</span>
                <span>Inspect 360° 3D</span>
              </button>
            </div>
          </div>

          {/* Right Column Artwork */}
          <div className={styles.visualCol}>
            <SafeImage
              src={splashUrl}
              fallbacks={splashFallbacks}
              alt={char.name}
              className={styles.splashImage}
            />
          </div>

          {/* Bottom Switcher Ribbon */}
          <div className={styles.ribbonNav} role="tablist" aria-label="Select Featured Character">
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginRight: '4px' }}>
              Featured Archons &amp; Legends:
            </span>
            {SHOWCASE_CHARACTERS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={activeIdx === i}
                className={`${styles.ribbonItem} ${activeIdx === i ? styles.ribbonActive : ''}`}
                onClick={() => setActiveIdx(i)}
              >
                <ElementIcon element={c.element} size={14} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* 360° 3D Inspection Viewer */}
      <Interactive3DViewer
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
        title={char.name}
        type={`5★ ${char.element} ${char.weapon}`}
        imageUrl={splashUrl}
        fallbackUrl={cardUrl}
        accentColor={char.color}
        rarity={5}
      />
    </>
  );
}

