'use client';

import { useState } from 'react';
import ElementIcon from '@/components/ui/ElementIcon';
import { calculateUpgradePriorities } from '@/services/recommendations/upgrade-engine';
import { useStorage } from '@/hooks/useStorage';

export default function PlannerClient({ characters = [] }) {
  const [selectedCharId, setSelectedCharId] = useState(characters[0]?.id || 'hu-tao');
  const [charLevel, setCharLevel] = useState(80);
  const [weaponLevel, setWeaponLevel] = useState(80);
  const [normalTalent, setNormalTalent] = useState(6);
  const [skillTalent, setSkillTalent] = useState(6);
  const [burstTalent, setBurstTalent] = useState(6);
  const [hasCorrectMainStats, setHasCorrectMainStats] = useState(true);
  const [critRate, setCritRate] = useState(55);
  const [critDmg, setCritDmg] = useState(110);

  const [savedPlans, setSavedPlans] = useStorage('saved_plans', []);

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const priorities = calculateUpgradePriorities({
    character: selectedChar,
    charLevel: Number(charLevel),
    weaponLevel: Number(weaponLevel),
    normalTalent: Number(normalTalent),
    skillTalent: Number(skillTalent),
    burstTalent: Number(burstTalent),
    hasCorrectMainStats,
    critRate: Number(critRate),
    critDmg: Number(critDmg),
  });

  const handleSavePlan = () => {
    const plan = {
      id: `plan-${Date.now()}`,
      characterId: selectedChar.id,
      characterName: selectedChar.name,
      charLevel,
      weaponLevel,
      talents: `${normalTalent}/${skillTalent}/${burstTalent}`,
      crit: `${critRate}% / ${critDmg}%`,
      date: new Date().toLocaleDateString(),
    };
    setSavedPlans([plan, ...savedPlans]);
    alert(`Progress plan for ${selectedChar.name} saved!`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 'var(--space-8)' }}>
      {/* Configuration Column */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
      >
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
          ⚙️ Current Character Setup
        </h2>

        {/* Select Character */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Select Character
          </label>
          <select
            value={selectedCharId}
            onChange={(e) => setSelectedCharId(e.target.value)}
            style={{
              width: '100%',
              height: '42px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '0 var(--space-3)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.vision})
              </option>
            ))}
          </select>
        </div>

        {/* Character & Weapon Level */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '4px' }}>
              Char Level
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={charLevel}
              onChange={(e) => setCharLevel(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0 var(--space-3)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '4px' }}>
              Weapon Level
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={weaponLevel}
              onChange={(e) => setWeaponLevel(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0 var(--space-3)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Talents */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '4px' }}>
            Talent Levels (Normal / Skill / Burst)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
            <input
              type="number"
              min="1"
              max="10"
              value={normalTalent}
              onChange={(e) => setNormalTalent(e.target.value)}
              style={{ height: '38px', background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '0 8px', color: 'var(--text-primary)', textAlign: 'center' }}
            />
            <input
              type="number"
              min="1"
              max="10"
              value={skillTalent}
              onChange={(e) => setSkillTalent(e.target.value)}
              style={{ height: '38px', background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '0 8px', color: 'var(--text-primary)', textAlign: 'center' }}
            />
            <input
              type="number"
              min="1"
              max="10"
              value={burstTalent}
              onChange={(e) => setBurstTalent(e.target.value)}
              style={{ height: '38px', background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '0 8px', color: 'var(--text-primary)', textAlign: 'center' }}
            />
          </div>
        </div>

        {/* Crit Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '4px' }}>
              CRIT Rate (%)
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={critRate}
              onChange={(e) => setCritRate(e.target.value)}
              style={{ width: '100%', height: '38px', background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '0 8px', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '4px' }}>
              CRIT DMG (%)
            </label>
            <input
              type="number"
              min="50"
              max="300"
              value={critDmg}
              onChange={(e) => setCritDmg(e.target.value)}
              style={{ width: '100%', height: '38px', background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '0 8px', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Main Stats checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={hasCorrectMainStats}
            onChange={(e) => setHasCorrectMainStats(e.target.checked)}
          />
          I already have correct +20 5★ Main Stats
        </label>

        <button
          type="button"
          onClick={handleSavePlan}
          style={{
            padding: '10px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: 'var(--space-2)',
          }}
        >
          Save Build Progress
        </button>
      </div>

      {/* Actionable Recommendations Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
              🎯 What to Upgrade Next for {selectedChar.name}
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Sorted by Guaranteed Resin Return
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {priorities.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-4)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: idx === 0 ? 'var(--color-primary)' : 'var(--bg-secondary)',
                    color: idx === 0 ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: 'var(--text-sm)',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                      {step.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: step.priority === 'Highest' || step.priority === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: step.priority === 'Highest' || step.priority === 'Critical' ? '#ef4444' : 'var(--color-primary)',
                        fontWeight: 'bold',
                      }}
                    >
                      {step.priority} Priority
                    </span>
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '4px 0' }}>
                    {step.description}
                  </p>

                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    <span>Resin Investment: <strong>{step.resinCost}</strong></span>
                    <span>Guaranteed Gain: <strong>{step.impactScore}%</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Plans */}
        {savedPlans.length > 0 && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
            }}
          >
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>
              📋 Saved Character Progression Plans
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
              {savedPlans.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3)',
                    fontSize: '11px',
                  }}
                >
                  <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{p.characterName}</strong>
                  <div style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Level: {p.charLevel} &bull; Weapon: {p.weaponLevel}
                  </div>
                  <div style={{ color: 'var(--text-tertiary)' }}>
                    Talents: {p.talents} &bull; CRIT: {p.crit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
