// decode.js — Multi-channel barcode decoder
// Decodes BARCODE MONSTERS cards from camera or image input

function decodeChannel1(luminanceData) {
  // Channel 1: Card identity (standard barcode readers)
  // Decode Code 128 from luminance values
  const bars = [];
  let inBar = false;
  let count = 0;

  for (const val of luminanceData) {
    const isBar = val < 128;
    if (isBar === inBar) {
      count++;
    } else {
      if (count > 0) bars.push({ type: inBar ? 'bar' : 'space', width: count });
      inBar = isBar;
      count = 1;
    }
  }
  if (count > 0) bars.push({ type: inBar ? 'bar' : 'space', width: count });

  return bars;
}

function decodeChannel2(hueData) {
  // Channel 2: Element type (encoded in barcode hue)
  const ELEMENT_HUES = {
    0: 'FIRE',      // red
    30: 'LIGHTNING', // yellow-green
    120: 'WIND',     // green
    180: 'CRYSTAL',  // cyan
    210: 'METAL',    // light blue
    270: 'VOID',     // purple
    300: 'PRISM',    // pink
    60: 'AETHER'     // yellow
  };

  // Average hue of barcode region
  let totalHue = 0;
  let count = 0;
  for (const h of hueData) {
    if (h !== null) { totalHue += h; count++; }
  }
  const avgHue = count > 0 ? totalHue / count : 0;

  // Find closest element
  let closest = 'METAL';
  let minDist = Infinity;
  for (const [hue, element] of Object.entries(ELEMENT_HUES)) {
    const dist = Math.min(
      Math.abs(avgHue - Number(hue)),
      360 - Math.abs(avgHue - Number(hue))
    );
    if (dist < minDist) {
      minDist = dist;
      closest = element;
    }
  }

  return closest;
}

function decodeChannel3(saturationData) {
  // Channel 3: Rarity level (encoded in saturation)
  let totalSat = 0;
  let count = 0;
  for (const s of saturationData) {
    if (s !== null) { totalSat += s; count++; }
  }
  const avgSat = count > 0 ? totalSat / count : 0;

  if (avgSat > 80) return 'LEGENDARY';
  if (avgSat > 60) return 'EPIC';
  if (avgSat > 40) return 'RARE';
  if (avgSat > 20) return 'UNCOMMON';
  return 'COMMON';
}

function parseCardData(barcodeText) {
  // Parse card header: card_id|type|rarity|set
  const parts = barcodeText.split('|');
  if (parts.length >= 4) {
    return {
      cardId: parts[0],
      type: parts[1],
      rarity: parts[2],
      set: parts[3]
    };
  }
  return null;
}

function parseFooterData(barcodeText) {
  // Parse card footer: member_id|stl_hash|card_id
  const parts = barcodeText.split('|');
  if (parts.length >= 3) {
    return {
      memberId: parts[0],
      stlHash: parts[1],
      cardId: parts[2]
    };
  }
  return null;
}

export {
  decodeChannel1, decodeChannel2, decodeChannel3,
  parseCardData, parseFooterData
};
