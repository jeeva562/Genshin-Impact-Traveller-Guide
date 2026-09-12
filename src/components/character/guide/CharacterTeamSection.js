'use client';

import Link from 'next/link';
import ElementIcon from '@/components/ui/ElementIcon';
import SafeImage from '@/components/ui/SafeImage';
import { getCharacterImage, getCharacterImageFallbacks, getCharacterFallback } from '@/lib/assets';
import styles from './CharacterGuide.module.css';

export default function CharacterTeamSection({ teams = [], character }) {
  return (
    <section className={styles.sectionContainer} id="teams">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>👥</span> Recommended Team Compositions
        </h2>
        <Link
          href="/teams"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-primary)',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          Open Team Builder &rarr;
        </Link>
      </div>

      {teams.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {teams.map((team, idx) => (
            <div
              key={team.id || idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                  {team.name}
                </h3>
                {team.playstyle && (
                  <span style={{ fontSize: '11px', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', color: 'var(--text-tertiary)' }}>
                    {team.playstyle}
                  </span>
                )}
              </div>

              {/* Character slots */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
                {Array.isArray(team.characters) && team.characters.map((member, mIdx) => {
                  const charId = member.characterId || '';
                  const avatarUrl = getCharacterImage(charId, member.vision, member.characterName, 'icon');
                  const avatarFallbacks = getCharacterImageFallbacks(charId, member.vision, member.characterName, 'icon');

                  return (
                    <Link
                      key={mIdx}
                      href={`/characters/${charId}`}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        transition: 'transform 0.2s ease, border-color 0.2s ease',
                      }}
                    >
                      <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: '#131724', border: '1.5px solid var(--border-primary)' }}>
                        <SafeImage
                          src={avatarUrl}
                          fallbacks={avatarFallbacks}
                          alt={member.characterName || charId}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {member.vision && (
                          <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'rgba(0,0,0,0.85)', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                            <ElementIcon element={member.vision} size={10} />
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {member.characterName || member.characterId}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-primary)' }}>
                        {member.role || 'Teammate'}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {team.description && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {team.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
            Synergizes effectively with Hydro, Anemo, and Pyro reaction enablers.
          </p>
          <Link
            href="/teams"
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Create Custom Team in Team Builder
          </Link>
        </div>
      )}
    </section>
  );
}

