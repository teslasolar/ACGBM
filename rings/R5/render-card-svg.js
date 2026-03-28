// R5/render-card-svg.js — Card SVG Renderer
// Ring 5: composes card image with contoured art.

import { ELEMENT_COLORS } from '../R0/element.js';
import { voxelColor } from '../R1/color.js';
import { isContour, isSurface } from '../R1/voxel.js';
import { toSVG } from '../R1/barcode-enc.js';

export function renderCardSVG(card, w=252, h=352) {
  const bc=card.rarityColor, ec=(ELEMENT_COLORS[card.element]||ELEMENT_COLORS.METAL).primary;
  const hB=toSVG(`${card.id}|${card.type}|${card.rarity}|${card.set}`,w-20,16,ec);
  const fB=toSVG(`${card.memberId}|${(card.seed%99999).toString(36)}|${card.id}`,w-20,16,ec);
  const ps=Math.floor((w-40)/12);
  let art='';
  for(let y=11;y>=0;y--) for(let x=0;x<12;x++)
    if(card.voxelGrid[y*144+72+x])
      art+=`<rect x="${22+x*ps}" y="${47+(11-y)*ps}" width="${ps}" height="${ps}" fill="rgba(0,0,0,.3)" rx="2"/>`;
  for(let y=11;y>=0;y--) for(let x=0;x<12;x++){
    if(!card.voxelGrid[y*144+72+x]) continue;
    const c=voxelColor(card.voxelGrid,x,y,6,card.element,card.seed), px=20+x*ps, py=45+(11-y)*ps;
    art+=`<rect x="${px}" y="${py}" width="${ps}" height="${ps}" fill="${c}" rx="2"/>`;
    if(isContour(card.voxelGrid,x,y,6)) art+=`<rect x="${px}" y="${py}" width="${ps}" height="${ps}" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="1.5" rx="2"/>`;
    if(y>=9&&isSurface(card.voxelGrid,x,y,6)) art+=`<rect x="${px+1}" y="${py+1}" width="${ps*.3}" height="${ps*.3}" fill="rgba(255,255,255,.35)" rx="1"/>`;
  }
  const st='\u2605'.repeat(card.tier)+'\u2606'.repeat(3-card.tier);
  let ab=''; card.abilities.forEach((a,i)=>{ab+=`<text x="26" y="${268+i*14}" fill="#DDD" font-size="10" font-family="monospace">${a}</text>`;});
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs><linearGradient id="b${card.seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#16213e"/></linearGradient></defs><rect width="${w}" height="${h}" rx="12" fill="${bc}"/><rect x="3" y="3" width="${w-6}" height="${h-6}" rx="10" fill="url(#b${card.seed})"/><g transform="translate(10,10)">${hB}</g>${art}<text x="${w/2}" y="${52+12*ps}" text-anchor="middle" fill="#FFF" font-size="14" font-weight="bold" font-family="monospace">${card.monsterName}</text><line x1="20" y1="${58+12*ps}" x2="${w-20}" y2="${58+12*ps}" stroke="${ec}" stroke-width="1" opacity=".5"/><text x="22" y="${72+12*ps}" fill="${ec}" font-size="11" font-family="monospace">\u2692 ${card.type}</text><text x="${w-22}" y="${72+12*ps}" text-anchor="end" fill="${ec}" font-size="11" font-family="monospace">${st}</text><text x="22" y="244" fill="#FF6B6B" font-size="11" font-family="monospace">ATK: ${card.stats.atk}</text><text x="${w/2+5}" y="244" fill="#4ECDC4" font-size="11" font-family="monospace">DEF: ${card.stats.def}</text><text x="22" y="258" fill="#45B7D1" font-size="11" font-family="monospace">SPD: ${card.stats.spd}</text><text x="${w/2+5}" y="258" fill="#96CEB4" font-size="11" font-family="monospace">RES: ${card.stats.res}</text><rect x="20" y="256" width="${w-40}" height="${card.abilities.length*14+8}" rx="4" fill="rgba(255,255,255,.05)" stroke="${ec}" stroke-width=".5"/>${ab}<text x="22" y="${h-35}" fill="#888" font-size="9" font-family="monospace">GUILD: ACG    SET: ${card.set}</text><text x="22" y="${h-23}" fill="#888" font-size="9" font-family="monospace">#${String(card.cardNumber).padStart(3,'0')}/${card.totalCards}    ${card.rarity}</text><g transform="translate(10,${h-18})">${fB}</g></svg>`;
}
