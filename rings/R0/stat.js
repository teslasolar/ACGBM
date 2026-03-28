// R0/stat.js — Stat Calculation UDT
// Ring 0: atomic type. No imports. Self-enclosed.

export function hashSeed(name) {
  let seed = 0;
  for (let i = 0; i < name.length; i++)
    seed = (seed * 31 + name.charCodeAt(i)) & 0xFFFFFFFF;
  return seed >>> 0;
}

export function calcStats(member, seed) {
  const n = member.skills.length;
  const yrs = 2026 - (2000 + member.year);
  return {
    atk: n * member.tier * 200 + (seed % 400),
    def: member.tier * 600 + ((seed >>> 4) % 300),
    spd: n * 150 + ((seed >>> 8) % 200),
    res: yrs * 400 + member.tier * 300
  };
}

export function totalPower(s) {
  return s.atk + s.def + s.spd + s.res;
}
