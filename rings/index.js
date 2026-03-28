// rings/index.js — Master Ring Manifest
// Self-enclosing concentric ring architecture
// Prime folds: R0(7) → R1(5) → R2(3) → R3(7) → R5(5) → R7(pages)
//
// RING DEPENDENCY (inward only):
//   R7 → R5 → R3 → R2 → R1 → R0
//   Outer rings import from inner rings. Never reverse.
//   Each ring self-encloses via its index.js.
//
// PRIME FOLD COUNTS:
//   R0: 7 files (UDTs — element, archetype, rarity, ability, face, stat, overlay-def)
//   R1: 5 files (Templates — seed, voxel, mesh, barcode-enc, color)
//   R2: 3 files (TAGs — members, cards, overlays)
//   R3: 7 files (Generators — stats, name, body, features, barcode3d, stl, card)
//   R5: 5 files (Renderers — voxel, aura, fx, contour, card-svg)
//   Total: 27 modules + 6 ring indexes = 33 files
//   33 = 3 × 11 (product of primes)
//
// THE RING IS THE MODULE.
// THE MODULE IS THE RING.
// EACH FILE < 250 TOKENS.
// THE DATA DESIGNS THE MONSTER.

export * from './R0/index.js';
export * from './R1/index.js';
export * from './R2/index.js';
export * from './R3/index.js';
export * from './R5/index.js';
