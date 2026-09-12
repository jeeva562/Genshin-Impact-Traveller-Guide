/**
 * Advanced Team Synergy & Combat Analysis Engine.
 * Analyzes team compositions, elemental resonances, available reactions,
 * role balance, survivability/comfort, energy funneling requirements,
 * optimal rotation sequencing, and Spiral Abyss matchup ratings.
 */

export const ELEMENTAL_RESONANCES = {
  Pyro: {
    name: 'Fervent Flames',
    effect: 'Affected by Cryo for 40% less time. Increases ATK by 25%.',
    icon: '🔥',
  },
  Hydro: {
    name: 'Soothing Water',
    effect: 'Affected by Pyro for 40% less time. Increases Max HP by 25%.',
    icon: '💧',
  },
  Anemo: {
    name: 'Impetuous Winds',
    effect: 'Decreases Stamina Consumption by 15%. Increases Movement SPD by 10%. Shortens Skill CD by 5%.',
    icon: '💨',
  },
  Electro: {
    name: 'High Voltage',
    effect: 'Affected by Hydro for 40% less time. Superconduct, Overloaded, Electro-Charged, Quicken, Aggravate, or Hyperbloom generate 1 Electro Particle.',
    icon: '⚡',
  },
  Dendro: {
    name: 'Sprawling Greenery',
    effect: 'Elemental Mastery increased by 50. Triggering reactions grants additional EM bonus (up to +80 EM).',
    icon: '🌿',
  },
  Cryo: {
    name: 'Shattering Ice',
    effect: 'Affected by Electro for 40% less time. Increases CRIT Rate against enemies Frozen or affected by Cryo by 15%.',
    icon: '❄️',
  },
  Geo: {
    name: 'Enduring Rock',
    effect: 'Increases shield strength by 15%. Characters protected by a shield have 15% increased DMG and deal 20% Geo RES shred on hit.',
    icon: '💎',
  },
};

export const REACTIONS = [
  { elements: ['Pyro', 'Hydro'], name: 'Vaporize', multiplier: '1.5x - 2.0x Amplifying Multiplier' },
  { elements: ['Pyro', 'Cryo'], name: 'Melt', multiplier: '1.5x - 2.0x Amplifying Multiplier' },
  { elements: ['Hydro', 'Electro'], name: 'Electro-Charged', multiplier: 'Continuous chain lightning DMG' },
  { elements: ['Hydro', 'Cryo'], name: 'Freeze', multiplier: 'Freezes target solid for crowd control' },
  { elements: ['Pyro', 'Electro'], name: 'Overloaded', multiplier: 'Heavy AoE Pyro DMG + Knockback' },
  { elements: ['Cryo', 'Electro'], name: 'Superconduct', multiplier: 'AoE Cryo DMG + 40% Physical RES shred' },
  { elements: ['Anemo', 'Pyro'], name: 'Swirl (Pyro)', multiplier: 'AoE Pyro spread + 4pc VV RES shred' },
  { elements: ['Anemo', 'Hydro'], name: 'Swirl (Hydro)', multiplier: 'AoE Hydro spread + 4pc VV RES shred' },
  { elements: ['Anemo', 'Electro'], name: 'Swirl (Electro)', multiplier: 'AoE Electro spread + 4pc VV RES shred' },
  { elements: ['Anemo', 'Cryo'], name: 'Swirl (Cryo)', multiplier: 'AoE Cryo spread + 4pc VV RES shred' },
  { elements: ['Dendro', 'Hydro'], name: 'Bloom', multiplier: 'Generates Dendro Cores' },
  { elements: ['Dendro', 'Electro'], name: 'Quicken / Aggravate', multiplier: 'Additive Base DMG bonus to Electro/Dendro attacks' },
  { elements: ['Dendro', 'Pyro'], name: 'Burning', multiplier: 'Rapid continuous Pyro ticks' },
  { elements: ['Geo', 'Pyro'], name: 'Crystallize (Pyro)', multiplier: 'Generates Pyro shield shard' },
  { elements: ['Geo', 'Hydro'], name: 'Crystallize (Hydro)', multiplier: 'Generates Hydro shield shard' },
  { elements: ['Geo', 'Electro'], name: 'Crystallize (Electro)', multiplier: 'Generates Electro shield shard' },
  { elements: ['Geo', 'Cryo'], name: 'Crystallize (Cryo)', multiplier: 'Generates Cryo shield shard' },
];

const HEALERS = ['bennett', 'kokomi', 'baizhu', 'jean', 'barbara', 'kuki-shinobu', 'xianyun', 'sigewinne', 'yaoyao', 'diona', 'charlotte', 'sayu', 'qiqi', 'dori', 'chevreuse'];
const SHIELDERS = ['zhongli', 'layla', 'kirara', 'diona', 'thoma', 'noelle', 'baizhu', 'xinyan', 'yanfei'];

