'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { WEAPON_TYPES, RARITY_COLORS } from '@/lib/constants';
import { getWeaponImage, getWeaponImageFallbacks, getWeaponFallback } from '@/lib/assets';
import SafeImage from '@/components/ui/SafeImage';
import Interactive3DViewer from '@/components/ui/Interactive3DViewer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function WeaponsClient({ initialWeapons = [] }) {
  const [filters, setFilters] = useState({
    type: '',
    rarity: '',
    search: '',
  });
  const [inspectWeapon, setInspectWeapon] = useState(null);

  const filteredWeapons = useMemo(() => {
    return initialWeapons.filter((w) => {
      if (filters.type && w.type?.toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }
      if (filters.rarity && Number(w.rarity) !== Number(filters.rarity)) {
        return false;
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = w.name?.toLowerCase().includes(query);
        const matchesSub = w.sub_stat?.toLowerCase().includes(query);
        const matchesPassive = w.passive_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesPassive) {
          return false;
        }
      }
      return true;
    });
  }, [initialWeapons, filters]);

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
        {/* Search */}
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <input
            type="text"
            placeholder="Search weapons by name or substat..."
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
          {(filters.type || filters.rarity || filters.search) && (
            <button
              type="button"
              onClick={() => setFilters({ type: '', rarity: '', search: '' })}
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

        {/* Type and Rarity Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => setFilters({ ...filters, type: '' })}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: !filters.type ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: !filters.type ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            All Types
          </button>
          {Object.entries(WEAPON_TYPES).map(([type, item]) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilters({ ...filters, type: filters.type === type ? '' : type })}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: filters.type === type ? 'var(--color-primary)' : 'var(--bg-surface)',
                color: filters.type === type ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{item.icon}</span>
              <span>{type}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => setFilters({ ...filters, rarity: '' })}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: !filters.rarity ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: !filters.rarity ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            All Stars
          </button>
          {[5, 4, 3].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilters({ ...filters, rarity: filters.rarity === String(r) ? '' : String(r) })}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: filters.rarity === String(r) ? 'var(--color-primary)' : 'var(--bg-surface)',
                color: filters.rarity === String(r) ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {'★'.repeat(r)} {r}-Star
            </button>
          ))}
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Showing <strong>{filteredWeapons.length}</strong> weapon{filteredWeapons.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Grid */}
      {filteredWeapons.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {filteredWeapons.map((weapon) => {
            const rarityCfg = RARITY_COLORS[weapon.rarity] || { color: '#fbbf24' };
            const img = getWeaponImage(weapon.id, weapon.type, weapon.name, weapon.rarity);
            const fallbacks = getWeaponImageFallbacks(weapon.id, weapon.type, weapon.name, weapon.rarity);
            const fallback = getWeaponFallback(weapon.id, weapon.type, weapon.name, weapon.rarity);

            return (
              <div
                key={weapon.id}
                style={{
                  position: 'relative',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                <Link
                  href={`/weapons/${weapon.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <SafeImage
                      src={img}
                      fallbacks={fallbacks}
                      alt={weapon.name}
                      style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: 0 }}>
                        {weapon.name}
                      </h3>
                      <span style={{ color: rarityCfg.color, fontSize: '11px', fontWeight: 'bold' }}>
                        {'★'.repeat(weapon.rarity || 4)}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {weapon.type} | Base ATK: {weapon.base_attack}
                    </div>
                  </div>

                  {weapon.sub_stat && (
                    <div
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                      }}
                    >
                      Substat: {weapon.sub_stat}
                    </div>
                  )}

                  {weapon.passive_desc && (
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {weapon.passive_desc}
                    </p>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setInspectWeapon({
                      title: weapon.name,
                      type: `${weapon.rarity}★ ${weapon.type}`,
                      imageUrl: img,
                      fallbackUrl: fallback,
                      accentColor: rarityCfg.color,
                      rarity: weapon.rarity,
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
                  <span>🔮</span> Inspect 360°
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="⚔️"
          title="No weapons match your filters"
          description="Try broadening your weapon search criteria."
          actionLabel="Clear Filters"
          onAction={() => setFilters({ type: '', rarity: '', search: '' })}
        />
      )}

      {inspectWeapon && (
        <Interactive3DViewer
          isOpen={true}
          onClose={() => setInspectWeapon(null)}
          title={inspectWeapon.title}
          type={inspectWeapon.type}
          imageUrl={inspectWeapon.imageUrl}
          fallbackUrl={inspectWeapon.fallbackUrl}
          accentColor={inspectWeapon.accentColor}
          rarity={inspectWeapon.rarity}
        />
      )}
    </div>
  );
}

