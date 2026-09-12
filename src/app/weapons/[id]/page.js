import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWeaponById } from '@/database/repositories/index';
import { getWeaponImage, getWeaponFallback } from '@/lib/assets';
import { RARITY_COLORS } from '@/lib/constants';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const weapon = getWeaponById(id);
  if (!weapon) return { title: 'Weapon Not Found' };

  return {
    title: `${weapon.name} (${weapon.type}) Weapon Stats & Guide | Genshin Impact`,
    description: `Full stats for ${weapon.name}: Base ATK ${weapon.base_attack}, ${weapon.sub_stat || ''}, and passive: ${weapon.passive_name || ''}.`,
  };
}

export default async function WeaponDetailPage({ params }) {
  const { id } = await params;
  const weapon = getWeaponById(id);

  if (!weapon) {
    notFound();
  }

  const rarityCfg = RARITY_COLORS[weapon.rarity] || { color: '#fbbf24' };
  const img = getWeaponImage(weapon.id, weapon.type, weapon.name, weapon.rarity);
  const fallback = getWeaponFallback(weapon.id, weapon.type, weapon.name, weapon.rarity);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/weapons" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-xs)', fontWeight: 'bold', textDecoration: 'none' }}>
          &larr; Back to Weapons Database
        </Link>
      </div>

      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-8)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={weapon.name}
            style={{ width: '100%', borderRadius: 'var(--radius-xl)' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', margin: 0 }}>
                {weapon.name}
              </h1>
              <span style={{ color: rarityCfg.color, fontWeight: 'bold' }}>
                {'★'.repeat(weapon.rarity || 4)}
              </span>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              {weapon.type} &bull; Obtained via: {weapon.location || 'Wishes (Gacha)'}
            </span>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Base Attack (Lv. 90)
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {weapon.base_attack}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Secondary Substat
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {weapon.sub_stat || 'None'}
              </div>
            </div>
          </div>

          {/* Passive */}
          {weapon.passive_name && (
            <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-secondary)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 var(--space-2)' }}>
                Weapon Passive: {weapon.passive_name}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {weapon.passive_desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
