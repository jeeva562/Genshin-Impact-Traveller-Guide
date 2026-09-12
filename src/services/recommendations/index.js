import { getStatRecommendations } from './stat-engine';
import { scoreWeaponsForCharacter } from './weapon-engine';
import { scoreArtifactsForCharacter } from './artifact-engine';
import { getTalentPriority } from './talent-engine';
import { analyzeTeam } from './team-engine';
import { calculateUpgradePriorities } from './upgrade-engine';

export {
  getStatRecommendations,
  scoreWeaponsForCharacter,
  scoreArtifactsForCharacter,
  getTalentPriority,
  analyzeTeam,
  calculateUpgradePriorities,
};

/**
 * Generate full comprehensive recommendation for a character
 */
export function getFullCharacterRecommendations(character, allWeapons = [], allArtifacts = []) {
  const stats = getStatRecommendations(character);
  const weapons = scoreWeaponsForCharacter(character, allWeapons);
  const artifacts = scoreArtifactsForCharacter(character, allArtifacts);
  const talentPriority = getTalentPriority(character);

  return {
    stats,
    weapons,
    artifacts,
    talentPriority,
  };
}
