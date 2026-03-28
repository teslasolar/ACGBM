// R3/gen-card.js — Card Composer
// Ring 3: top-level card generation from member data.

import { TYPE_MAP, ELEMENT_MAP } from '../R0/archetype.js';
import { mapAbilities } from '../R0/ability.js';
import { generateStats } from './gen-stats.js';
import { genName, genCardId } from './gen-name.js';
import { genBody } from './gen-body.js';
import { stampFeatures } from './gen-features.js';
import { encodeDepth, applyDepth } from './gen-barcode3d.js';

export function generateCard(member) {
  const { seed, stats, rarity, rarityColor } = generateStats(member);
  const type = TYPE_MAP[member.role] || 'CONSTRUCT';
  const element = ELEMENT_MAP[type];
  const abilities = mapAbilities(member.skills, member.tier);

  let grid = genBody(seed, type);
  grid = stampFeatures(grid, seed, type);
  grid = applyDepth(grid, encodeDepth(seed));

  return {
    id: genCardId(seed), monsterName: genName(seed, type),
    memberId: member.id, memberName: member.name,
    type, element, rarity, stats, abilities,
    tier: member.tier, set: 'GEN-1',
    color: member.color, seed, voxelGrid: grid,
    rarityColor, cardNumber: (seed % 510) + 1, totalCards: 510
  };
}

export function generateAllCards(members) {
  return members.map(m => generateCard(m));
}
