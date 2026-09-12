'use client';

import Link from 'next/link';
import styles from './CharacterGuide.module.css';

export default function CharacterMaterialSection({ ascensionMaterials = [], talentBooks = [] }) {
  return (
    <section className={styles.sectionContainer} id="materials">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>💎</span> Ascension & Talent Materials
        </h2>
        <Link
          href="/farming"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-primary)',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          Check Farming Schedule &rarr;
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Talent Books & Availability */}
        <div className={styles.cardSection}>
          <h3 className={styles.cardSectionTitle}>
            <span>📜 Talent Books</span>
          </h3>

          {talentBooks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {talentBooks.map((book) => (
                <div
                  key={book.id || book.book_type}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {book.name || `${book.book_type} Series`}
                  </strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    <span>Domain: <strong>{book.source_domain || 'Talent Domain'}</strong></span>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {Array.isArray(book.availability) ? book.availability.join(', ') : 'Daily'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Standard regional talent book domain schedule applies.
            </p>
          )}
        </div>

        {/* Level 1-90 Material Summary */}
        <div className={styles.cardSection}>
          <h3 className={styles.cardSectionTitle}>
            <span>📦 Total Level 90 Requirements</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span>Character EXP</span>
              <strong>419 Hero&apos;s Wit</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span>Mora (Ascension + Talents)</span>
              <strong>~7,050,000 Mora</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span>Local Specialties</span>
              <strong>168 Items</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span>Boss Drops</span>
              <strong>46 Drops</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span>Crown of Insight</span>
              <strong>1 - 3 Crowns</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
