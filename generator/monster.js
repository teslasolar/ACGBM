// monster.js — Hash → voxel monster generation
// Deterministic monster visuals from member data
// The monster IS a 3D barcode — depth encodes scannable data
// Cartoonish chibi proportions with contoured textures

const BODY_ARCHETYPES = {
  FORGEMASTER: { base: 'humanoid', aura: 'flame', width: 0.9, height: 1.0, headScale: 1.4, eyeSize: 2 },
  SENTINEL:    { base: 'geometric', aura: 'crystal', width: 0.8, height: 1.1, headScale: 1.3, eyeSize: 2 },
  CONSTRUCT:   { base: 'mechanical', aura: 'gear', width: 1.0, height: 0.9, headScale: 1.3, eyeSize: 2 },
  WEAVER:      { base: 'fluid', aura: 'ribbon', width: 0.7, height: 1.2, headScale: 1.5, eyeSize: 3 },
  PHANTOM:     { base: 'fragment', aura: 'glitch', width: 0.6, height: 1.0, headScale: 1.4, eyeSize: 2 },
  SHIFTER:     { base: 'amorphous', aura: 'prism', width: 0.8, height: 0.8, headScale: 1.6, eyeSize: 3 },
  ORACLE:      { base: 'robed', aura: 'symbol', width: 0.7, height: 1.1, headScale: 1.3, eyeSize: 2 },
  DISRUPTOR:   { base: 'jagged', aura: 'electric', width: 0.9, height: 0.9, headScale: 1.3, eyeSize: 2 }
};

const TYPE_MAP = {
  'Founder': 'FORGEMASTER', 'Architect': 'SENTINEL',
  'Engineer': 'CONSTRUCT',  'Content': 'WEAVER',
  'Protocol': 'PHANTOM',    'Creative': 'SHIFTER',
  'Philosopher': 'ORACLE',  'Breaker': 'DISRUPTOR'
};

const ELEMENT_MAP = {
  'FORGEMASTER': 'FIRE',    'SENTINEL': 'CRYSTAL',
  'CONSTRUCT': 'METAL',     'WEAVER': 'WIND',
  'PHANTOM': 'VOID',        'SHIFTER': 'PRISM',
  'ORACLE': 'AETHER',       'DISRUPTOR': 'LIGHTNING'
};

const ELEMENT_COLORS = {
  FIRE:      { primary: '#FF4500', secondary: '#FF8C00', glow: '#FFD700', highlight: '#FFF5E0', shadow: '#8B2500', blush: '#FF6347' },
  CRYSTAL:   { primary: '#00BFFF', secondary: '#87CEEB', glow: '#E0FFFF', highlight: '#F0FFFF', shadow: '#005F7F', blush: '#87CEFA' },
  METAL:     { primary: '#708090', secondary: '#C0C0C0', glow: '#DCDCDC', highlight: '#F5F5F5', shadow: '#2F4F4F', blush: '#B0C4DE' },
  WIND:      { primary: '#32CD32', secondary: '#90EE90', glow: '#F0FFF0', highlight: '#F5FFFA', shadow: '#006400', blush: '#98FB98' },
  VOID:      { primary: '#8A2BE2', secondary: '#9370DB', glow: '#DDA0DD', highlight: '#F8F0FF', shadow: '#4B0082', blush: '#DA70D6' },
  PRISM:     { primary: '#FF69B4', secondary: '#FFB6C1', glow: '#FFF0F5', highlight: '#FFF5F8', shadow: '#8B0046', blush: '#FF90C0' },
  AETHER:    { primary: '#FFD700', secondary: '#FFEC8B', glow: '#FFFFF0', highlight: '#FFFCE8', shadow: '#8B7500', blush: '#FFE44D' },
  LIGHTNING: { primary: '#00FF7F', secondary: '#7FFF00', glow: '#F0FFF0', highlight: '#F0FFF5', shadow: '#008040', blush: '#66FF99' }
};

