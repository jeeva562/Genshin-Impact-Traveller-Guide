/**
 * Upgrade priority engine for the Build Planner.
 * Evaluates current character progression (level, weapon level, talent levels, artifact main stats)
 * and generates a prioritized, actionable recommendation list.
 */

export function calculateUpgradePriorities({
  character,
  charLevel = 80,
  weaponLevel = 80,
  normalTalent = 6,
  skillTalent = 8,
  burstTalent = 8,
  hasCorrectMainStats = true,
  critRate = 50,
  critDmg = 100,
}) {
  const steps = [];

  // Step 1: Weapon level is the highest flat ATK and base multiplier
  if (weaponLevel < 90) {
    steps.push({
      priority: 'Highest',
      category: 'Weapon',
      title: `Ascend Weapon to Level 90 (Current: ${weaponLevel})`,
      description: 'Weapons provide base ATK which all ATK% bonuses scale from. Maxing weapon to 90 is 100% guaranteed resin value.',
      resinCost: 'Low - Medium',
      impactScore: 95,
    });
  }

  // Step 2: Key talents to 8 or 9
  const maxTalent = Math.max(normalTalent, skillTalent, burstTalent);
  if (burstTalent < 8 || skillTalent < 8) {
    steps.push({
      priority: 'High',
      category: 'Talents',
      title: 'Level Core Talents to 8/8/8',
      description: 'Each talent level provides ~6-7% DPS increase with guaranteed return, free from artifact RNG.',
      resinCost: 'Medium',
      impactScore: 90,
    });
  } else if (maxTalent < 9) {
    steps.push({
      priority: 'High',
      category: 'Talents',
      title: 'Level Signature Talent to 9 (or Crown to 10)',
      description: 'Crown your main scaling talent (Burst for Raiden/Xiangling, Skill for Furina/Nahida, Normal Attack for Hu Tao).',
      resinCost: 'Medium - High',
      impactScore: 85,
    });
  }

  // Step 3: Character ascension to 80/90 (unlocks final passive / stat)
  if (charLevel < 90) {
    const isTransformative = ['nahida', 'kazuha', 'sucrose', 'shinobu', 'nilou', 'neuvillette'].includes(character?.id);
    steps.push({
      priority: isTransformative ? 'Highest' : 'Medium',
      category: 'Character Level',
      title: isTransformative
        ? `Ascend Character to Level 90 (Essential for ${character?.name || 'Character'})`
        : `Ascend Character to 80/90 (Unlock Final Stat Ascension)`,
      description: isTransformative
        ? 'Transformative reactions (Hyperbloom, Swirl, Bloom) scale quadratically with character level from 80 to 90 (~34% DMG boost).'
        : 'Unlocks final ascension stat and talent level cap. Level 90 can be saved for later if resin is limited.',
      resinCost: 'High',
      impactScore: isTransformative ? 98 : 75,
    });
  }

  // Step 4: Correct Artifact Main Stats
  if (!hasCorrectMainStats) {
    steps.push({
      priority: 'Critical',
      category: 'Artifacts',
      title: 'Secure Correct Main Stats (Sands / Goblet / Circlet)',
      description: 'Do not worry about substats until you have the correct primary main stat on each slot (+20 on 5-star pieces).',
      resinCost: 'Medium',
      impactScore: 95,
    });
  }

  // Step 5: Crit Ratio & Substats
  const critRatio = critDmg > 0 ? (critRate / (critDmg / 2)).toFixed(2) : '1';
  if (critRate < 60) {
    steps.push({
      priority: 'Medium',
      category: 'Artifact Substats',
      title: `Optimize CRIT Rate (Current: ${critRate}%)`,
      description: `Aim for at least 60-70% CRIT Rate to consistently trigger critical hits and stabilize damage variance.`,
      resinCost: 'High (RNG)',
      impactScore: 70,
    });
  } else if (critDmg < 130) {
    steps.push({
      priority: 'Medium',
      category: 'Artifact Substats',
      title: `Increase CRIT DMG (Current: ${critDmg}%)`,
      description: `Aim for a 1:2 CRIT Rate to CRIT DMG ratio (e.g. 70% CRIT Rate / 140% CRIT DMG).`,
      resinCost: 'High (RNG)',
      impactScore: 65,
    });
  }

  return steps.sort((a, b) => b.impactScore - a.impactScore);
}
