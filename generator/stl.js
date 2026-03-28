// stl.js — Voxel grid → STL mesh generator
// Converts 12×12×12 voxel grids to printable STL files

const VOXEL_SIZE = 2.0; // mm per voxel
const GRID_SIZE = 12;

// Face normals and vertex offsets for each cube face
const FACES = [
  { normal: [0, 0, 1],  verts: [[0,0,1],[1,0,1],[1,1,1],[0,1,1]] }, // front +Z
  { normal: [0, 0, -1], verts: [[1,0,0],[0,0,0],[0,1,0],[1,1,0]] }, // back -Z
  { normal: [0, 1, 0],  verts: [[0,1,1],[1,1,1],[1,1,0],[0,1,0]] }, // top +Y
  { normal: [0, -1, 0], verts: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]] }, // bottom -Y
  { normal: [1, 0, 0],  verts: [[1,0,1],[1,0,0],[1,1,0],[1,1,1]] }, // right +X
  { normal: [-1, 0, 0], verts: [[0,0,0],[0,0,1],[0,1,1],[0,1,0]] }  // left -X
];

// Direction offsets for neighbor checking
const NEIGHBORS = [
  [0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]
];

function getVoxel(grid, x, y, z) {
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE || z < 0 || z >= GRID_SIZE) return 0;
  return grid[y * GRID_SIZE * GRID_SIZE + z * GRID_SIZE + x];
}

function generateMesh(grid) {
  const triangles = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!getVoxel(grid, x, y, z)) continue;

        for (let f = 0; f < 6; f++) {
          const [nx, ny, nz] = NEIGHBORS[f];
          // Only emit face if neighbor is empty (external face)
          if (getVoxel(grid, x + nx, y + ny, z + nz)) continue;

          const face = FACES[f];
          const v = face.verts.map(([vx, vy, vz]) => [
            (x + vx) * VOXEL_SIZE,
            (y + vy) * VOXEL_SIZE,
            (z + vz) * VOXEL_SIZE
          ]);

          // Two triangles per quad
          triangles.push({ normal: face.normal, vertices: [v[0], v[1], v[2]] });
          triangles.push({ normal: face.normal, vertices: [v[0], v[2], v[3]] });
        }
      }
    }
  }

  return triangles;
}

function generateSTLBinary(triangles) {
  // Binary STL format:
  // 80 bytes header + 4 bytes triangle count + 50 bytes per triangle
  const bufferSize = 80 + 4 + triangles.length * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // Header (80 bytes) — "BARCODE MONSTERS STL"
  const header = 'BARCODE MONSTERS STL - Generated from guild member data';
  for (let i = 0; i < 80; i++) {
    view.setUint8(i, i < header.length ? header.charCodeAt(i) : 0);
  }

  // Triangle count
  view.setUint32(80, triangles.length, true);

  // Triangles
  let offset = 84;
  for (const tri of triangles) {
    // Normal
    view.setFloat32(offset, tri.normal[0], true); offset += 4;
    view.setFloat32(offset, tri.normal[1], true); offset += 4;
    view.setFloat32(offset, tri.normal[2], true); offset += 4;

    // 3 vertices
    for (const v of tri.vertices) {
      view.setFloat32(offset, v[0], true); offset += 4;
      view.setFloat32(offset, v[1], true); offset += 4;
      view.setFloat32(offset, v[2], true); offset += 4;
    }

    // Attribute byte count
    view.setUint16(offset, 0, true); offset += 2;
  }

  return buffer;
}

function generateSTLText(triangles) {
  let stl = 'solid BarcodeMonster\n';
  for (const tri of triangles) {
    stl += `  facet normal ${tri.normal[0]} ${tri.normal[1]} ${tri.normal[2]}\n`;
    stl += '    outer loop\n';
    for (const v of tri.vertices) {
      stl += `      vertex ${v[0]} ${v[1]} ${v[2]}\n`;
    }
    stl += '    endloop\n';
    stl += '  endfacet\n';
  }
  stl += 'endsolid BarcodeMonster\n';
  return stl;
}

function voxelGridToSTL(grid, binary = true) {
  const triangles = generateMesh(grid);
  return binary ? generateSTLBinary(triangles) : generateSTLText(triangles);
}

function getModelStats(grid) {
  let filledVoxels = 0;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) filledVoxels++;
  }
  const triangles = generateMesh(grid);
  const totalSize = GRID_SIZE * VOXEL_SIZE;
  return {
    filledVoxels,
    totalVoxels: GRID_SIZE * GRID_SIZE * GRID_SIZE,
    fillPercent: ((filledVoxels / (GRID_SIZE ** 3)) * 100).toFixed(1),
    triangleCount: triangles.length,
    dimensions: `${totalSize}mm × ${totalSize}mm × ${totalSize}mm`,
    estimatedFileSize: `${((80 + 4 + triangles.length * 50) / 1024).toFixed(1)} KB`,
    estimatedPrintTime: '~15 minutes',
    estimatedMaterial: `~${(filledVoxels * VOXEL_SIZE ** 3 * 0.00125).toFixed(1)}g PLA`
  };
}

export { generateMesh, generateSTLBinary, generateSTLText, voxelGridToSTL, getModelStats, VOXEL_SIZE, GRID_SIZE };
