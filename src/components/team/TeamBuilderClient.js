'use client';

import { useState } from 'react';
import Link from 'next/link';
import ElementIcon from '@/components/ui/ElementIcon';
import SafeImage from '@/components/ui/SafeImage';
import { analyzeTeam } from '@/services/recommendations/team-engine';
import {
  getCharacterImage,
  getCharacterFallback,
  getCharacterImageFallbacks,
  getElementConfig,
} from '@/lib/assets';
import { ELEMENTS, WEAPON_TYPES } from '@/lib/constants';
import { useStorage } from '@/hooks/useStorage';
import styles from './TeamBuilder.module.css';

export default function TeamBuilderClient({ characters = [], prebuiltTeams = [] }) {
  const [selectedSlots, setSelectedSlots] = useState([null, null, null, null]);
  const [activeSlotModal, setActiveSlotModal] = useState(null);
  const [charSearch, setCharSearch] = useState('');
  const [charVision, setCharVision] = useState('');
  const [charRarity, setCharRarity] = useState('');
  const [charWeapon, setCharWeapon] = useState('');
  const [savedTeams, setSavedTeams] = useStorage('saved_teams', []);

  const activeCharacters = selectedSlots.filter(Boolean);
  const analysis = analyzeTeam(activeCharacters);

  const handleSelectCharacter = (char) => {
    if (activeSlotModal === null) return;
    const newSlots = [...selectedSlots];
    newSlots[activeSlotModal] = char;
    setSelectedSlots(newSlots);
    setActiveSlotModal(null);
  };

  const handleRemoveSlot = (index, e) => {
    e.stopPropagation();
    const newSlots = [...selectedSlots];
    newSlots[index] = null;
    setSelectedSlots(newSlots);
  };

  const handleLoadPrebuilt = (team) => {
    const slots = [null, null, null, null];
    if (Array.isArray(team.characters)) {
      team.characters.forEach((m, idx) => {
        if (idx < 4) {
          const match = characters.find(
            (c) => c.id === m.characterId || c.name.toLowerCase() === (m.characterName || '').toLowerCase()
          );
          if (match) slots[idx] = match;
        }
      });
    }
    setSelectedSlots(slots);
  };

  const handleSaveTeam = () => {
    if (!activeCharacters.length) return;
    const name = prompt('Name your custom team:', 'My Abyss Team');
    if (!name) return;

    const newTeam = {
      id: `custom-${Date.now()}`,
      name,
      characters: activeCharacters.map((c) => ({
        characterId: c.id,
        characterName: c.name,
        vision: c.vision,
      })),
      timestamp: new Date().toISOString(),
    };

    setSavedTeams([newTeam, ...savedTeams]);
  };

  // Filter list for modal selection
  const modalCharacters = characters.filter((c) => {
    if (charVision && c.vision?.toLowerCase() !== charVision.toLowerCase()) return false;
    if (charRarity && c.rarity !== parseInt(charRarity, 10)) return false;
    if (charWeapon && c.weapon_type?.toLowerCase() !== charWeapon.toLowerCase()) return false;
    if (charSearch && !c.name?.toLowerCase().includes(charSearch.toLowerCase())) return false;
    // Don't show characters already selected in other slots
    if (selectedSlots.some((s) => s?.id === c.id)) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      {/* 4-Slot Team Bar */}
      <div className={styles.slotsGrid}>
        {selectedSlots.map((slot, index) => {
          const elemCfg = slot ? getElementConfig(slot.vision) : null;
          const avatarUrl = slot ? getCharacterImage(slot.id, slot.vision, slot.name, 'icon-big') : '';
          const avatarFallbacks = slot ? getCharacterImageFallbacks(slot.id, slot.vision, slot.name, 'icon-big') : [];

          return (
            <div
              key={index}
              className={`${styles.slotCard} ${slot ? styles.slotFilled : styles.slotEmpty}`}
              onClick={() => setActiveSlotModal(index)}
              style={slot ? { '--slot-glow': elemCfg.bg, '--slot-border': elemCfg.color } : undefined}
            >
              {slot ? (
                <>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={(e) => handleRemoveSlot(index, e)}
                    title="Remove from team"
                    aria-label="Remove character"
                  >
                    ✕
                  </button>

                  <div className={styles.slotAvatarWrapper}>
                    <SafeImage
                      src={avatarUrl}
                      fallbacks={avatarFallbacks}
                      alt={slot.name}
                      className={styles.slotAvatar}
                    />
                    <div className={styles.slotElementBadge}>
                      <ElementIcon element={slot.vision} size={16} />
                    </div>
                  </div>

                  <div className={styles.slotInfo}>
                    <div className={styles.slotName}>{slot.name}</div>
                    <div className={styles.slotDetails}>
                      <span>{slot.weapon_type}</span>
                      <span style={{ color: '#fbbf24' }}>{'★'.repeat(slot.rarity || 5)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.swapBtn}
                    onClick={() => setActiveSlotModal(index)}
                  >
                    Change Member
                  </button>
                </>
              ) : (
                <div className={styles.emptyPrompt}>
                  <span className={styles.plusIcon}>+</span>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Slot {index + 1}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Choose Character</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className={styles.actionBar}>
        <button
          type="button"
          className={styles.btnPrimary}
          disabled={activeCharacters.length === 0}
          onClick={handleSaveTeam}
        >
          💾 Save Custom Party
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => setSelectedSlots([null, null, null, null])}
        >
          Reset Party
        </button>
      </div>

      {/* Detailed Analysis Grid */}
      <div className={styles.analysisGrid}>
        {/* Synergy Score & Reactions */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>⚡ Team Synergy &amp; Elemental Reactions</h2>
            <span className={styles.scoreBadge} style={{ background: analysis.score >= 80 ? '#10b981' : analysis.score >= 60 ? '#f59e0b' : '#64748b' }}>
              {analysis.score} / 100
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: 0 }}>
              Triggerable Elemental Reactions ({analysis.reactions.length})
            </h3>
            {analysis.reactions.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.reactions.map((r, i) => (
                  <div key={i} className={styles.reactionTag} title={r.multiplier}>
                    <strong>{r.name}</strong>
                    <span style={{ fontSize: '11px', opacity: 0.85 }}>({r.elements.join(' + ')})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                Select complementary elements (e.g. Pyro + Hydro for Vaporize) to activate reactions.
              </p>
            )}

            {/* Elemental Resonances */}
            <h3 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: 'var(--space-2) 0 0' }}>
              Party Resonances ({analysis.resonances.length})
            </h3>
            {analysis.resonances.length > 0 ? (
              analysis.resonances.map((res) => (
                <div key={res.element} className={styles.resonanceCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{res.icon}</span>
                    <strong>{res.name}</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    {res.effect}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                Include two characters of the same element to unlock active party buffs.
              </p>
            )}
          </div>
        </div>

        {/* Survivability, Energy & Combat Rotation */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>🛡️ Survivability &amp; Combat Strategy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Sustain Meter */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Survivability Status:</span>
                <strong style={{ fontSize: '12px', color: analysis.sustainRating.color }}>
                  {analysis.sustainRating.label}
                </strong>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>
                {analysis.sustainRating.note}
              </p>
            </div>

            {/* Energy Guidance */}
            {analysis.energyGuidance.length > 0 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: '#38bdf8', margin: '0 0 6px', fontWeight: 700 }}>
                  🔋 Energy Recharge &amp; Funneling
                </h3>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {analysis.energyGuidance.map((eg, idx) => (
                    <li key={idx}>{eg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rotation Order */}
            {analysis.rotationOrder.length > 0 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: '#a855f7', margin: '0 0 6px', fontWeight: 700 }}>
                  🔄 Recommended Combat Rotation Loop
                </h3>
                <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {analysis.rotationOrder.map((rot, idx) => (
                    <li key={idx}>{rot}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Strengths & Optimization */}
            {analysis.strengths.length > 0 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-xs)', color: '#10b981', fontWeight: 'bold', margin: '0 0 4px' }}>
                  ✓ Core Strengths
                </h3>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {analysis.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.suggestions.length > 0 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-xs)', color: '#f59e0b', fontWeight: 'bold', margin: '0 0 4px' }}>
                  ⚠️ Optimization Suggestions
                </h3>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {analysis.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pre-built Templates */}
      <div className={styles.templatesSection}>
        <h2 className={styles.panelTitle}>📜 Pre-built Meta Templates</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {prebuiltTeams.map((team) => (
            <div key={team.id} className={styles.templateCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 'var(--text-sm)', color: '#fff' }}>{team.name}</strong>
                <button
                  type="button"
                  className={styles.loadBtn}
                  onClick={() => handleLoadPrebuilt(team)}
                >
                  Load Team
                </button>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {Array.isArray(team.characters) ? team.characters.map((c) => c.characterName || c.characterId).join(' • ') : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VISUAL CHARACTER SELECTOR MODAL */}
      {activeSlotModal !== null && (
        <div className={styles.modalOverlay} onClick={() => setActiveSlotModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>👥</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', color: '#fff' }}>
                    Select Character for Slot {activeSlotModal + 1}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Choose a character by vision, weapon, or search. Click any portrait to add to party.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setActiveSlotModal(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Filter Controls Bar */}
            <div className={styles.modalFilterBar}>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search character name..."
                  value={charSearch}
                  onChange={(e) => setCharSearch(e.target.value)}
                  className={styles.modalSearch}
                  autoFocus
                />
                {charSearch && (
                  <button type="button" onClick={() => setCharSearch('')} className={styles.clearSearchBtn}>
                    ✕
                  </button>
                )}
              </div>

              {/* Visions */}
              <div className={styles.visionPills}>
                <button
                  type="button"
                  onClick={() => setCharVision('')}
                  className={`${styles.visionBtn} ${!charVision ? styles.visionActive : ''}`}
                >
                  All
                </button>
                {['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'].map((elem) => (
                  <button
                    key={elem}
                    type="button"
                    onClick={() => setCharVision(charVision === elem ? '' : elem)}
                    className={`${styles.visionBtn} ${charVision === elem ? styles.visionActive : ''}`}
                    title={elem}
                  >
                    <ElementIcon element={elem} size={14} />
                    <span>{elem}</span>
                  </button>
                ))}
              </div>

              {/* Rarity & Weapon Type Selectors */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={charRarity}
                  onChange={(e) => setCharRarity(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">All Rarities</option>
                  <option value="5">5★ Characters</option>
                  <option value="4">4★ Characters</option>
                </select>

                <select
                  value={charWeapon}
                  onChange={(e) => setCharWeapon(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">All Weapons</option>
                  {Object.keys(WEAPON_TYPES).map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>

                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', alignSelf: 'center', marginLeft: 'auto' }}>
                  Showing {modalCharacters.length} characters
                </span>
              </div>
            </div>

            {/* VISUAL CHARACTER CARD GRID */}
            <div className={styles.charSelectGrid}>
              {modalCharacters.length > 0 ? (
                modalCharacters.map((c) => {
                  const elemCfg = getElementConfig(c.vision);
                  const avatarUrl = getCharacterImage(c.id, c.vision, c.name, 'icon-big');
                  const avatarFallbacks = getCharacterImageFallbacks(c.id, c.vision, c.name, 'icon-big');

                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={styles.charPickCard}
                      onClick={() => handleSelectCharacter(c)}
                      style={{
                        '--char-color': elemCfg.color,
                        '--char-glow': elemCfg.bg,
                      }}
                      title={`${c.name} (${c.vision} • ${c.rarity}★ ${c.weapon_type})`}
                    >
                      <div className={styles.charPickImgBox}>
                        <SafeImage
                          src={avatarUrl}
                          fallbacks={avatarFallbacks}
                          alt={c.name}
                          className={styles.charPickImg}
                          loading="lazy"
                        />
                        <div className={styles.charPickElement}>
                          <ElementIcon element={c.vision} size={14} />
                        </div>
                        <div className={styles.charPickRarity}>
                          {c.rarity === 5 ? '5★' : '4★'}
                        </div>
                      </div>

                      <div className={styles.charPickMeta}>
                        <strong className={styles.charPickName}>{c.name}</strong>
                        <span className={styles.charPickWeapon}>{c.weapon_type}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No characters match the selected filters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

