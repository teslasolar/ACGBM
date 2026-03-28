// barcode.js — Encode card data into scannable barcode patterns
// Code 128 subset with visual rendering

const CODE128_START = 104;
const CODE128_STOP = 106;

// Simplified Code 128B character set patterns (bar/space widths)
const CODE128_PATTERNS = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
  [2,1,1,2,3,2],[2,3,3,1,1,1],[2,1,1,1,1,4] // indices up to 106
];

function encodeCode128(text) {
  const values = [CODE128_START];
  for (let i = 0; i < text.length; i++) {
    values.push(text.charCodeAt(i) - 32);
  }
  // Checksum
  let checksum = values[0];
  for (let i = 1; i < values.length; i++) {
    checksum += values[i] * i;
  }
  values.push(checksum % 103);
  values.push(CODE128_STOP);
  return values;
}

function generateBarcodePattern(text) {
  const values = encodeCode128(text);
  const bars = [];
  for (const val of values) {
    const pattern = CODE128_PATTERNS[val] || CODE128_PATTERNS[0];
    for (let i = 0; i < pattern.length; i++) {
      const width = pattern[i];
      const isBar = i % 2 === 0;
      for (let w = 0; w < width; w++) {
        bars.push(isBar ? 1 : 0);
      }
    }
  }
  // Termination bar
  bars.push(1, 1);
  return bars;
}

function renderBarcodeSVG(text, width, height, color = '#000000') {
  const bars = generateBarcodePattern(text);
  const barWidth = width / bars.length;
  let svg = '';

  for (let i = 0; i < bars.length; i++) {
    if (bars[i]) {
      svg += `<rect x="${i * barWidth}" y="0" width="${barWidth}" height="${height}" fill="${color}" />`;
    }
  }

  return svg;
}

function encodeCardHeader(card) {
  // card_id | monster_type | rarity | set
  return `${card.id}|${card.type}|${card.rarity}|${card.set}`;
}

function encodeCardFooter(card) {
  // member_id | stl_url_hash | card_number
  const stlHash = (card.seed % 99999).toString(36);
  return `${card.memberId}|${stlHash}|${card.id}`;
}

export {
  generateBarcodePattern, renderBarcodeSVG,
  encodeCardHeader, encodeCardFooter, encodeCode128
};