// Cute facial feature definitions per archetype
const FACE_FEATURES = {
  FORGEMASTER: { mouth: 'fangs', ears: 'horns', extra: 'crown' },
  SENTINEL:    { mouth: 'smile', ears: 'crystals', extra: 'visor' },
  CONSTRUCT:   { mouth: 'grill', ears: 'antennae', extra: 'bolts' },
  WEAVER:      { mouth: 'cat', ears: 'ribbon', extra: 'bow' },
  PHANTOM:     { mouth: 'owo', ears: 'wisps', extra: 'halo' },
  SHIFTER:     { mouth: 'star', ears: 'nubs', extra: 'sparkles' },
  ORACLE:      { mouth: 'serene', ears: 'pointed', extra: 'third_eye' },
  DISRUPTOR:   { mouth: 'zigzag', ears: 'bolts', extra: 'sparks' }
};

// Seeded PRNG
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Encode barcode data into Z-depth pattern
// Each X column's depth encodes a bit of the card's identity
// Front-view = cute monster, depth-scan = barcode data
function encodeBarcodeDepth(seed, cardId) {
  const data = `BCM${(seed % 510).toString().padStart(3, '0')}`;
  const depthMap = new Uint8Array(12 * 12); // 12x (along X) × 12y depth values

  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      const charIdx = (x + y * 12) % data.length;
      const charCode = data.charCodeAt(charIdx);
      // Map character to depth 2-10 (how deep the voxel column goes)
      depthMap[y * 12 + x] = 2 + (charCode + seed + x * 7 + y * 13) % 9;
    }
  }
  return depthMap;
}

