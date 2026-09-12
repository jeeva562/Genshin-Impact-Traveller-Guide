'use client';

import { useState } from 'react';
import ElementIcon from '@/components/ui/ElementIcon';

export default function CompareClient({ characters = [], weapons = [] }) {
  const [compareMode, setCompareMode] = useState('character'); // 'character' | 'weapon'
  const [charA, setCharA] = useState(characters[0]?.id || '');
  const [charB, setCharB] = useState(characters[1]?.id || '');

  const [weapA, setWeapA] = useState(weapons[0]?.id || '');
  const [weapB, setWeapB] = useState(weapons[1]?.id || '');

  const objA = compareMode === 'character'
    ? characters.find((c) => c.id === charA) || characters[0]
    : weapons.find((w) => w.id === weapA) || weapons[0];

  const objB = compareMode === 'character'
    ? characters.find((c) => c.id === charB) || characters[1]
    : weapons.find((w) => w.id === weapB) || weapons[1];

  return (
    <div>
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-6)' }}>
        <button
          type="button"
          onClick={() => setCompareMode('character')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            background: compareMode === 'character' ? 'var(--color-primary)' : 'var(--bg-secondary)',
            color: compareMode === 'character' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
            fontWeight: 'bold',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
          }}
        >
          Compare Characters
        </button>
        <button
          type="button"
          onClick={() => setCompareMode('weapon')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            background: compareMode === 'weapon' ? 'var(--color-primary)' : 'var(--bg-secondary)',
            color: compareMode === 'weapon' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
            fontWeight: 'bold',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
          }}
        >
          Compare Weapons
        </button>
      </div>

      {/* Selectors Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 60px 1fr',
          gap: 'var(--space-4)',
          alignItems: 'center',
          marginBottom: 'var(--space-8)',
        }}
      >
        <select
          value={compareMode === 'character' ? charA : weapA}
          onChange={(e) => compareMode === 'character' ? setCharA(e.target.value) : setWeapA(e.target.value)}
          style={{
            height: '44px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '0 var(--space-4)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {(compareMode === 'character' ? characters : weapons).map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
          VS
        </div>

        <select
          value={compareMode === 'character' ? charB : weapB}
          onChange={(e) => compareMode === 'character' ? setCharB(e.target.value) : setWeapB(e.target.value)}
          style={{
            height: '44px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '0 var(--space-4)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {(compareMode === 'character' ? characters : weapons).map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {[objA, objB].map((item, idx) => {
          if (!item) return null;
          return (
            <div
              key={idx}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
                  {item.name}
                </h2>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                  {'★'.repeat(item.rarity || item.max_rarity || 5)}
                </span>
              </div>

              {compareMode === 'character' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <span>Element / Vision</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                      <ElementIcon element={item.vision} size={16} />
                      <span>{item.vision}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <span>Weapon Class</span>
                    <strong>{item.weapon_type}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <span>Nation of Origin</span>
                    <strong>{item.nation || 'Teyvat'}</strong>
                  </div>

                  {item.description && (
                    <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.description}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <span>Weapon Class</span>
                    <strong>{item.type}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <span>Base Attack (Lv. 90)</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{item.base_attack}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                    <span>Secondary Substat</span>
                    <strong style={{ color: '#10b981' }}>{item.sub_stat || 'None'}</strong>
                  </div>

                  {item.passive_desc && (
                    <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {item.passive_name || 'Weapon Effect'}
                      </strong>
                      {item.passive_desc}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
