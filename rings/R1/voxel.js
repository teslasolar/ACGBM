// R1/voxel.js — Voxel Grid Operations Template
// Ring 1: pure grid math. No imports.

export const GRID = 12;
export const CELLS = GRID * GRID * GRID;

export function idx(x,y,z) { return y*GRID*GRID + z*GRID + x; }

export function get(grid,x,y,z) {
  if(x<0||x>=GRID||y<0||y>=GRID||z<0||z>=GRID) return 0;
  return grid[idx(x,y,z)];
}

export function set(grid,x,y,z,val) {
  if(x>=0&&x<GRID&&y>=0&&y<GRID&&z>=0&&z<GRID) grid[idx(x,y,z)]=val;
}

export function mirror(grid,x,y,z) {
  grid[idx(GRID-1-x,y,z)] = grid[idx(x,y,z)];
}

export function createGrid() { return new Uint8Array(CELLS); }

export { isSurface, isContour } from './voxel-contour.js';
