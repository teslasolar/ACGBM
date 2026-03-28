// monster.js — Hash → voxel monster generation
// Deterministic monster visuals from member data

const BODY_ARCHETYPES = {
  FORGEMASTER: { base: 'humanoid', aura: 'flame', width: 0.9, height: 1.0 },
  SENTINEL:    { base: 'geometric', aura: 'crystal', width: 0.8, height: 1.1 },
  CONSTRUCT:   { base: 'mechanical', aura: 'gear', width: 1.0, height: 0.9 },
  WEAVER:      { base: 'fluid', aura: 'ribbon', width: 0.7, height: 1.2 },
  PHANTOM:     { base: 'fragment', aura: 'glitch', width: 0.6, height: 1.0 },
  SHIFTER:     { base: 'amorphous', aura: 'prism', width: 0.8, height: 0.8 },
  ORACLE:      { base: 'robed', aura: 'symbol', width: 0.7, height: 1.1 },
  DISRUPTOR:   { base: 'jagged', aura: 'electric', width: 0.9, height: 0.9 }
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
  FIRE:      { primary: '#FF4500', secondary: '#FF8C00', glow: '#FFD700' },
  CRYSTAL:   { primary: '#00BFFF', secondary: '#87CEEB', glow: '#E0FFFF' },
  METAL:     { primary: '#708090', secondary: '#C0C0C0', glow: '#DCDCDC' },
  WIND:      { primary: '#32CD32', secondary: '#90EE90', glow: '#F0FFF0' },
  VOID:      { primary: '#8A2BE2', secondary: '#9370DB', glow: '#DDA0DD' },
  PRISM:     { primary: '#FF69B4', secondary: '#FFB6C1', glow: '#FFF0F5' },
  AETHER:    { primary: '#FFD700', secondary: '#FFEC8B', glow: '#FFFFF0' },
  LIGHTNING: { primary: '#00FF7F', secondary: '#7FFF00', glow: '#F0FFF0' }
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

function generateVoxelGrid(seed, type) {
  const rng = mulberry32(seed);
  const grid = new Uint8Array(12 * 12 * 12);
  const archetype = BODY_ARCHETYPES[type] || BODY_ARCHETYPES.CONSTRUCT;

  // Generate half-body (mirror for symmetry on X axis)
  for (let y = 0; y < 12; y++) {
    for (let z = 0; z < 12; z++) {
      for (let x = 0; x < 6; x++) {
        const cx = 6, cy = 6, cz = 6;
        const dx = (x - cx) / 6;
        const dy = (y - cy) / 6;
        const dz = (z - cz) / 6;
        const dist = Math.sqrt(dx * dx * (1 / archetype.width) + dy * dy * (1 / archetype.height) + dz * dz);

        let fill = 0;

        // Body core
        if (dist < 0.55 && y >= 2 && y <= 9) fill = 1;
        // Head
        if (dist < 0.4 && y >= 8 && y <= 11) fill = 1;
        // Legs
        if (y < 3 && Math.abs(dx) > 0.1 && Math.abs(dx) < 0.35 && dz > -0.3 && dz < 0.3) fill = 1;
        // Arms (archetype-dependent)
        if (y >= 4 && y <= 7 && Math.abs(dx) > 0.35 && dist < 0.8) {
          fill = rng() > 0.3 ? 1 : 0;
        }

        // Archetype-specific features
        switch (archetype.base) {
          case 'humanoid':
            if (y === 11 && dist < 0.25) fill = 1; // crown
            break;
          case 'geometric':
            if (rng() > 0.6 && fill) fill = (x + y + z) % 2 === 0 ? 1 : 0;
            break;
          case 'mechanical':
            if (y >= 5 && y <= 7 && x === 0 && z >= 4 && z <= 7) fill = 1; // gear spine
            break;
          case 'fluid':
            if (fill && rng() > 0.7) fill = 0; // gaps in body
            break;
          case 'fragment':
            if (fill && rng() > 0.5) fill = 0; // very fragmented
            break;
          case 'amorphous':
            if (dist < 0.6 && rng() > 0.35) fill = 1; // blobby
            break;
          case 'robed':
            if (y < 6 && dist < 0.65 && dz > -0.2) fill = 1; // wide robe
            break;
          case 'jagged':
            if (fill && rng() > 0.4 && (x + y) % 3 === 0) fill = 1;
            if (!fill && rng() > 0.85 && dist < 0.7) fill = 1; // spikes
            break;
        }

        // Noise variation
        if (fill && rng() > 0.92) fill = 0;
        if (!fill && dist < 0.5 && rng() > 0.95) fill = 1;

        const idx = y * 144 + z * 12 + x;
        grid[idx] = fill;
        // Mirror
        grid[y * 144 + z * 12 + (11 - x)] = fill;
      }
    }
  }

  return grid;
}

function getVoxelColor(grid, x, y, z, element, seed) {
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.METAL;
  const rng = mulberry32(seed + x * 1000 + y * 100 + z);

  // Eyes (y=9 or 10, near center)
  if (y >= 9 && y <= 10 && z >= 7 && z <= 8 && (x === 4 || x === 7)) {
    return '#FFFFFF';
  }

  const r = rng();
  if (r < 0.6) return colors.primary;
  if (r < 0.85) return colors.secondary;
  return colors.glow;
}

function generateMonsterName(seed, type) {
  const prefixes = ['Guild', 'Code', 'Byte', 'Hash', 'Node', 'Flux', 'Void', 'Iron', 'Storm', 'Deep'];
  const suffixes = ['forge', 'weave', 'strike', 'guard', 'pulse', 'drift', 'shard', 'core', 'born', 'fang'];
  const prefix = prefixes[seed % prefixes.length];
  const suffix = suffixes[(seed >>> 16) % suffixes.length];
  const typeName = type.charAt(0) + type.slice(1).toLowerCase();
  return `${prefix}${suffix} ${typeName}`;
}

export {
  generateVoxelGrid, getVoxelColor, generateMonsterName,
  TYPE_MAP, ELEMENT_MAP, ELEMENT_COLORS, BODY_ARCHETYPES,
  mulberry32
};
