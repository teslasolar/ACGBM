// R3/index.js — Ring 3 Self-Enclosure
// 7 generators (prime fold). Imports R0, R1, R2.
// Composites: stats, name, body, features, barcode3d, stl, card.

export { generateStats } from './gen-stats.js';
export { genName, genCardId } from './gen-name.js';
export { genBody } from './gen-body.js';
export { stampFeatures } from './gen-features.js';
export { encodeDepth, applyDepth, readBarcode } from './gen-barcode3d.js';
export { toBinarySTL, modelStats } from './gen-stl.js';
export { generateCard, generateAllCards } from './gen-card.js';
