import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArtifactSetById, getArtifactSets } from '@/database/repositories/index';
import { getArtifactImage, getArtifactFallback } from '@/lib/assets';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const set = getArtifactSetById(id);
  if (!set) return { title: 'Artifact Set Not Found' };

  return {
    title: `${set.name} Artifact Set Bonuses & Guide | Genshin Impact`,
    description: `Full set effects for ${set.name}: 2-Piece bonus and 4-Piece bonus breakdown for Genshin Impact.`,
  };
}

export default async function ArtifactDetailPage({ params }) {
  const { id } = await params;
  const set = getArtifactSetById(id);

  if (!set) {
    notFound();
  }

  const img = getArtifactImage(set.id);
  const fallback = getArtifactFallback(set.id, set.name);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/artifacts" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-xs)', fontWeight: 'bold', textDecoration: 'none' }}>
          &larr; Back to Artifacts Database
        </Link>
      </div>

      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={set.name}
            style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-lg)' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', margin: 0 }}>
              {set.name}
            </h1>
            <span style={{ fontSize: 'var(--text-xs)', color: '#fbbf24', fontWeight: 'bold' }}>
              Rarity: Up to {set.max_rarity}★
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-secondary)' }}>
            <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-primary)', margin: '0 0 var(--space-2)' }}>
              2-Piece Set Bonus
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
              {set.two_piece_bonus || 'None'}
            </p>
          </div>

          {set.four_piece_bonus && (
            <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-secondary)' }}>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-primary)', margin: '0 0 var(--space-2)' }}>
                4-Piece Set Bonus
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                {set.four_piece_bonus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
