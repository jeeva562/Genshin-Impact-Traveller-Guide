'use client';

import { useState } from 'react';
import Link from 'next/link';
import ElementIcon from '@/components/ui/ElementIcon';
import { DAYS_OF_WEEK } from '@/lib/constants';

export default function FarmingClient({ initialSchedule = [], currentDay = 'Monday' }) {
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredSchedule = initialSchedule.filter((group) => {
    if (selectedDay === 'Sunday') return true;
    return Array.isArray(group.days) && group.days.includes(selectedDay);
  });

  return (
    <div>
      {/* Day Selector Pills */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {days.map((d) => {
          const isSelected = selectedDay === d;
          const isToday = currentDay === d;

          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: isSelected ? 'var(--color-primary)' : 'var(--bg-secondary)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--duration-fast)',
              }}
            >
              <span>{d}</span>
              {isToday && (
                <span
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--color-primary)',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info notice */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-6)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}
      >
        <span>
          Showing talent books farmable on <strong>{selectedDay}</strong>
          {selectedDay === 'Sunday' ? ' (All domains open on Sunday!)' : ''}
        </span>
        <span style={{ color: 'var(--text-tertiary)' }}>
          Tip: Concentrate condensed resin on your core team&apos;s book days.
        </span>
      </div>

      {/* Domains & Characters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredSchedule.map((item) => (
          <div
            key={`${item.domain}-${item.bookType}`}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, textTransform: 'capitalize' }}>
                  {item.bookName || `${item.bookType} Books`}
                </h3>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                  Open Today
                </span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                Domain: {item.domain?.replace(/-/g, ' ')}
              </span>
            </div>

            {/* Characters who need this book */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                Characters Needing This ({item.characters?.length || 0}):
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.characters?.map((c) => (
                  <Link
                    key={c.id}
                    href={`/characters/${c.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-secondary)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '11px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                    }}
                  >
                    <ElementIcon element={c.vision} size={12} />
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
