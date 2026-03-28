// stats.js — Member data → card stats
// Deterministic stat generation from guild member data

const RARITY_THRESHOLDS = {
  LEGENDARY: 10000,
  EPIC: 8000,
  RARE: 6000,
  UNCOMMON: 4000,
  COMMON: 0
};

const RARITY_LABELS = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

function hashSeed(name) {
  let seed = 0;
  for (let i = 0; i < name.length; i++) {
    seed = (seed * 31 + name.charCodeAt(i)) & 0xFFFFFFFF;
  }
  return seed >>> 0;
}

function calculateStats(member, seed) {
  const skillCount = member.skills.length;
  const yearsActive = 2026 - (2000 + member.year);

  const atk = skillCount * member.tier * 200 + (seed % 400);
  const def = member.tier * 600 + ((seed >>> 4) % 300);
  const spd = skillCount * 150 + ((seed >>> 8) % 200);
  const res = yearsActive * 400 + member.tier * 300;
  const total = atk + def + spd + res;

  return { atk, def, spd, res, total };
}

function getRarity(total) {
  if (total >= RARITY_THRESHOLDS.LEGENDARY) return 'LEGENDARY';
  if (total >= RARITY_THRESHOLDS.EPIC) return 'EPIC';
  if (total >= RARITY_THRESHOLDS.RARE) return 'RARE';
  if (total >= RARITY_THRESHOLDS.UNCOMMON) return 'UNCOMMON';
  return 'COMMON';
}

function getRarityColor(rarity) {
  const colors = {
    COMMON: '#CD7F32',
    UNCOMMON: '#C0C0C0',
    RARE: '#FFD700',
    EPIC: '#9400D3',
    LEGENDARY: '#FF4500'
  };
  return colors[rarity] || '#CD7F32';
}

export { hashSeed, calculateStats, getRarity, getRarityColor, RARITY_THRESHOLDS, RARITY_LABELS };
