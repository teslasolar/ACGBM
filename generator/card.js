// card.js — Compose full card from member data
// Combines stats, monster, barcode, and abilities into a complete card

import { hashSeed, calculateStats, getRarity, getRarityColor } from './stats.js';
import { generateVoxelGrid, getVoxelColor, generateMonsterName, TYPE_MAP, ELEMENT_MAP } from './monster.js';
import { renderBarcodeSVG, encodeCardHeader, encodeCardFooter } from './barcode.js';

const ABILITY_MAP = {
  'TDD': 'Test Shield', 'CI/CD': 'Pipeline', 'ISA-95': 'Hierarchy',
  'ASS-OS': 'Seven Rings', 'Controls': 'Feedback Loop',
  'Vagal': 'Resonance', 'Flywheel': 'Momentum',
  'Blockchain': 'Immutable', 'ECC': 'Error Correct',
  'Python': 'Script Injection', 'Stickers': 'Mark',
  'Alchemy': 'Transmute', 'Horses': 'Stampede', '80085': 'Lightweight',
  'SCADA': 'Overwatch', 'Ignition': 'Spark', 'Radar': 'Foresight',
  'AWP': 'Ghost Protocol', 'Agents': 'Swarm', 'Metrics': 'Measure',
  'Velocity': 'Overdrive', 'Delphi': 'Oracle Sight',
  'PLC': 'Hard Logic', 'Models': 'Polymorph'
};

function generateCard(member) {
  const seed = hashSeed(member.name);
  const type = TYPE_MAP[member.role] || 'CONSTRUCT';
  const element = ELEMENT_MAP[type];
  const stats = calculateStats(member, seed);
  const rarity = getRarity(stats.total);
  const abilities = member.skills
    .slice(0, member.tier)
    .map(s => ABILITY_MAP[s] || s);
  const monsterName = generateMonsterName(seed, type);
  const voxelGrid = generateVoxelGrid(seed, type);

  return {
    id: `BCM-${String(seed % 510).padStart(3, '0')}`,
    monsterName,
    memberId: member.id,
    memberName: member.name,
    type, element, rarity,
    stats,
    abilities,
    tier: member.tier,
    set: 'GEN-1',
    color: member.color,
    seed,
    voxelGrid,
    rarityColor: getRarityColor(rarity),
    cardNumber: (seed % 510) + 1,
    totalCards: 510
  };
}

function renderCardSVG(card, width = 252, height = 352) {
  const borderColor = card.rarityColor;
  const elementColors = {
    FIRE: '#FF4500', CRYSTAL: '#00BFFF', METAL: '#708090', WIND: '#32CD32',
    VOID: '#8A2BE2', PRISM: '#FF69B4', AETHER: '#FFD700', LIGHTNING: '#00FF7F'
  };
  const elemColor = elementColors[card.element] || '#708090';

  const headerBarcode = renderBarcodeSVG(encodeCardHeader(card), width - 20, 16, elemColor);
  const footerBarcode = renderBarcodeSVG(encodeCardFooter(card), width - 20, 16, elemColor);

  // Render voxel art as pixel grid (front face, y-slice at z=6)
  const pixelSize = Math.floor((width - 40) / 12);
  let voxelArt = '';
  for (let y = 11; y >= 0; y--) {
    for (let x = 0; x < 12; x++) {
      const idx = y * 144 + 6 * 12 + x;
      if (card.voxelGrid[idx]) {
        const color = getVoxelColor(card.voxelGrid, x, y, 6, card.element, card.seed);
        const px = 20 + x * pixelSize;
        const py = 45 + (11 - y) * pixelSize;
        voxelArt += `<rect x="${px}" y="${py}" width="${pixelSize}" height="${pixelSize}" fill="${color}" rx="1"/>`;
      }
    }
  }

  const stars = '★'.repeat(card.tier) + '☆'.repeat(3 - card.tier);
  const abilityY = 268;
  let abilityText = '';
  card.abilities.forEach((a, i) => {
    abilityText += `<text x="26" y="${abilityY + i * 14}" fill="#DDD" font-size="10" font-family="monospace">${a}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg-${card.seed}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
    <filter id="glow-${card.seed}">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Card border -->
  <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="${borderColor}" />
  <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="10" fill="url(#bg-${card.seed})" />

  <!-- Header barcode -->
  <g transform="translate(10, 10)">${headerBarcode}</g>

  <!-- Monster art -->
  ${voxelArt}

  <!-- Monster name -->
  <text x="${width / 2}" y="${52 + 12 * pixelSize}" text-anchor="middle" fill="#FFF" font-size="14" font-weight="bold" font-family="monospace">${card.monsterName}</text>

  <!-- Type + stars -->
  <line x1="20" y1="${58 + 12 * pixelSize}" x2="${width - 20}" y2="${58 + 12 * pixelSize}" stroke="${elemColor}" stroke-width="1" opacity="0.5"/>
  <text x="22" y="${72 + 12 * pixelSize}" fill="${elemColor}" font-size="11" font-family="monospace">⚒ ${card.type}</text>
  <text x="${width - 22}" y="${72 + 12 * pixelSize}" text-anchor="end" fill="${elemColor}" font-size="11" font-family="monospace">${stars}</text>

  <!-- Stats -->
  <text x="22" y="244" fill="#FF6B6B" font-size="11" font-family="monospace">ATK: ${card.stats.atk}</text>
  <text x="${width / 2 + 5}" y="244" fill="#4ECDC4" font-size="11" font-family="monospace">DEF: ${card.stats.def}</text>
  <text x="22" y="258" fill="#45B7D1" font-size="11" font-family="monospace">SPD: ${card.stats.spd}</text>
  <text x="${width / 2 + 5}" y="258" fill="#96CEB4" font-size="11" font-family="monospace">RES: ${card.stats.res}</text>

  <!-- Abilities -->
  <rect x="20" y="${abilityY - 12}" width="${width - 40}" height="${card.abilities.length * 14 + 8}" rx="4" fill="rgba(255,255,255,0.05)" stroke="${elemColor}" stroke-width="0.5"/>
  ${abilityText}

  <!-- Set info -->
  <text x="22" y="${height - 35}" fill="#888" font-size="9" font-family="monospace">GUILD: ACG    SET: ${card.set}</text>
  <text x="22" y="${height - 23}" fill="#888" font-size="9" font-family="monospace">#${String(card.cardNumber).padStart(3, '0')}/${card.totalCards}    ${card.rarity}</text>

  <!-- Footer barcode -->
  <g transform="translate(10, ${height - 18})">${footerBarcode}</g>
</svg>`;
}

function generateAllCards(members) {
  return members.map(m => generateCard(m));
}

export { generateCard, renderCardSVG, generateAllCards, ABILITY_MAP };
