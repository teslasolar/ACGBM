// R3/gen-features.js — Archetype Feature Stamper
// Ring 3: stamps cute features onto body grid.

import { BODY_ARCHETYPES } from '../R0/archetype.js';
import { get, set, mirror, GRID } from '../R1/voxel.js';
import { mulberry32 } from '../R1/seed.js';

export function stampFeatures(grid, seed, type) {
  const rng = mulberry32(seed + 777);
  const A = BODY_ARCHETYPES[type] || BODY_ARCHETYPES.CONSTRUCT;

  for (let y = 0; y < GRID; y++)
    for (let z = 0; z < GRID; z++)
      for (let x = 0; x < 6; x++) {
        const dx = x-6, dz = z-6;
        let v = get(grid,x,y,z);
        const r = rng();

        if (A.base==='humanoid' && y===11 && Math.abs(dx)<2 && Math.abs(dz)<2) v=1;
        if (A.base==='humanoid' && y===11 && x===3 && Math.abs(dz)<1) v=1;
        if (A.base==='geometric' && v && (x+y+z)%2===0 && r>0.5) v=1;
        if (A.base==='mechanical' && y>=10 && Math.abs(dx)>=3 && Math.abs(dx)<4 && Math.abs(dz)<1) v=1;
        if (A.base==='fluid' && y>=3 && y<=6 && Math.abs(dx)>=3 && r>0.4) v=1;
        if (A.base==='fragment' && v && r>0.6) v=0;
        if (A.base==='fragment' && !v && y>=8 && r>0.92) v=1;
        if (A.base==='amorphous' && Math.abs(dx)<3 && Math.abs(dz)<3 && y>=2 && y<=10 && r>0.4) v=1;
        if (A.base==='robed' && y<5 && Math.abs(dx)<3.5 && Math.abs(dz)<3) v=1;
        if (A.base==='jagged' && y===11 && (x===2||x===4) && Math.abs(dz)<1) v=1;
        if (A.base==='jagged' && !get(grid,x,y,z) && r>0.93 && y>=7) v=1;

        set(grid,x,y,z,v); mirror(grid,x,y,z);
      }
  return grid;
}
