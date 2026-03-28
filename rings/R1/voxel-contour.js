// R1/voxel-contour.js — Surface & Contour Detection
// Ring 1: imports grid basics from voxel.

import { get, GRID } from './voxel.js';

export function isSurface(grid,x,y,z) {
  const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  for(const[dx,dy,dz] of dirs)
    if(!get(grid,x+dx,y+dy,z+dz)) return true;
  return false;
}

export function isContour(grid,x,y,z) {
  if(z<GRID-1 && get(grid,x,y,z+1)) return false;
  const nb=[[1,0],[-1,0],[0,1],[0,-1]];
  for(const[dx,dy] of nb)
    if(!get(grid,x+dx,y+dy,z)) return true;
  return false;
}
