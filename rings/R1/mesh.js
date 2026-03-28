// R1/mesh.js — Mesh Generation Template
// Ring 1: voxel → triangle mesh. Imports R1/voxel.

import { GRID, get } from './voxel.js';

const VOXEL_MM = 2.0;

const FACES = [
  { n:[0,0,1],  v:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]] },
  { n:[0,0,-1], v:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]] },
  { n:[0,1,0],  v:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]] },
  { n:[0,-1,0], v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]] },
  { n:[1,0,0],  v:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]] },
  { n:[-1,0,0], v:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]] }
];

const DIRS = [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]];

export function toMesh(grid) {
  const tris = [];
  for (let y = 0; y < GRID; y++)
    for (let z = 0; z < GRID; z++)
      for (let x = 0; x < GRID; x++) {
        if (!get(grid, x, y, z)) continue;
        for (let f = 0; f < 6; f++) {
          const [nx,ny,nz] = DIRS[f];
          if (get(grid, x+nx, y+ny, z+nz)) continue;
          const face = FACES[f];
          const v = face.v.map(([vx,vy,vz]) =>
            [(x+vx)*VOXEL_MM, (y+vy)*VOXEL_MM, (z+vz)*VOXEL_MM]);
          tris.push({ n:face.n, v:[v[0],v[1],v[2]] });
          tris.push({ n:face.n, v:[v[0],v[2],v[3]] });
        }
      }
  return tris;
}

export { VOXEL_MM };
