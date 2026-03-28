// R3/gen-stats.js — Stat Generator
// Ring 3: composes R0/stat + R0/rarity.

import { hashSeed, calcStats, totalPower } from '../R0/stat.js';
import { getRarity, getRarityColor } from '../R0/rarity.js';

export function generateStats(member) {
  const seed = hashSeed(member.name);
  const stats = calcStats(member, seed);
  const total = totalPower(stats);
  const rarity = getRarity(total);
  return {
    seed, stats: { ...stats, total },
    rarity, rarityColor: getRarityColor(rarity)
  };
}
