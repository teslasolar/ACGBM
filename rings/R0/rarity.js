// R0/rarity.js — Rarity UDT
// Ring 0: atomic type. No imports. Self-enclosed.

export const THRESHOLDS = {
  LEGENDARY: 10000,
  EPIC: 8000,
  RARE: 6000,
  UNCOMMON: 4000,
  COMMON: 0
};

export const RARITY_COLORS = {
  COMMON:    '#CD7F32',
  UNCOMMON:  '#C0C0C0',
  RARE:      '#FFD700',
  EPIC:      '#9400D3',
  LEGENDARY: '#FF4500'
};

export function getRarity(total) {
  if (total >= 10000) return 'LEGENDARY';
  if (total >= 8000)  return 'EPIC';
  if (total >= 6000)  return 'RARE';
  if (total >= 4000)  return 'UNCOMMON';
  return 'COMMON';
}

export function getRarityColor(rarity) {
  return RARITY_COLORS[rarity] || '#CD7F32';
}
