import Link from 'next/link';
import { getTalentBooks } from '@/database/repositories/index';

export const metadata = {
  title: 'Materials & Talent Books Database | Genshin Impact',
  description: 'Explore character talent books, domain schedules, and ascension materials across all 7 regions of Teyvat.',
};

export default function MaterialsPage() {
  const talentBooks = getTalentBooks();

  // Group by book type
  const grouped = {};
  for (const book of talentBooks) {
    if (!grouped[book.book_type]) {
      grouped[book.book_type] = {
        type: book.book_type,
        domain: book.source_domain,
        days: book.availability,
        tiers: [],
      };
    }
    grouped[book.book_type].tiers.push(book);
  }

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Materials &amp; Talent Books
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Overview of regional talent ascension series, source domains, and weekly availability schedule.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        {Object.values(grouped).map((group) => (
          <div
            key={group.type}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, textTransform: 'capitalize' }}>
                {group.type} Series
              </h2>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                Domain Material
              </span>
            </div>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Source Domain: <strong style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{group.domain?.replace(/-/g, ' ')}</strong>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '2px' }}>Weekly Days:</span>
              <strong style={{ color: 'var(--color-primary)' }}>
                {Array.isArray(group.days) ? group.days.join(', ') : 'Daily'}
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'var(--space-2)' }}>
              {group.tiers.map((tier) => (
                <div
                  key={tier.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{tier.name}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                    {'★'.repeat(tier.rarity)}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/farming"
              style={{
                fontSize: '11px',
                color: 'var(--color-primary)',
                fontWeight: 'bold',
                textDecoration: 'none',
                marginTop: 'auto',
                paddingTop: 'var(--space-2)',
              }}
            >
              Check Characters Needing This &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
