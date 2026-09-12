import CharacterCard from './CharacterCard';
import styles from './CharacterGrid.module.css';

/**
 * Responsive grid container for CharacterCard components.
 */
export default function CharacterGrid({ characters = [] }) {
  if (!characters.length) return null;

  return (
    <div className={styles.grid}>
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
