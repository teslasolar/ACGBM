// R3/gen-stl.js — STL File Generator
// Ring 3: composes R1/mesh → binary STL.

import { toMesh, VOXEL_MM } from '../R1/mesh.js';
import { GRID } from '../R1/voxel.js';

export function toBinarySTL(grid) {
  const tris = toMesh(grid);
  const buf = new ArrayBuffer(80 + 4 + tris.length * 50);
  const dv = new DataView(buf);
  const hdr = 'BARCODE MONSTERS STL';
  for (let i = 0; i < 80; i++) dv.setUint8(i, i < hdr.length ? hdr.charCodeAt(i) : 0);
  dv.setUint32(80, tris.length, true);
  let off = 84;
  for (const t of tris) {
    for (const c of t.n) { dv.setFloat32(off, c, true); off += 4; }
    for (const v of t.v) for (const c of v) { dv.setFloat32(off, c, true); off += 4; }
    dv.setUint16(off, 0, true); off += 2;
  }
  return buf;
}

export function modelStats(grid) {
  let filled = 0;
  for (let i = 0; i < grid.length; i++) if (grid[i]) filled++;
  const tris = toMesh(grid);
  const sz = GRID * VOXEL_MM;
  return {
    filled, tris: tris.length,
    dims: `${sz}mm\u00D7${sz}mm\u00D7${sz}mm`,
    size: `${((84 + tris.length * 50) / 1024).toFixed(1)} KB`,
    material: `~${(filled * VOXEL_MM**3 * 0.00125).toFixed(1)}g PLA`,
    time: '~15 min'
  };
}
