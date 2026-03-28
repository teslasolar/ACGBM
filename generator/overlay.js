// overlay.js — Animation mask overlay/underlay system
// Layers cartoonish effects on top of 3D barcode monsters
// The 3D model stays scannable — overlays are render-only

// Overlay types that can be composited over the voxel model
const OVERLAY_TYPES = {
  // Aura effects (underlay — rendered behind the model)
  aura_flame:    { layer: 'under', animate: true, frames: 8, speed: 120 },
  aura_crystal:  { layer: 'under', animate: true, frames: 6, speed: 200 },
  aura_electric: { layer: 'under', animate: true, frames: 4, speed: 80 },
  aura_void:     { layer: 'under', animate: true, frames: 6, speed: 150 },
  aura_wind:     { layer: 'under', animate: true, frames: 8, speed: 100 },
  aura_prism:    { layer: 'under', animate: true, frames: 12, speed: 90 },

  // Expression overlays (over — rendered on top, face region)
  face_happy:    { layer: 'over', animate: false, region: 'face' },
  face_angry:    { layer: 'over', animate: false, region: 'face' },
  face_sparkle:  { layer: 'over', animate: true, frames: 4, speed: 200, region: 'face' },
  face_hearts:   { layer: 'over', animate: true, frames: 6, speed: 150, region: 'face' },
  face_sweat:    { layer: 'over', animate: true, frames: 3, speed: 300, region: 'face' },

  // Effect overlays (over — full model)
  fx_sparkles:   { layer: 'over', animate: true, frames: 8, speed: 100 },
  fx_fire:       { layer: 'over', animate: true, frames: 6, speed: 80 },
  fx_bubbles:    { layer: 'over', animate: true, frames: 10, speed: 120 },
  fx_confetti:   { layer: 'over', animate: true, frames: 12, speed: 90 },
  fx_lightning:  { layer: 'over', animate: true, frames: 4, speed: 60 },
  fx_music:      { layer: 'over', animate: true, frames: 8, speed: 150 },

  // Contour overlays (over — outlines and edges)
  contour_thick: { layer: 'over', animate: false, width: 3 },
  contour_glow:  { layer: 'over', animate: true, frames: 4, speed: 200 },
  contour_rainbow: { layer: 'over', animate: true, frames: 12, speed: 100 },
};

// Get the default overlay set for an element type
function getElementOverlays(element) {
  const defaults = {
    FIRE:      ['aura_flame', 'fx_fire', 'contour_glow'],
    CRYSTAL:   ['aura_crystal', 'fx_sparkles', 'contour_glow'],
    METAL:     ['contour_thick', 'fx_sparkles'],
    WIND:      ['aura_wind', 'fx_bubbles', 'contour_glow'],
    VOID:      ['aura_void', 'fx_sparkles', 'contour_glow'],
    PRISM:     ['aura_prism', 'fx_confetti', 'contour_rainbow'],
    AETHER:    ['fx_sparkles', 'fx_music', 'contour_glow'],
    LIGHTNING: ['aura_electric', 'fx_lightning', 'contour_glow']
  };
  return defaults[element] || ['contour_thick'];
}

