// supports.js — Auto support generation for voxel models
// Detects overhangs and generates support structures

import { GRID_SIZE } from '../generator/stl.js';

function detectOverhangs(grid, maxAngle = 45) {
  const overhangs = [];

  for (let y = 1; y < GRID_SIZE; y++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const idx = y * GRID_SIZE * GRID_SIZE + z * GRID_SIZE + x;
        if (!grid[idx]) continue;

        // Check if voxel below is empty
        const belowIdx = (y - 1) * GRID_SIZE * GRID_SIZE + z * GRID_SIZE + x;
        if (grid[belowIdx]) continue;

        // Check diagonal supports
        let hasSupport = false;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dz = -1; dz <= 1; dz++) {
            if (dx === 0 && dz === 0) continue;
            const nx = x + dx;
            const nz = z + dz;
            if (nx < 0 || nx >= GRID_SIZE || nz < 0 || nz >= GRID_SIZE) continue;
            const neighborBelow = (y - 1) * GRID_SIZE * GRID_SIZE + nz * GRID_SIZE + nx;
            if (grid[neighborBelow]) {
              hasSupport = true;
              break;
            }
          }
          if (hasSupport) break;
        }

        if (!hasSupport) {
          overhangs.push({ x, y, z });
        }
      }
    }
  }

  return overhangs;
}

function generateSupports(grid, overhangs) {
  const supportGrid = new Uint8Array(GRID_SIZE * GRID_SIZE * GRID_SIZE);

  for (const { x, y, z } of overhangs) {
    // Generate support column from overhang down to ground
    for (let sy = y - 1; sy >= 0; sy--) {
      const idx = sy * GRID_SIZE * GRID_SIZE + z * GRID_SIZE + x;
      if (grid[idx]) break; // Hit existing geometry
      supportGrid[idx] = 1;
    }
  }

  return supportGrid;
}

function analyzeModel(grid) {
  const overhangs = detectOverhangs(grid);
  const supportGrid = generateSupports(grid, overhangs);

  let supportVoxels = 0;
  for (let i = 0; i < supportGrid.length; i++) {
    if (supportGrid[i]) supportVoxels++;
  }

  let modelVoxels = 0;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) modelVoxels++;
  }

  return {
    overhangCount: overhangs.length,
    supportVoxels,
    modelVoxels,
    supportRatio: modelVoxels > 0 ? (supportVoxels / modelVoxels * 100).toFixed(1) + '%' : '0%',
    supportGrid,
    printable: true,
    notes: overhangs.length === 0
      ? 'No supports needed — model is self-supporting'
      : `${overhangs.length} overhangs detected, ${supportVoxels} support voxels generated`
  };
}

export { detectOverhangs, generateSupports, analyzeModel };