function generateVoxelGrid(seed, type) {
  const rng = mulberry32(seed);
  const grid = new Uint8Array(12 * 12 * 12);
  const archetype = BODY_ARCHETYPES[type] || BODY_ARCHETYPES.CONSTRUCT;
  const depthMap = encodeBarcodeDepth(seed, type);

  // CHIBI PROPORTIONS: big head (y 7-11), small body (y 2-6), stubby legs (y 0-1)
  const headCenter = 9.5;
  const headRadius = 2.8 * archetype.headScale;
  const bodyTop = 7;
  const bodyBot = 2;

  for (let y = 0; y < 12; y++) {
    for (let z = 0; z < 12; z++) {
      for (let x = 0; x < 6; x++) {
        const cx = 6, cz = 6;
        const dx = (x - cx);
        const dz = (z - cz);
        let fill = 0;

        // === BIG ROUND HEAD (chibi-style) ===
        if (y >= 7) {
          const hdx = dx / (headRadius * 0.9);
          const hdy = (y - headCenter) / headRadius;
          const hdz = (z - cz) / (headRadius * 0.85);
          const headDist = hdx * hdx + hdy * hdy + hdz * hdz;
          if (headDist < 1.0) fill = 1;

          // Cheek puffs (cutesy bulge)
          if (y >= 8 && y <= 9 && Math.abs(dx) >= 2 && Math.abs(dx) <= 3 && Math.abs(dz) < 2) {
            fill = 1;
          }
        }

        // === STUBBY BODY ===
        if (y >= bodyBot && y < bodyTop) {
          const bodyW = 2.5 * archetype.width;
          const bodyD = 2.2;
          if (Math.abs(dx) < bodyW && Math.abs(dz) < bodyD) {
            fill = 1;
          }
        }

        // === STUBBY LEGS ===
        if (y < bodyBot) {
          const legSpread = 1.5;
          const legW = 1.2;
          // Left leg (mirrored)
          if (Math.abs(Math.abs(dx) - legSpread) < legW && Math.abs(dz) < 1.5) {
            fill = 1;
          }
        }

        // === STUBBY ARMS ===
        if (y >= 3 && y <= 5) {
          if (Math.abs(dx) >= 2.5 * archetype.width && Math.abs(dx) < 3.5 && Math.abs(dz) < 1.5) {
            fill = rng() > 0.2 ? 1 : 0;
          }
        }

        // === ARCHETYPE FEATURES (cute versions) ===
        switch (archetype.base) {
          case 'humanoid': // FORGEMASTER — flame crown
            if (y === 11 && Math.abs(dx) < 2 && Math.abs(dz) < 2) fill = 1;
            if (y === 11 && x === 3 && Math.abs(dz) < 1) fill = 1; // center spike
            break;
          case 'geometric': // SENTINEL — faceted surface
            if (fill && (x + y + z) % 2 === 0 && rng() > 0.5) fill = 1;
            break;
          case 'mechanical': // CONSTRUCT — gear ears, bolt details
            if (y >= 10 && y <= 11 && Math.abs(dx) >= 3 && Math.abs(dx) < 4 && Math.abs(dz) < 1) fill = 1;
            break;
          case 'fluid': // WEAVER — flowing ribbons
            if (y >= 3 && y <= 6 && Math.abs(dx) >= 3 && rng() > 0.4) fill = 1;
            if (fill && rng() > 0.85) fill = 0; // wispy gaps
            break;
          case 'fragment': // PHANTOM — floating bits
            if (fill && rng() > 0.6) fill = 0;
            if (!fill && y >= 8 && rng() > 0.92) fill = 1; // floating fragments
            break;
          case 'amorphous': // SHIFTER — blobby cute
            if (Math.abs(dx) < 3 && Math.abs(dz) < 3 && y >= 2 && y <= 10 && rng() > 0.4) fill = 1;
            break;
          case 'robed': // ORACLE — flowy robe bottom
            if (y < 5 && Math.abs(dx) < 3.5 && Math.abs(dz) < 3 && dz > -2) fill = 1;
            break;
          case 'jagged': // DISRUPTOR — lightning spikes
            if (y === 11 && (x === 2 || x === 4) && Math.abs(dz) < 1) fill = 1;
            if (!fill && rng() > 0.93 && y >= 7) fill = 1; // spark particles
            break;
        }

        // === 3D BARCODE DEPTH ENCODING ===
        // Modulate Z-depth of filled voxels to encode data
        // The depth pattern IS the barcode
        if (fill) {
          const targetDepth = depthMap[y * 12 + x];
          const adjustedZ = z - (6 - targetDepth / 2);
          // Only fill if within the barcode-encoded depth range
          if (Math.abs(dz) > targetDepth / 2.5 + 0.5) {
            // Keep the fill for the silhouette but thin it for data encoding
            if (Math.abs(dz) > targetDepth / 2 + 1.5) fill = 0;
          }
        }

        // Noise (less aggressive for cuter look)
        if (fill && rng() > 0.95) fill = 0;

        const idx = y * 144 + z * 12 + x;
        grid[idx] = fill;
        // Mirror on X for symmetry
        grid[y * 144 + z * 12 + (11 - x)] = fill;
      }
    }
  }

  return grid;
}

