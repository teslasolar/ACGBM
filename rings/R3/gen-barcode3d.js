// R3/gen-barcode3d.js — 3D Barcode Depth Encoder
// Ring 3: encodes card data into voxel Z-depth.

import { GRID, get, set } from '../R1/voxel.js';

export function encodeDepth(seed) {
  const data = `BCM${(seed % 510).toString().padStart(3, '0')}`;
  const map = new Uint8Array(GRID * GRID);
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      const ci = (x + y * GRID) % data.length;
      map[y * GRID + x] = 2 + (data.charCodeAt(ci) + seed + x*7 + y*13) % 9;
    }
  return map;
}

export function applyDepth(grid, depthMap) {
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      const td = depthMap[y * GRID + x];
      for (let z = 0; z < GRID; z++) {
        if (!get(grid, x, y, z)) continue;
        const dz = Math.abs(z - 6);
        if (dz > td / 2 + 1.5) set(grid, x, y, z, 0);
      }
    }
  return grid;
}

export function readBarcode(grid) {
  const depths = [];
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      let mn = GRID, mx = -1;
      for (let z = 0; z < GRID; z++) {
        if (get(grid, x, y, z)) { if (z < mn) mn = z; if (z > mx) mx = z; }
      }
      depths.push(mx >= mn ? mx - mn + 1 : 0);
    }
  return depths;
}
