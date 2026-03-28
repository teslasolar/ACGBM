// R5/render-aura.js — Aura Underlay Renderer
// Ring 5: animated aura effects behind the model.

import { ELEMENT_COLORS } from '../R0/element.js';

const AURA_PALETTES = {
  FIRE:      ['#FF4500','#FF8C00','#FFD700'],
  CRYSTAL:   ['#00BFFF','#87CEEB','#E0FFFF'],
  LIGHTNING: ['#00FF7F','#7FFF00','#FFFF00'],
  VOID:      ['#8A2BE2','#9370DB','#DDA0DD'],
  WIND:      ['#32CD32','#90EE90','#F0FFF0'],
  PRISM:     ['#FF69B4','#FFB6C1','#FFF0F5'],
  METAL:     ['#708090','#C0C0C0','#DCDCDC'],
  AETHER:    ['#FFD700','#FFEC8B','#FFFFF0']
};

export function drawAura(ctx, element, frame, size) {
  const pal = AURA_PALETTES[element] || AURA_PALETTES.METAL;
  const cx = size/2, cy = size/2, t = frame * 0.3;
  ctx.save();
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 3; i++) {
    const r = 80 + i*20 + Math.sin(t + i) * 10;
    const g = ctx.createRadialGradient(cx, cy, r*0.3, cx, cy, r);
    g.addColorStop(0, 'transparent');
    g.addColorStop(0.5, pal[i]);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}
