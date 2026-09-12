/**
 * Talent priority recommendation engine.
 * Determines whether Burst, Skill, or Normal Attack should be prioritized.
 */

export function getTalentPriority(character) {
  // Specific character overrides
  const id = character.id;
  
  if (['hu-tao', 'yoimiya', 'ganyu', 'xiao', 'lyney', 'neuvillette', 'wriothesley', 'wanderer', 'tighnari'].includes(id)) {
    return [
      { name: 'Normal Attack', priority: 1, stars: 5, tag: 'Highest Priority' },
      { name: 'Elemental Skill', priority: 2, stars: 4, tag: 'High Priority' },
      { name: 'Elemental Burst', priority: 3, stars: 3, tag: 'Moderate Priority' },
    ];
  }

  if (['raiden', 'xiangling', 'xingqiu', 'bennett', 'yelan', 'beidou', 'ayaka', 'eula'].includes(id)) {
    return [
      { name: 'Elemental Burst', priority: 1, stars: 5, tag: 'Highest Priority' },
      { name: 'Elemental Skill', priority: 2, stars: 4, tag: 'High Priority' },
      { name: 'Normal Attack', priority: 3, stars: 1, tag: 'Low Priority / Leave at 1' },
    ];
  }

  if (['furina', 'nahida', 'fischl', 'albedo', 'kazuha', 'zhongli', 'chiori', 'yae-miko'].includes(id)) {
    return [
      { name: 'Elemental Skill', priority: 1, stars: 5, tag: 'Highest Priority' },
      { name: 'Elemental Burst', priority: 2, stars: 4, tag: 'High Priority' },
      { name: 'Normal Attack', priority: 3, stars: 1, tag: 'Low Priority / Leave at 1' },
    ];
  }

  // Default priority for DPS vs Support
  return [
    { name: 'Elemental Burst', priority: 1, stars: 5, tag: 'Priority 1' },
    { name: 'Elemental Skill', priority: 2, stars: 4, tag: 'Priority 2' },
    { name: 'Normal Attack', priority: 3, stars: 2, tag: 'Priority 3' },
  ];
}