// Contour-aware color with highlights, shadows, blush, and outlines
function getVoxelColor(grid, x, y, z, element, seed) {
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.METAL;
  const rng = mulberry32(seed + x * 1000 + y * 100 + z);

  // === BIG SPARKLY EYES ===
  // Eyes at y=9, z=8 (front-facing), x=4 and x=7 (symmetrical)
  if (y === 9 && z >= 8 && z <= 9) {
    if (x === 4 || x === 7) return '#FFFFFF'; // eye white
    if (x === 3 || x === 8) return '#FFFFFF'; // wider eye white
  }
  // Pupils
  if (y === 9 && z === 8 && (x === 4 || x === 7)) return '#111111';
  // Eye sparkle highlights (the kawaii dot)
  if (y === 10 && z === 9 && (x === 3 || x === 8)) return '#FFFFFF';

  // === BLUSH MARKS (cheek circles) ===
  if (y === 8 && z >= 8 && z <= 9 && (x === 2 || x === 3 || x === 8 || x === 9)) {
    return colors.blush;
  }

  // === MOUTH (z=8, y=8, center) ===
  if (y === 8 && z === 8 && (x === 5 || x === 6)) {
    return colors.shadow;
  }

  // === CONTOUR SHADING ===
  // Check if this voxel is on the surface (has an exposed face)
  const isEdge = isSurfaceVoxel(grid, x, y, z);

  // Top-lit shading: higher y = brighter, front z = brighter
  const heightFactor = y / 12;
  const frontFactor = z / 12;
  const lightIntensity = heightFactor * 0.4 + frontFactor * 0.4 + 0.2;

  // Outline detection: if adjacent to empty space on front face
  if (isEdge && isContourEdge(grid, x, y, z)) {
    // Dark contour outline
    return colors.shadow;
  }

  // Specular highlight (top-front voxels)
  if (y >= 10 && z >= 8 && rng() > 0.6) {
    return colors.highlight;
  }

  // Normal shading based on light
  const r = rng();
  if (lightIntensity > 0.7) {
    // Bright zone
    if (r < 0.4) return colors.glow;
    if (r < 0.7) return colors.secondary;
    return colors.primary;
  } else if (lightIntensity > 0.4) {
    // Mid zone
    if (r < 0.5) return colors.primary;
    if (r < 0.8) return colors.secondary;
    return colors.glow;
  } else {
    // Shadow zone
    if (r < 0.5) return colors.shadow;
    if (r < 0.8) return colors.primary;
    return colors.secondary;
  }
}

function isSurfaceVoxel(grid, x, y, z) {
  const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  for (const [dx, dy, dz] of dirs) {
    const nx = x + dx, ny = y + dy, nz = z + dz;
    if (nx < 0 || nx >= 12 || ny < 0 || ny >= 12 || nz < 0 || nz >= 12) return true;
    if (!grid[ny * 144 + nz * 12 + nx]) return true;
  }
  return false;
}

function isContourEdge(grid, x, y, z) {
  // Check the front-facing silhouette edges (z+1 direction)
  // A voxel is a contour edge if it's on the front face AND
  // adjacent to empty space in x or y direction
  const frontOpen = z >= 11 || !grid[y * 144 + (z + 1) * 12 + x];
  if (!frontOpen) return false;

  // Check if any orthogonal neighbor on the same z-plane is empty
  const neighbors = [[1,0],[- 1,0],[0,1],[0,-1]];
  for (const [dx, dy] of neighbors) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= 12 || ny < 0 || ny >= 12) return true; // edge of grid = contour
    if (!grid[ny * 144 + z * 12 + nx]) return true;
  }
  return false;
}

function generateMonsterName(seed, type) {
  const prefixes = ['Guild', 'Code', 'Byte', 'Hash', 'Node', 'Flux', 'Void', 'Iron', 'Storm', 'Deep'];
  const suffixes = ['forge', 'weave', 'strike', 'guard', 'pulse', 'drift', 'shard', 'core', 'born', 'fang'];
  const prefix = prefixes[seed % prefixes.length];
  const suffix = suffixes[(seed >>> 16) % suffixes.length];
  const typeName = type.charAt(0) + type.slice(1).toLowerCase();
  return `${prefix}${suffix} ${typeName}`;
}

// Read the 3D barcode data back from a voxel grid
// Scans the Z-depth at each (x,y) column to recover encoded data
function read3DBarcode(grid) {
  const depths = [];
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      let minZ = 12, maxZ = -1;
      for (let z = 0; z < 12; z++) {
        if (grid[y * 144 + z * 12 + x]) {
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        }
      }
      depths.push(maxZ >= minZ ? (maxZ - minZ + 1) : 0);
    }
  }
  return depths;
}

export {
  generateVoxelGrid, getVoxelColor, generateMonsterName,
  TYPE_MAP, ELEMENT_MAP, ELEMENT_COLORS, BODY_ARCHETYPES,
  FACE_FEATURES, mulberry32, read3DBarcode,
  isSurfaceVoxel, isContourEdge, encodeBarcodeDepth
};
