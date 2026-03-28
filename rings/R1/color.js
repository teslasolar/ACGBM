// R1/color.js — Color / Shading Template
// Ring 1: imports R0/element for palette lookup.

import { ELEMENT_COLORS } from '../R0/element.js';
import { mulberry32 } from './seed.js';

export function voxelColor(grid, x, y, z, element, seed) {
  const C = ELEMENT_COLORS[element] || ELEMENT_COLORS.METAL;
  const rng = mulberry32(seed + x * 1000 + y * 100 + z);

  // Big sparkly eyes
  if (y === 9 && z >= 8 && z <= 9 && (x===4||x===7||x===3||x===8)) return '#FFFFFF';
  if (y === 9 && z === 8 && (x===4||x===7)) return '#111111';
  if (y === 10 && z === 9 && (x===3||x===8)) return '#FFFFFF';

  // Blush cheeks
  if (y===8 && z>=8 && z<=9 && (x===2||x===3||x===8||x===9)) return C.blush;

  // Mouth
  if (y===8 && z===8 && (x===5||x===6)) return C.shadow;

  // Light model: height + front facing
  const light = (y/12)*0.4 + (z/12)*0.4 + 0.2;
  const r = rng();

  if (light > 0.7) return r < 0.4 ? C.glow : r < 0.7 ? C.secondary : C.primary;
  if (light > 0.4) return r < 0.5 ? C.primary : r < 0.8 ? C.secondary : C.glow;
  return r < 0.5 ? C.shadow : r < 0.8 ? C.primary : C.secondary;
}
