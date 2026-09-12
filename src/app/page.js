import Link from 'next/link';
import { getCharacters } from '@/database/repositories/character-repository';
import { getWeapons, getArtifactSets, getFarmingSchedule } from '@/database/repositories/index';
import CharacterHeroBanner from '@/components/home/CharacterHeroBanner';
import CharacterCard from '@/components/character/CharacterCard';
import SafeImage from '@/components/ui/SafeImage';
import { getWeaponImage, getWeaponFallback, getArtifactImage, getArtifactFallback } from '@/lib/assets';
import { DAYS_OF_WEEK } from '@/lib/constants';
import styles from './Home.module.css';

export const metadata = {
  title: 'Traveller Guide — Professional Genshin Impact Companion',
  description: 'Build Smarter. Play Better. Complete database, optimal character builds, 360° 3D inspector, interactive team builder, and daily farming assistant for Genshin Impact.',
};

export default function HomePage() {
  const characters = getCharacters();
  const weapons = getWeapons({ sort: 'rarity', order: 'desc' });
  const artifacts = getArtifactSets({ sort: 'max_rarity' });

  const today = DAYS_OF_WEEK[new Date().getDay()];
  const todaySchedule = getFarmingSchedule(today);

  // Pick top featured popular characters
  const featuredIds = ['furina', 'nahida', 'raiden', 'hu-tao', 'kazuha', 'neuvillette', 'zhongli', 'yelan'];
  const featuredCharacters = characters.filter((c) => featuredIds.includes(c.id)).slice(0, 4);
  const displayCharacters = featuredCharacters.length >= 4 ? featuredCharacters : characters.slice(0, 4);

  // Pick top iconic weapons
  const featuredWeapons = weapons.slice(0, 6);
  // Pick top iconic artifact sets
  const featuredArtifacts = artifacts.slice(0, 4);

  return (
    <div>
      {/* Top Gaming Hero Banner with Live 3D & Switcher */}
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-6) var(--space-4) 0' }}>
        <CharacterHeroBanner />
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Live Counters */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{characters.length || 92}+</span>
              <span className={styles.statLabel}>Playable Characters</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{weapons.length || 189}+</span>
              <span className={styles.statLabel}>Weapons Documented</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{artifacts.length || 53}+</span>
              <span className={styles.statLabel}>Artifact Sets</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>7 Realms</span>
              <span className={styles.statLabel}>Nations of Teyvat</span>
            </div>
          </div>
        </div>

        {/* Today's Resin Farming Banner */}
        <section className={styles.dailyBanner}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '22px' }}>📅</span>
              <strong style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                Today is {today} &bull; Domain Farming Assistant
              </strong>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
              {today === 'Sunday'
                ? 'All talent and weapon ascension domains are open today with unrestricted farming!'
                : `${todaySchedule.length} talent book series currently active in regional domains.`}
            </p>
          </div>
          <Link
            href="/farming"
            style={{
              padding: '10px 22px',
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            }}
          >
            Open Today&apos;s Schedule &rarr;
          </Link>
        </section>

        {/* Featured Guides Section */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Character Build Guides</h2>
              <p className={styles.sectionDesc}>
                Actionable weapon rankings, 2pc/4pc artifact sets, stat targets, and 360° 3D inspection.
              </p>
            </div>
            <Link href="/characters" className={styles.viewAllLink}>
              View All Characters ({characters.length}) &rarr;
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {displayCharacters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        </section>

        {/* Teyvat World, Gods & Dragons Showcase Section */}
        <section
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15), transparent 70%), var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          <div className={styles.sectionHeader} style={{ margin: 0 }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '3px 10px', background: 'rgba(212, 168, 50, 0.15)', color: '#fbbf24', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>
                World Lore &bull; Map &bull; Bosses
              </div>
              <h2 className={styles.sectionTitle}>The Seven Nations &amp; Ancient Dragon Sovereigns</h2>
              <p className={styles.sectionDesc}>
                Explore the geography of Teyvat, Archon rulers, ancient dragon lords (Dvalin, Azhdaha, Apep, Neuvillette), and weekly boss encounter drops.
              </p>
            </div>
            <Link href="/world" className={styles.viewAllLink}>
              Open World Chronicle &amp; Map &rarr;
            </Link>
          </div>

          {/* Quick Dragons & Sovereigns Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
              <span style={{ fontSize: '10px', color: '#5fc4a0', fontWeight: 'bold', textTransform: 'uppercase' }}>Anemo Sovereign</span>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#fff', margin: '2px 0 4px' }}>Dvalin (Stormterror)</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Dragon of the East, Four Winds guardian sealed in Stormterror&apos;s Lair.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
              <span style={{ fontSize: '10px', color: '#d4a832', fontWeight: 'bold', textTransform: 'uppercase' }}>Geo Sovereign</span>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#fff', margin: '2px 0 4px' }}>Azhdaha (Earth Lord)</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Ancient Earth Dragon sealed beneath the Dragon-Queller tree in Nantianmen.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
              <span style={{ fontSize: '10px', color: '#7bb42d', fontWeight: 'bold', textTransform: 'uppercase' }}>Dendro Sovereign</span>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#fff', margin: '2px 0 4px' }}>Apep (Oasis Warden)</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Cosmic primordial dragon ruling over the vast deserts of Sumeru.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
              <span style={{ fontSize: '10px', color: '#4f8fd4', fontWeight: 'bold', textTransform: 'uppercase' }}>Hydro Sovereign</span>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#fff', margin: '2px 0 4px' }}>Neuvillette</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Reborn Sovereign of Water wielding the reclaimed authority of the Primordial Sea.
              </p>
            </div>
          </div>
        </section>

        {/* Weapons & Artifacts Showcase */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Iconic Weapons &amp; Artifact Sets</h2>
              <p className={styles.sectionDesc}>
                Examine top weapons and gear with high-resolution models and 360° rotational inspection.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <Link href="/weapons" className={styles.viewAllLink}>
                All Weapons &rarr;
              </Link>
              <Link href="/artifacts" className={styles.viewAllLink}>
                All Artifacts &rarr;
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            {featuredWeapons.map((w) => {
              const img = getWeaponImage(w.id, w.type, w.name, w.rarity);
              const fallback = getWeaponFallback(w.id, w.type, w.name, w.rarity);

              return (
                <Link
                  key={w.id}
                  href={`/weapons/${w.id}`}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    gap: 'var(--space-2)',
                    transition: 'transform 0.15s, border-color 0.15s',
                  }}
                >
                  <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SafeImage
                      src={img}
                      alt={w.name}
                      fallback={fallback}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <strong style={{ fontSize: 'var(--text-xs)', color: '#fff' }}>{w.name}</strong>
                  <span style={{ fontSize: '11px', color: '#fbbf24' }}>{'★'.repeat(w.rarity || 5)}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Tools Grid */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Companion Tools &amp; Utilities</h2>
              <p className={styles.sectionDesc}>
                Plan optimal party synergies, calculate resin-guaranteed progression, and compare stats.
              </p>
            </div>
          </div>

          <div className={styles.toolsGrid}>
            <Link href="/teams" className={styles.toolCard}>
              <span className={styles.toolIcon}>👥</span>
              <h3 className={styles.toolTitle}>Interactive Team Builder</h3>
              <p className={styles.toolDesc}>
                Assemble 4-character parties with live elemental resonance detection, reaction breakdowns, and synergy scoring.
              </p>
            </Link>

            <Link href="/planner" className={styles.toolCard}>
              <span className={styles.toolIcon}>📈</span>
              <h3 className={styles.toolTitle}>Progression Planner</h3>
              <p className={styles.toolDesc}>
                Enter your current levels and calculate &quot;What to upgrade next&quot; ranked by guaranteed resin return.
              </p>
            </Link>

            <Link href="/world" className={styles.toolCard}>
              <span className={styles.toolIcon}>🗺️</span>
              <h3 className={styles.toolTitle}>Teyvat Map &amp; World Guide</h3>
              <p className={styles.toolDesc}>
                Explore the Seven Nations, Archon thrones, Dragon Sovereigns, and boss drop locations across Teyvat.
              </p>
            </Link>

            <Link href="/compare" className={styles.toolCard}>
              <span className={styles.toolIcon}>⚖️</span>
              <h3 className={styles.toolTitle}>Side-by-Side Comparison</h3>
              <p className={styles.toolDesc}>
                Directly compare characters or weapons side-by-side to understand base attack, substat scalings, and trade-offs.
              </p>
            </Link>

            <Link href="/farming" className={styles.toolCard}>
              <span className={styles.toolIcon}>🌾</span>
              <h3 className={styles.toolTitle}>Daily Farming Assistant</h3>
              <p className={styles.toolDesc}>
                Filter farmable materials by day of the week and locate which domain to farm for your team.
              </p>
            </Link>

            <Link href="/weapons" className={styles.toolCard}>
              <span className={styles.toolIcon}>⚔️</span>
              <h3 className={styles.toolTitle}>Weapons Database</h3>
              <p className={styles.toolDesc}>
                Explore 180+ weapons with base ATK, substats, passive mechanics, and refinement details.
              </p>
            </Link>

            <Link href="/artifacts" className={styles.toolCard}>
              <span className={styles.toolIcon}>🏵️</span>
              <h3 className={styles.toolTitle}>Artifact Sets</h3>
              <p className={styles.toolDesc}>
                Complete directory of 2-piece and 4-piece set bonuses with character compatibility guides.
              </p>
            </Link>

            <Link href="/guides" className={styles.toolCard}>
              <span className={styles.toolIcon}>📜</span>
              <h3 className={styles.toolTitle}>Theorycrafting Library</h3>
              <p className={styles.toolDesc}>
                Masterclasses covering Energy Recharge, Internal Cooldown (ICD), and the 1:2 CRIT ratio rule.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
