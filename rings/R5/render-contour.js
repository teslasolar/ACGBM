// R5/render-contour.js — Contour Outline Renderer
// Ring 5: thick/glow/rainbow outlines over voxels.

export function drawThickContour(ctx, voxels) {
  ctx.save();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
  for (const v of voxels)
    ctx.strokeRect(v.screenX-v.size/2-1, v.screenY-v.size/2-1, v.size+2, v.size+2);
  ctx.restore();
}

export function drawGlowContour(ctx, voxels, color, frame) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 4 + Math.sin(frame*0.3)*3;
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4 + Math.sin(frame*0.2)*0.2;
  for (const v of voxels) {
    if (!v.isEdge) continue;
    ctx.strokeRect(v.screenX-v.size/2, v.screenY-v.size/2, v.size, v.size);
  }
  ctx.restore();
}

export function drawRainbowContour(ctx, voxels, frame) {
  const hue = (frame * 15) % 360;
  ctx.save();
  ctx.strokeStyle = `hsl(${hue},80%,60%)`;
  ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
  for (const v of voxels) {
    if (!v.isEdge) continue;
    ctx.strokeRect(v.screenX-v.size/2, v.screenY-v.size/2, v.size, v.size);
  }
  ctx.restore();
}
