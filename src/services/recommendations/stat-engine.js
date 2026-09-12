/**
 * Stat recommendation engine.
 * Computes optimal main stats, substat priority, and stat targets
 * based on character vision, weapon, and role.
 */

export function getStatRecommendations(character) {
  const vision = character.vision || 'Pyro';
  const role = character.role || (character.rarity === 5 ? 'Main DPS' : 'Sub DPS');

  let sands = 'ATK%';
  let goblet = `${vision} DMG Bonus`;
  let circlet = 'CRIT Rate / CRIT DMG';

  // Specific role or scaling overrides
  if (character.id === 'zhongli' || character.id === 'nilou' || character.id === 'neuvillette' || character.id === 'furina' || character.id === 'yelan' || character.id === 'kokomi') {
    sands = 'HP%';
    if (character.id === 'kokomi') circlet = 'Healing Bonus / HP%';
    if (character.id === 'nilou') {
      goblet = 'HP%';
      circlet = 'HP%';
    }
  } else if (character.id === 'albedo' || character.id === 'itto' || character.id === 'noelle' || character.id === 'chiori') {
    sands = 'DEF%';
  } else if (character.id === 'raiden' || character.id === 'bennett' || character.id === 'xingqiu' || character.id === 'xiangling') {
    if (character.id === 'raiden' || character.id === 'bennett') {
      sands = 'Energy Recharge';
    }
  } else if (character.id === 'nahida' || character.id === 'kazuha' || character.id === 'sucrose') {
    sands = 'Elemental Mastery';
    goblet = 'Elemental Mastery';
    circlet = 'Elemental Mastery';
  }

  // Substats
  let subStats = ['CRIT Rate', 'CRIT DMG', 'ATK%', 'Energy Recharge'];
  if (character.id === 'kokomi') {
    subStats = ['HP%', 'Energy Recharge', 'HP', 'Elemental Mastery'];
  } else if (['zhongli', 'neuvillette', 'furina', 'yelan', 'nilou'].includes(character.id)) {
    subStats = ['CRIT Rate', 'CRIT DMG', 'HP%', 'Energy Recharge'];
  } else if (['nahida', 'kazuha', 'sucrose'].includes(character.id)) {
    subStats = ['Elemental Mastery', 'Energy Recharge', 'CRIT Rate', 'ATK%'];
  } else if (['albedo', 'itto', 'noelle'].includes(character.id)) {
    subStats = ['CRIT Rate', 'CRIT DMG', 'DEF%', 'Energy Recharge'];
  }

  // Stat targets
  const statTargets = {
    'CRIT Rate': { min: '50%', good: '65%', excellent: '75%+' },
    'CRIT DMG': { min: '120%', good: '150%', excellent: '180%+' },
    'Energy Recharge': { min: '120%', good: '140%', excellent: '160%+' },
    'ATK': { min: '1,600', good: '1,900', excellent: '2,200+' },
  };

  if (['zhongli', 'neuvillette', 'furina', 'yelan', 'nilou'].includes(character.id)) {
    delete statTargets['ATK'];
    statTargets['HP'] = { min: '30,000', good: '35,000', excellent: '40,000+' };
  } else if (['nahida', 'kazuha', 'sucrose'].includes(character.id)) {
    statTargets['Elemental Mastery'] = { min: '600', good: '800', excellent: '1,000+' };
  }

  return {
    mainStats: {
      sands,
      goblet,
      circlet,
    },
    subStats,
    statTargets,
  };
}
