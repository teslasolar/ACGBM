// R1/barcode-enc.js — Barcode Encoding Template
// Ring 1: Code128 encode + SVG render. Uses R1/barcode-table.

import { C128 } from './barcode-table.js';

export function encode(text) {
  const vals = [104];
  for (let i = 0; i < text.length; i++) vals.push(text.charCodeAt(i) - 32);
  let chk = vals[0];
  for (let i = 1; i < vals.length; i++) chk += vals[i] * i;
  vals.push(chk % 103);
  vals.push(106);
  const bars = [];
  for (const v of vals) {
    const p = C128[v] || C128[0];
    for (let i = 0; i < p.length; i++)
      for (let w = 0; w < p[i]; w++) bars.push(i % 2 === 0 ? 1 : 0);
  }
  bars.push(1, 1);
  return bars;
}

export function toSVG(text, w, h, color = '#000') {
  const bars = encode(text);
  const bw = w / bars.length;
  let svg = '';
  for (let i = 0; i < bars.length; i++)
    if (bars[i]) svg += `<rect x="${i*bw}" y="0" width="${bw}" height="${h}" fill="${color}"/>`;
  return svg;
}
