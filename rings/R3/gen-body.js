// R3/gen-body.js — Chibi Body Generator
// Ring 3: composes R0/archetype + R1/voxel + R1/seed.

import { BODY_ARCHETYPES } from '../R0/archetype.js';
import { createGrid, set, mirror, GRID } from '../R1/voxel.js';
import { mulberry32 } from '../R1/seed.js';

export function genBody(seed, type) {
  const rng = mulberry32(seed);
  const grid = createGrid();
  const A = BODY_ARCHETYPES[type] || BODY_ARCHETYPES.CONSTRUCT;
  const hc = 9.5, hr = 2.8 * A.headScale;

  for (let y = 0; y < GRID; y++)
    for (let z = 0; z < GRID; z++)
      for (let x = 0; x < 6; x++) {
        const dx = x - 6, dz = z - 6;
        let fill = 0;

        // Big round head
        if (y >= 7) {
          const d = (dx/(hr*0.9))**2 + ((y-hc)/hr)**2 + ((z-6)/(hr*0.85))**2;
          if (d < 1) fill = 1;
          if (y>=8 && y<=9 && Math.abs(dx)>=2 && Math.abs(dx)<=3 && Math.abs(dz)<2) fill = 1;
        }
        // Stubby body
        if (y >= 2 && y < 7 && Math.abs(dx) < 2.5*A.width && Math.abs(dz) < 2.2) fill = 1;
        // Stubby legs
        if (y < 2 && Math.abs(Math.abs(dx)-1.5) < 1.2 && Math.abs(dz) < 1.5) fill = 1;
        // Arms
        if (y>=3 && y<=5 && Math.abs(dx)>=2.5*A.width && Math.abs(dx)<3.5 && Math.abs(dz)<1.5)
          fill = rng() > 0.2 ? 1 : 0;

        if (fill && rng() > 0.95) fill = 0;
        set(grid, x, y, z, fill);
        mirror(grid, x, y, z);
      }
  return grid;
}
