import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <span className={styles.brandName}>Traveller Guide</span>
            <p className={styles.brandDesc}>
              A professional Genshin Impact companion. Build smarter, play better,
              and make every decision count.
            </p>
          </div>

          <div className={styles.column}>
            <h4>Database</h4>
            <Link href="/characters">Characters</Link>
            <Link href="/weapons">Weapons</Link>
            <Link href="/artifacts">Artifacts</Link>
            <Link href="/materials">Materials</Link>
          </div>

          <div className={styles.column}>
            <h4>Tools</h4>
            <Link href="/teams">Team Builder</Link>
            <Link href="/planner">Build Planner</Link>
            <Link href="/farming">Farming Guide</Link>
            <Link href="/compare">Compare</Link>
          </div>

          <div className={styles.column}>
            <h4>Guides</h4>
            <Link href="/guides">All Guides</Link>
            <Link href="/guides?category=beginner">Beginner</Link>
            <Link href="/guides?category=advanced">Advanced</Link>
            <Link href="/guides?category=mechanics">Mechanics</Link>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.disclaimer}>
            <strong>Disclaimer:</strong> This website is an unofficial fan project and is not
            affiliated with, endorsed by, or sponsored by HoYoverse. All game data,
            character names, and related properties are trademarks and copyrights of
            HoYoverse. All information is provided for informational and educational
            purposes only. Game data sourced from community APIs under MIT license.
          </p>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Traveller Guide
          </span>
        </div>
      </div>
    </footer>
  );
}
