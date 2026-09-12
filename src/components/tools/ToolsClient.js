'use client';

import { useState } from 'react';
import { useStorage } from '@/hooks/useStorage';

export default function ToolsClient({ characters = [], weapons = [] }) {
    const [activeTab, setActiveTab] = useState('stat-calc'); // 'stat-calc' | 'pity-tracker' | 'primo-calc'

    // Stat Calculator state
    const [baseAtk, setBaseAtk] = useState(335); // e.g. Hu Tao / Diluc base ATK
    const [weaponAtk, setWeaponAtk] = useState(608); // e.g. Staff of Homa / Wolf's Gravestone
    const [atkPercent, setAtkPercent] = useState(46.6); // artifact main + sub %
    const [flatAtk, setFlatAtk] = useState(311); // feather flat ATK
    const [critRate, setCritRate] = useState(65.0);
    const [critDmg, setCritDmg] = useState(160.0);
    const [elementalBonus, setElementalBonus] = useState(46.6);

    // Calculations
    const totalBaseAtk = Number(baseAtk) + Number(weaponAtk);
    const bonusAtkFromPercent = totalBaseAtk * (Number(atkPercent) / 100);
    const totalAtk = totalBaseAtk + bonusAtkFromPercent + Number(flatAtk);
    const avgCritMultiplier = 1 + (Math.min(100, Math.max(0, Number(critRate))) / 100) * (Number(critDmg) / 100);
    const totalEffectiveAtk = totalAtk * avgCritMultiplier * (1 + Number(elementalBonus) / 100);

    // Wish Pity Tracker state (persisted)
    const [pityCount, setPityCount] = useStorage('wish_pity_5star', 25);
    const [fourStarPity, setFourStarPity] = useStorage('wish_pity_4star', 4);
    const [isGuaranteed, setIsGuaranteed] = useStorage('wish_guaranteed_5star', false);
    const [savedPrimogems, setSavedPrimogems] = useStorage('wish_saved_primos', 12800);
    const [intertwinedFates, setIntertwinedFates] = useStorage('wish_saved_fates', 10);

    // Pity calculations
    const totalFatesAvailable = Math.floor(Number(savedPrimogems) / 160) + Number(intertwinedFates);
    const pullsNeededForHardPity = Math.max(0, 90 - pityCount);
    const softPityActive = pityCount >= 74;

    const handleAddPulls = (count) => {
        setPityCount((prev) => Math.min(90, prev + count));
        setFourStarPity((prev) => (prev + count) % 10);
    };

    const handleGot5Star = (wasFeatured) => {
        setPityCount(0);
        setFourStarPity(0);
        setIsGuaranteed(!wasFeatured);
    };

    return (
        <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-primary)', paddingBottom: 'var(--space-3)' }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('stat-calc')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-lg)',
                        background: activeTab === 'stat-calc' ? 'var(--color-primary)' : 'var(--bg-secondary)',
                        color: activeTab === 'stat-calc' ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                    }}
                >
                    ⚔️ Stat &amp; Damage Simulator
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('pity-tracker')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-lg)',
                        background: activeTab === 'pity-tracker' ? 'var(--color-primary)' : 'var(--bg-secondary)',
                        color: activeTab === 'pity-tracker' ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                    }}
                >
                    ✨ Wish Pity Tracker &amp; Counter
                </button>
            </div>

            {/* STAT CALCULATOR */}
            {activeTab === 'stat-calc' && (
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
                        Total Attack &amp; Crit DPS Simulator
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                Character Base ATK (Lv. 90)
                            </label>
                            <input
                                type="number"
                                value={baseAtk}
                                onChange={(e) => setBaseAtk(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', color: '#fff', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                Weapon Base ATK (Lv. 90)
                            </label>
                            <input
                                type="number"
                                value={weaponAtk}
                                onChange={(e) => setWeaponAtk(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', color: '#fff', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                Artifact ATK% Bonus
                            </label>
                            <input
                                type="number"
                                value={atkPercent}
                                onChange={(e) => setAtkPercent(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', color: '#fff', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                Flat ATK Bonus (Feather + Subs)
                            </label>
                            <input
                                type="number"
                                value={flatAtk}
                                onChange={(e) => setFlatAtk(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', color: '#fff', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                Crit Rate (%)
                            </label>
                            <input
                                type="number"
                                value={critRate}
                                onChange={(e) => setCritRate(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', color: '#fff', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                Crit DMG (%)
                            </label>
                            <input
                                type="number"
                                value={critDmg}
                                onChange={(e) => setCritDmg(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', color: '#fff', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                Elemental DMG Bonus (%)
                            </label>
                            <input
                                type="number"
                                value={elementalBonus}
                                onChange={(e) => setElementalBonus(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', color: '#fff', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                        <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Total Base ATK</span>
                            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'extrabold', color: 'var(--text-primary)' }}>
                                {Math.round(totalBaseAtk)}
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Final Sheet ATK</span>
                            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'extrabold', color: '#10b981' }}>
                                {Math.round(totalAtk)}
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Crit Multiplier</span>
                            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'extrabold', color: '#38bdf8' }}>
                                {avgCritMultiplier.toFixed(2)}x
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Effective Damage Power</span>
                            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'extrabold', color: '#a855f7' }}>
                                {Math.round(totalEffectiveAtk)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WISH PITY TRACKER */}
            {activeTab === 'pity-tracker' && (
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
                        Gacha Wish Pity Counter &amp; Primogem Calculator
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                        {/* 5-Star Pity Box */}
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#fbbf24' }}>5★ Character Pity</span>
                                {softPityActive && (
                                    <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 'bold' }}>
                                        🔥 Soft Pity Active!
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)', margin: 'var(--space-2) 0' }}>
                                {pityCount} <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>/ 90</span>
                            </div>

                            {/* Progress bar */}
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
                                <div style={{ width: `${(pityCount / 90) * 100}%`, height: '100%', background: softPityActive ? '#ef4444' : '#fbbf24', transition: 'width 0.3s ease' }} />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                <button type="button" onClick={() => handleAddPulls(1)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 'var(--text-xs)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    +1 Pull
                                </button>
                                <button type="button" onClick={() => handleAddPulls(10)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 'var(--text-xs)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    +10 Pulls
                                </button>
                                <button type="button" onClick={() => handleGot5Star(true)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: '#10b981', color: '#fff', border: 'none', fontSize: 'var(--text-xs)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Won 50/50 (Reset)
                                </button>
                                <button type="button" onClick={() => handleGot5Star(false)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: '#ef4444', color: '#fff', border: 'none', fontSize: 'var(--text-xs)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Lost 50/50 (Guaranteed)
                                </button>
                            </div>
                        </div>

                        {/* Savings & Fates Calculator */}
                        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: 'var(--space-3)' }}>
                                Primogem &amp; Fate Inventory
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                        Saved Primogems
                                    </label>
                                    <input
                                        type="number"
                                        value={savedPrimogems}
                                        onChange={(e) => setSavedPrimogems(Math.max(0, Number(e.target.value) || 0))}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: '#fff', fontWeight: 'bold' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 'bold' }}>
                                        Intertwined Fates
                                    </label>
                                    <input
                                        type="number"
                                        value={intertwinedFates}
                                        onChange={(e) => setIntertwinedFates(Math.max(0, Number(e.target.value) || 0))}
                                        style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: '#fff', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>

                            <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>Total Available Pulls</div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '900', color: '#10b981' }}>
                                    {totalFatesAvailable} Pulls
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    {isGuaranteed ? '✨ 100% Guaranteed Featured 5★' : '⚖️ 50/50 Chance on next 5★'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