// Render an underlay aura effect on canvas
function renderAuraUnderlay(ctx, card, frame, size) {
  const colors = card.element === 'FIRE' ? ['#FF4500', '#FF8C00', '#FFD700'] :
                 card.element === 'CRYSTAL' ? ['#00BFFF', '#87CEEB', '#E0FFFF'] :
                 card.element === 'LIGHTNING' ? ['#00FF7F', '#7FFF00', '#FFFF00'] :
                 card.element === 'VOID' ? ['#8A2BE2', '#9370DB', '#DDA0DD'] :
                 card.element === 'WIND' ? ['#32CD32', '#90EE90', '#F0FFF0'] :
                 card.element === 'PRISM' ? ['#FF69B4', '#FFB6C1', '#FFF0F5'] :
                 ['#708090', '#C0C0C0', '#DCDCDC'];

  const cx = size / 2;
  const cy = size / 2;
  const time = frame * 0.3;

  ctx.save();
  ctx.globalAlpha = 0.3;

  // Pulsing aura rings
  for (let ring = 0; ring < 3; ring++) {
    const radius = 80 + ring * 20 + Math.sin(time + ring) * 10;
    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, colors[ring % colors.length]);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Render expression overlay on the face region
function renderFaceOverlay(ctx, card, overlayType, frame, size) {
  const cx = size / 2;
  const eyeY = size * 0.33;

  ctx.save();

  if (overlayType === 'face_sparkle' || overlayType === 'face_hearts') {
    // Floating particles around the face
    const count = overlayType === 'face_hearts' ? 5 : 8;
    const symbol = overlayType === 'face_hearts' ? '♥' : '✦';
    ctx.font = `${10 + (frame % 3) * 2}px monospace`;
    ctx.globalAlpha = 0.7 + Math.sin(frame * 0.5) * 0.3;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + frame * 0.2;
      const radius = 40 + Math.sin(frame * 0.3 + i) * 15;
      const px = cx + Math.cos(angle) * radius;
      const py = eyeY + Math.sin(angle) * radius * 0.6 - frame * 2;
      ctx.fillStyle = overlayType === 'face_hearts' ? '#FF69B4' : '#FFD700';
      ctx.fillText(symbol, px, py);
    }
  }

  if (overlayType === 'face_sweat') {
    // Sweat drop
    const dropY = eyeY - 10 + (frame % 3) * 8;
    ctx.fillStyle = '#87CEEB';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.ellipse(cx + 35, dropY, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Render effect particles overlay
function renderEffectOverlay(ctx, card, overlayType, frame, size, seed) {
  ctx.save();

  if (overlayType === 'fx_sparkles') {
    ctx.globalAlpha = 0.8;
    const sparkleCount = 12;
    for (let i = 0; i < sparkleCount; i++) {
      const phase = (seed + i * 137) % 1000 / 1000;
      const x = phase * size;
      const y = ((phase * 7 + frame * 3) % size);
      const sparkSize = 2 + Math.sin(frame * 0.5 + i) * 2;
      ctx.fillStyle = '#FFD700';
      // 4-pointed star
      drawStar(ctx, x, y, sparkSize);
    }
  }

  if (overlayType === 'fx_confetti') {
    ctx.globalAlpha = 0.6;
    const confettiColors = ['#FF4500', '#00BFFF', '#FFD700', '#FF69B4', '#32CD32', '#8A2BE2'];
    for (let i = 0; i < 20; i++) {
      const phase = (seed + i * 97) % 1000 / 1000;
      const x = phase * size;
      const y = ((phase * 5 + frame * 4) % (size + 20)) - 10;
      const rot = frame * 0.1 + i;
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillRect(-3, -1, 6, 2);
      ctx.restore();
    }
  }

  if (overlayType === 'fx_fire') {
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 8; i++) {
      const phase = (seed + i * 73) % 1000 / 1000;
      const x = size * 0.3 + phase * size * 0.4;
      const y = size * 0.8 - (frame * 5 + i * 10) % (size * 0.5);
      const flameSize = 4 + Math.sin(frame * 0.3 + i) * 3;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, flameSize);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.5, '#FF8C00');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, flameSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (overlayType === 'fx_lightning') {
    if (frame % 2 === 0) {
      ctx.strokeStyle = '#00FF7F';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      // Jagged lightning bolt
      const startX = size * 0.3 + (seed % 100) / 100 * size * 0.4;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      let bx = startX, by = 0;
      while (by < size) {
        bx += (Math.random() - 0.5) * 30;
        by += 15 + Math.random() * 20;
        ctx.lineTo(bx, by);
      }
      ctx.stroke();
    }
  }

  ctx.restore();
}

// Render contour outlines over the voxel rendering
function renderContourOverlay(ctx, card, overlayType, frame, voxels, size) {
  ctx.save();

  if (overlayType === 'contour_thick') {
    // Dark outlines around each voxel cluster
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    for (const v of voxels) {
      ctx.strokeRect(v.screenX - v.size / 2 - 1, v.screenY - v.size / 2 - 1, v.size + 2, v.size + 2);
    }
  }

  if (overlayType === 'contour_glow') {
    // Glowing edges
    const glowColor = card.rarityColor || '#FF4500';
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 4 + Math.sin(frame * 0.3) * 3;
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4 + Math.sin(frame * 0.2) * 0.2;
    for (const v of voxels) {
      if (v.isEdge) {
        ctx.strokeRect(v.screenX - v.size / 2, v.screenY - v.size / 2, v.size, v.size);
      }
    }
  }

  if (overlayType === 'contour_rainbow') {
    const hue = (frame * 15) % 360;
    ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    for (const v of voxels) {
      if (v.isEdge) {
        ctx.strokeRect(v.screenX - v.size / 2, v.screenY - v.size / 2, v.size, v.size);
      }
    }
  }

  ctx.restore();
}

function drawStar(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const ox = Math.cos(angle) * r;
    const oy = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x + ox, y + oy);
    else ctx.lineTo(x + ox, y + oy);
    // Inner point
    const innerAngle = angle + Math.PI / 4;
    ctx.lineTo(x + Math.cos(innerAngle) * r * 0.3, y + Math.sin(innerAngle) * r * 0.3);
  }
  ctx.closePath();
  ctx.fill();
}

// Complete overlay render pipeline
// Call this after drawing the base voxel model
function renderOverlays(ctx, card, activeOverlays, frame, size, voxelData) {
  // Sort: underlays first, then overlays
  const underlays = activeOverlays.filter(o => OVERLAY_TYPES[o]?.layer === 'under');
  const overlays = activeOverlays.filter(o => OVERLAY_TYPES[o]?.layer === 'over');

  // Render underlays (behind model — caller should draw these before the model)
  // This function handles overlays (on top)
  for (const overlay of overlays) {
    const def = OVERLAY_TYPES[overlay];
    if (!def) continue;

    if (def.region === 'face') {
      renderFaceOverlay(ctx, card, overlay, frame, size);
    } else if (overlay.startsWith('contour_')) {
      renderContourOverlay(ctx, card, overlay, frame, voxelData || [], size);
    } else if (overlay.startsWith('fx_')) {
      renderEffectOverlay(ctx, card, overlay, frame, size, card.seed);
    }
  }
}

export {
  OVERLAY_TYPES, getElementOverlays,
  renderAuraUnderlay, renderFaceOverlay,
  renderEffectOverlay, renderContourOverlay,
  renderOverlays
};
