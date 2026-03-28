// R5/render-voxel.js — Voxel Canvas Renderer
// Ring 5: 3D voxel projection with contour outlines.

import { isSurface, isContour, GRID } from '../R1/voxel.js';
import { voxelColor } from '../R1/color.js';

export function collectVoxels(grid, element, seed, rotY, rotX, sz) {
  const out = [], sc = 15;
  for (let y=0;y<GRID;y++) for (let z=0;z<GRID;z++) for (let x=0;x<GRID;x++) {
    if (!grid[y*144+z*12+x]) continue;
    const cx=x-5.5, cy=y-5.5, cz=z-5.5;
    const rx=cx*Math.cos(rotY)-cz*Math.sin(rotY), rz=cx*Math.sin(rotY)+cz*Math.cos(rotY);
    const ry=cy*Math.cos(rotX)-rz*Math.sin(rotX), rz2=cy*Math.sin(rotX)+rz*Math.cos(rotX);
    out.push({
      screenX:sz/2+rx*sc, screenY:sz/2-ry*sc+rz2*2, depth:rz2, size:14,
      color:voxelColor(grid,x,y,z,element,seed),
      isEdge:isContour(grid,x,y,z), isSurface:isSurface(grid,x,y,z), x,y,z
    });
  }
  return out.sort((a,b)=>a.depth-b.depth);
}

export function drawVoxels(ctx, voxels) {
  for (const v of voxels) {
    const vx=v.screenX-v.size/2, vy=v.screenY-v.size/2;
    ctx.fillStyle=v.color;
    ctx.beginPath(); rr(ctx,vx,vy,v.size,v.size,2); ctx.fill();
    ctx.strokeStyle=v.isEdge?'rgba(0,0,0,0.6)':'rgba(0,0,0,0.15)';
    ctx.lineWidth=v.isEdge?2:0.5;
    ctx.beginPath(); rr(ctx,vx,vy,v.size,v.size,2); ctx.stroke();
    if(v.isSurface&&v.y>=8&&v.depth>0){
      ctx.fillStyle='rgba(255,255,255,0.25)';
      ctx.fillRect(vx+1,vy+1,v.size*0.3,v.size*0.3);
    }
  }
}

function rr(c,x,y,w,h,r){
  c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);
}
