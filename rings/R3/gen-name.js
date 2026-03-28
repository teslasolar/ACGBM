// R3/gen-name.js — Monster Name Generator
// Ring 3: deterministic name from seed + type.

const PRE = ['Guild','Code','Byte','Hash','Node','Flux','Void','Iron','Storm','Deep'];
const SUF = ['forge','weave','strike','guard','pulse','drift','shard','core','born','fang'];

export function genName(seed, type) {
  const p = PRE[seed % PRE.length];
  const s = SUF[(seed >>> 16) % SUF.length];
  const t = type.charAt(0) + type.slice(1).toLowerCase();
  return `${p}${s} ${t}`;
}

export function genCardId(seed) {
  return `BCM-${String(seed % 510).padStart(3, '0')}`;
}
