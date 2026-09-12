import { notFound } from 'next/navigation';
import { getCharacterById, getCharacters } from '@/database/repositories/character-repository';
import { getWeapons, getArtifactSets } from '@/database/repositories/index';
import CharacterHeader from '@/components/character/guide/CharacterHeader';
import CharacterBuildSection from '@/components/character/guide/CharacterBuildSection';
import CharacterTalentSection from '@/components/character/guide/CharacterTalentSection';
import CharacterConstellationSection from '@/components/character/guide/CharacterConstellationSection';
import CharacterTeamSection from '@/components/character/guide/CharacterTeamSection';
import CharacterMaterialSection from '@/components/character/guide/CharacterMaterialSection';
import CharacterPlayGuide from '@/components/character/guide/CharacterPlayGuide';
import styles from '@/components/character/guide/CharacterGuide.module.css';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const character = getCharacterById(id);
  if (!character) return { title: 'Character Not Found' };

  return {
    title: `${character.name} Build Guide & Best Weapons | Genshin Impact`,
    description: `Complete ${character.name} guide: Best weapons, artifact sets, stat priorities, talent order, and team comps for Genshin Impact.`,
  };
}

export default async function CharacterGuidePage({ params }) {
  const { id } = await params;
  const character = getCharacterById(id);

  if (!character) {
    notFound();
  }

  // Fetch weapon and artifact lists for smart fallback recommendation engine
  const allWeapons = getWeapons();
  const allArtifacts = getArtifactSets();

  return (
    <article className={styles.guideContainer}>
      <CharacterHeader character={character} />

      {/* In-page navigation anchor bar */}
      <nav
        aria-label="Guide sections"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          padding: 'var(--space-2) 0',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
        <a href="#build-guide" className={styles.badgeItem} style={{ textDecoration: 'none' }}>
          ⚔️ Builds & Weapons
        </a>
        <a href="#talents" className={styles.badgeItem} style={{ textDecoration: 'none' }}>
          ⚡ Talents
        </a>
        <a href="#constellations" className={styles.badgeItem} style={{ textDecoration: 'none' }}>
          🌟 Constellations
        </a>
        <a href="#teams" className={styles.badgeItem} style={{ textDecoration: 'none' }}>
          👥 Teams
        </a>
        <a href="#materials" className={styles.badgeItem} style={{ textDecoration: 'none' }}>
          💎 Materials
        </a>
        <a href="#how-to-play" className={styles.badgeItem} style={{ textDecoration: 'none' }}>
          🎮 Rotation & Play
        </a>
      </nav>

      <CharacterBuildSection
        character={character}
        allWeapons={allWeapons}
        allArtifacts={allArtifacts}
      />

      <CharacterTalentSection character={character} />

      <CharacterConstellationSection constellations={character.constellations || []} />

      <CharacterTeamSection teams={character.teams || []} character={character} />

      <CharacterMaterialSection
        ascensionMaterials={character.ascensionMaterials || []}
        talentBooks={character.talentBooks || []}
      />

      <CharacterPlayGuide character={character} />
    </article>
  );
}
