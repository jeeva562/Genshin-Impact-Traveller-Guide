/**
 * Weapon recommendation engine.
 * Scores weapons for a character based on matching weapon type, substat synergy, and passive effects.
 */

export function scoreWeaponsForCharacter(character, weaponsList = []) {
  if (!weaponsList.length) return [];
  const charWeaponType = (character.weapon_type || '').toLowerCase();

  // Filter only matching weapon types
  const compatible = weaponsList.filter((w) => {
    const wType = (w.type || '').toLowerCase();
    return wType === charWeaponType;
  });

  const scored = compatible.map((weapon) => {
    let score = 50; // base score
    const sub = (weapon.sub_stat || '').toLowerCase();
    const rarity = weapon.rarity || 4;

    // Rarity bonus
    score += rarity * 8;

    // Substat bonuses
    if (sub.includes('crit')) {
      score += 25;
    } else if (sub.includes('energy recharge')) {
      if (['raiden', 'bennett', 'xingqiu', 'xiangling', 'furina'].includes(character.id)) {
        score += 30;
      } else {
        score += 15;
      }
    } else if (sub.includes('elemental mastery')) {
      if (['nahida', 'kazuha', 'sucrose', 'hu-tao', 'xiangling'].includes(character.id)) {
        score += 28;
      } else {
        score += 10;
      }
    } else if (sub.includes('hp')) {
      if (['zhongli', 'neuvillette', 'furina', 'yelan', 'kokomi', 'nilou'].includes(character.id)) {
        score += 30;
      } else {
        score -= 10;
      }
    } else if (sub.includes('atk')) {
      score += 18;
    }

    // F2P accessibility note
    let category = 'BiS (Best in Slot)';
    if (rarity === 5) {
      category = 'Best 5★ Option';
    } else if (['the-catch', 'favonius-sword', 'favonius-lance', 'favonius-warbow', 'sacrificial-sword', 'iron-sting', 'catch'].includes(weapon.id)) {
      category = 'Top F2P / 4★ Option';
      score += 10;
    } else {
      category = 'Solid 4★ Alternative';
    }

    return {
      weapon,
      score,
      category,
      reason: `Provides strong ${weapon.sub_stat || 'stats'} and synergizes well with ${character.name}'s kit.`,
    };
  });

  // Sort descending by score
  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
}
