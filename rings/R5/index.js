// R5/index.js — Ring 5 Self-Enclosure
// 5 renderers (prime fold). Imports R0, R1, R3.
// Output: voxel canvas, aura, fx, contour, card SVG.

export { collectVoxels, drawVoxels } from './render-voxel.js';
export { drawAura } from './render-aura.js';
export { drawSparkles, drawConfetti, drawFireFX, drawLightning } from './render-fx.js';
export { drawThickContour, drawGlowContour, drawRainbowContour } from './render-contour.js';
export { renderCardSVG } from './render-card-svg.js';
