'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getArtifactImage, getArtifactImageFallbacks, getArtifactFallback } from '@/lib/assets';
import SafeImage from '@/components/ui/SafeImage';
import Interactive3DViewer from '@/components/ui/Interactive3DViewer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ArtifactsClient({ initialArtifacts = [] }) {
  const [filters, setFilters] = useState({
    search: '',
    rarity: '',
  });
  const [inspectArtifact, setInspectArtifact] = useState(null);

  const filtered = useMemo(() => {
    return initialArtifacts.filter((set) => {
      if (filters.rarity && Number(set.max_rarity) !== Number(filters.rarity)) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = set.name?.toLowerCase().includes(q);
        const matches2pc = set.two_piece_bonus?.toLowerCase().includes(q);
        const matches4pc = set.four_piece_bonus?.toLowerCase().includes(q);
        if (!matchesName && !matches2pc && !matches4pc) return false;
      }
      return true;
    });
  }, [initialArtifacts, filters]);

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <input
            type="text"
            placeholder="Search artifact sets by name or bonus effect..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{
              flex: 1,
              height: '44px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '0 var(--space-4)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
            }}
          />
          {(filters.search || filters.rarity) && (
            <button
              type="button"
              onClick={() => setFilters({ search: '', rarity: '' })}
              style={{
                padding: '0 var(--space-4)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => setFilters({ ...filters, rarity: '' })}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: !filters.rarity ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: !filters.rarity ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            All Sets
          </button>
          <button
            type="button"
            onClick={() => setFilters({ ...filters, rarity: filters.rarity === '5' ? '' : '5' })}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: filters.rarity === '5' ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: filters.rarity === '5' ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            5-Star Sets Only
          </button>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Showing <strong>{filtered.length}</strong> artifact set{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {filtered.map((set) => {
            const img = getArtifactImage(set.id, 'flower-of-life');
            const fallbacks = getArtifactImageFallbacks(set.id, 'flower-of-life', set.name);
            const fallback = getArtifactFallback(set.id, set.name);

            return (
              <div
                key={set.id}
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
                <Link
                  href={`/artifacts/${set.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-secondary)',
                      }}
                    >
                      <SafeImage
                        src={img}
                        fallbacks={fallbacks}
                        alt={set.name}
                        style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>
                        {set.name}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
                        Up to {set.max_rarity}★
                      </span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '2px' }}>
                      2-Piece Bonus
                    </div>
                    {set.two_piece_bonus || 'None'}
                  </div>

                  {set.four_piece_bonus && (
                    <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '2px' }}>
                        4-Piece Bonus
                      </div>
                      {set.four_piece_bonus}
                    </div>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setInspectArtifact({
                      title: set.name,
                      type: `${set.max_rarity}★ Artifact Set`,
                      imageUrl: img,
                      fallbackUrl: fallback,
                      accentColor: '#a78bfa',
                      rarity: set.max_rarity || 5,
                    })
                  }
                  style={{
                    marginTop: 'auto',
                    padding: '6px 12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <span>🔮</span> Inspect 360° Piece
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="🏵️"
          title="No artifact sets found"
          description="Try broadening your artifact search query."
          actionLabel="Clear Filters"
          onAction={() => setFilters({ search: '', rarity: '' })}
        />
      )}

      {inspectArtifact && (
        <Interactive3DViewer
          isOpen={true}
          onClose={() => setInspectArtifact(null)}
          title={inspectArtifact.title}
          type={inspectArtifact.type}
          imageUrl={inspectArtifact.imageUrl}
          fallbackUrl={inspectArtifact.fallbackUrl}
          accentColor={inspectArtifact.accentColor}
          rarity={inspectArtifact.rarity}
        />
      )}
    </div>
  );
}