export function analyzeTeam(characters = []) {
  if (!characters.length) {
    return {
      resonances: [],
      reactions: [],
      score: 0,
      strengths: [],
      suggestions: ['Add at least one Main DPS and one Support or Healer to build your party.'],
      roles: { mainDps: 0, subDps: 0, buffer: 0, sustain: 0 },
      sustainRating: { label: 'Incomplete', color: '#64748b', note: 'Add characters to evaluate.' },
      energyGuidance: [],
      rotationOrder: [],
      abyssMatchups: { aoe: 'N/A', singleTarget: 'N/A', shieldBreak: [] },
    };
  }

  // Count elements
  const elementCounts = {};
  const visions = [];
  for (const c of characters) {
    if (c?.vision) {
      visions.push(c.vision);
      elementCounts[c.vision] = (elementCounts[c.vision] || 0) + 1;
    }
  }

  // Detect Resonances
  const resonances = [];
  for (const [elem, count] of Object.entries(elementCounts)) {
    if (count >= 2 && ELEMENTAL_RESONANCES[elem]) {
      resonances.push({
        element: elem,
        ...ELEMENTAL_RESONANCES[elem],
      });
    }
  }

  // Detect possible Reactions
  const reactions = [];
  const uniqueElements = Object.keys(elementCounts);
  for (const reaction of REACTIONS) {
    const [e1, e2] = reaction.elements;
    if (uniqueElements.includes(e1) && uniqueElements.includes(e2)) {
      reactions.push(reaction);
    }
  }

  // Advanced Multi-Element Reactions
  if (uniqueElements.includes('Dendro') && uniqueElements.includes('Hydro')) {
    if (uniqueElements.includes('Electro')) {
      reactions.push({
        elements: ['Dendro', 'Hydro', 'Electro'],
        name: 'Hyperbloom',
        multiplier: 'Tier 0 homing Dendro projectile dealing immense single-target DMG based on trigger EM',
      });
    }
    if (uniqueElements.includes('Pyro')) {
      reactions.push({
        elements: ['Dendro', 'Hydro', 'Pyro'],
        name: 'Burgeon',
        multiplier: 'Explosive AoE Dendro DMG detonating all nearby Dendro Cores simultaneously',
      });
    }
  }

  // Role Analysis
  let hasHealer = false;
  let hasShielder = false;
  let mainDpsCount = 0;
  let subDpsCount = 0;
  let bufferCount = 0;
  let sustainCount = 0;

  characters.forEach((c) => {
    const cid = c.id?.toLowerCase() || '';
    const role = (c.role || '').toLowerCase();

    if (HEALERS.includes(cid) || role.includes('healer')) {
      hasHealer = true;
      sustainCount++;
    } else if (SHIELDERS.includes(cid) || role.includes('shielder')) {
      hasShielder = true;
      sustainCount++;
    } else if (role.includes('main') || role.includes('hypercarry')) {
      mainDpsCount++;
    } else if (role.includes('sub') || role.includes('off-field')) {
      subDpsCount++;
    } else {
      bufferCount++;
    }
  });

  // Sustain Rating
  let sustainRating = { label: 'High (Shielded & Healed)', color: '#10b981', note: 'Maximum comfort and interruption resistance.' };
  if (hasHealer && !hasShielder) {
    sustainRating = { label: 'Comfortable (Healer)', color: '#3b82f6', note: 'Steady HP recovery, watch out for heavy stagger/interruption.' };
  } else if (!hasHealer && hasShielder) {
    sustainRating = { label: 'Solid (Shielder)', color: '#eab308', note: 'Full interruption resistance; beware of Corrosion or shield bypass.' };
  } else if (!hasHealer && !hasShielder && characters.length >= 3) {
    sustainRating = { label: 'Glass Cannon (No Sustain)', color: '#ef4444', note: 'High burst potential but zero survival cushion. Requires precise iframes.' };
  }

  // Energy & Battery Recommendations
  const energyGuidance = [];
  if (characters.some((c) => c.id === 'raiden')) {
    energyGuidance.push('⚡ Raiden Shogun is present: Refunds ~25 flat energy to whole team. Party ER needs can be dropped by 20-30%.');
  }
  if (characters.some((c) => ['xiangling', 'xingqiu', 'beidou', 'faruzan'].includes(c.id))) {
    energyGuidance.push('🔋 High Energy Bursts detected: Ensure off-field supports carry Favonius weapons or build 180%+ ER.');
  }
  if (resonances.some((r) => r.element === 'Hydro')) {
    energyGuidance.push('💧 Double Hydro battery: Generates abundant Hydro particles; lowering individual ER thresholds to ~160%.');
  }
  if (resonances.some((r) => r.element === 'Pyro') && characters.some((c) => c.id === 'bennett')) {
    energyGuidance.push('🔥 Bennett Particle Funneling: Tap Bennett Skill and swap to your Pyro DPS to catch energy particles.');
  }

  // Rotation Sequencing
  const rotationOrder = [];
  const bufferUnits = characters.filter((c) => ['furina', 'kazuha', 'sucrose', 'zhongli', 'bennett', 'nahida', 'xilonen', 'shenhe'].includes(c.id));
  const auraUnits = characters.filter((c) => ['xingqiu', 'yelan', 'xiangling', 'fischl', 'yae-miko', 'rosaria'].includes(c.id));
  const mainUnits = characters.filter((c) => ['hu-tao', 'raiden', 'neuvillette', 'alhaitham', 'navia', 'arlecchino', 'clorinde', 'mualani', 'chasca', 'mavuika', 'xiao', 'ayaka'].includes(c.id));

  if (bufferUnits.length > 0) {
    rotationOrder.push(`1. Opener & Buffs: Deploy ${bufferUnits.map((c) => c.name).join(' / ')} (Skills & Bursts) for RES shred and damage amplification.`);
  }
  if (auraUnits.length > 0) {
    rotationOrder.push(`2. Off-field Enablers: Cast ${auraUnits.map((c) => c.name).join(' / ')} to set up continuous elemental application.`);
  }
  if (mainUnits.length > 0) {
    rotationOrder.push(`3. Main Carry On-Field: Swap to ${mainUnits.map((c) => c.name).join(' / ')} and execute full damage combo within buff windows.`);
  } else {
    rotationOrder.push(`Execute quickswap skill/burst loop across team members on cooldown.`);
  }
  rotationOrder.push(`4. Recharge Phase: Funnel energy particles before restarting next rotation cycle.`);

  // Shield Break Capability
  const shieldBreak = [];
  if (uniqueElements.includes('Pyro')) shieldBreak.push('Cryo Shields (Excellent)');
  if (uniqueElements.includes('Hydro')) shieldBreak.push('Pyro Shields (Excellent)');
  if (uniqueElements.includes('Cryo')) shieldBreak.push('Electro & Hydro Shields (Great)');
  if (uniqueElements.includes('Geo') || characters.some((c) => c.weapon_type === 'Claymore')) shieldBreak.push('Geo Shields & Blunt Armor (Excellent)');
  if (uniqueElements.includes('Dendro')) shieldBreak.push('Hydro Abyss Heralds (Top Tier)');

  // Score calculation
  let score = 50;
  score += resonances.length * 12;
  score += Math.min(reactions.length * 6, 24);
  if (characters.length === 4) score += 10;
  if (hasHealer || hasShielder) score += 8;
  if (mainDpsCount >= 1 && (subDpsCount >= 1 || bufferCount >= 1)) score += 6;
  score = Math.min(Math.round(score), 100);

  // Suggestions & Strengths
  const strengths = [];
  const suggestions = [];

  if (resonances.length > 0) {
    strengths.push(`Active Resonance: ${resonances.map((r) => r.name).join(', ')}`);
  }
  if (reactions.some((r) => r.name === 'Vaporize' || r.name === 'Melt')) {
    strengths.push('Amplifying reactions (Vaporize/Melt) available for peak burst damage multipliers.');
  }
  if (reactions.some((r) => r.name === 'Hyperbloom')) {
    strengths.push('Tier 0 Hyperbloom reaction enabled — exceptional F2P friendly damage floor.');
  }
  if (uniqueElements.includes('Anemo')) {
    strengths.push('Anemo character present for 4pc Viridescent Venerer resistance shred and crowd control.');
  }
  if (hasShielder && hasHealer) {
    strengths.push('Complete dual sustain (Shield + Healing) ensures 100% interruption-free uptime.');
  }

  if (characters.length < 4) {
    suggestions.push(`Add ${4 - characters.length} more character(s) to complete the 4-person party.`);
  }
  if (!hasHealer && !hasShielder && characters.length >= 2) {
    suggestions.push('No dedicated sustain (Healer or Shielder) detected. Consider swapping one slot for survivability in high-tier Abyss floors.');
  }
  if (mainDpsCount > 2) {
    suggestions.push('Multiple On-field Carries detected. Consider replacing one with an off-field Sub-DPS or buffer to optimize field time.');
  }

  return {
    resonances,
    reactions,
    score,
    strengths,
    suggestions,
    roles: { mainDps: mainDpsCount, subDps: subDpsCount, buffer: bufferCount, sustain: sustainCount },
    sustainRating,
    energyGuidance,
    rotationOrder,
    abyssMatchups: {
      aoe: uniqueElements.includes('Anemo') || reactions.some((r) => r.name.includes('Swirl') || r.name === 'Burgeon') ? 'S-Tier (Superior AoE)' : 'A-Tier (Standard)',
      singleTarget: reactions.some((r) => r.name === 'Vaporize' || r.name === 'Hyperbloom') ? 'S-Tier (Boss Shredder)' : 'A-Tier',
      shieldBreak,
    },
  };
}
