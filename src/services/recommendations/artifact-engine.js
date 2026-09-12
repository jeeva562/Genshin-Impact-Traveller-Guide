/**
 * Artifact recommendation engine.
 * Scores artifact sets based on element matching, energy recharge needs, and role.
 */

export function scoreArtifactsForCharacter(character, artifactList = []) {
  if (!artifactList.length) return [];
  const vision = (character.vision || '').toLowerCase();

  const scored = artifactList.map((set) => {
    let score = 40;
    const name = (set.name || '').toLowerCase();
    const twoPc = (set.two_piece_bonus || '').toLowerCase();
    const fourPc = (set.four_piece_bonus || '').toLowerCase();

    // 5-star sets preferred
    if (set.max_rarity === 5) score += 20;

    // Direct element matching
    if (twoPc.includes(vision) || fourPc.includes(vision)) {
      score += 35;
    }

    // Universal sets
    if (name.includes('emblem of severed fate')) {
      if (['raiden', 'xiangling', 'xingqiu', 'yelan', 'beidou'].includes(character.id)) {
        score += 50;
      }
    } else if (name.includes('viridescent venerer') && vision === 'anemo') {
      score += 60;
    } else if (name.includes('deepwood memories') && vision === 'dendro') {
      score += 60;
    } else if (name.includes('noblesse oblige')) {
      if (['bennett', 'diona', 'mika', 'mona'].includes(character.id)) {
        score += 55;
      }
    } else if (name.includes('golden troupe')) {
      if (['furina', 'fischl', 'yae-miko', 'albedo', 'chiori'].includes(character.id)) {
        score += 55;
      }
    } else if (name.includes('maréchaussée') || name.includes('marechaussee')) {
      if (['neuvillette', 'wriothesley', 'lyney', 'gaming'].includes(character.id)) {
        score += 55;
      }
    } else if (name.includes('crimson witch') && vision === 'pyro') {
      score += 45;
    } else if (name.includes('blizzard strayer') && vision === 'cryo') {
      score += 45;
    }

    // Substat bonuses
    if (twoPc.includes('crit') || twoPc.includes('atk +18%')) score += 15;
    if (twoPc.includes('energy recharge')) score += 12;
    if (twoPc.includes('elemental mastery')) score += 12;

    return {
      set,
      score,
      reason: `2-Piece: ${set.two_piece_bonus} | 4-Piece: ${set.four_piece_bonus}`,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
}
