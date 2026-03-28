// R0/ability.js — Ability UDT
// Ring 0: atomic type. No imports. Self-enclosed.

export const ABILITY_MAP = {
  'TDD':'Test Shield',       'CI/CD':'Pipeline',
  'ISA-95':'Hierarchy',      'ASS-OS':'Seven Rings',
  'Controls':'Feedback Loop','Vagal':'Resonance',
  'Flywheel':'Momentum',     'Blockchain':'Immutable',
  'ECC':'Error Correct',     'Python':'Script Injection',
  'Stickers':'Mark',         'Alchemy':'Transmute',
  'Horses':'Stampede',       '80085':'Lightweight',
  'SCADA':'Overwatch',       'Ignition':'Spark',
  'Radar':'Foresight',       'AWP':'Ghost Protocol',
  'Agents':'Swarm',          'Metrics':'Measure',
  'Velocity':'Overdrive',    'Delphi':'Oracle Sight',
  'PLC':'Hard Logic',        'Models':'Polymorph'
};

export function mapAbilities(skills, tier) {
  return skills.slice(0, tier).map(s => ABILITY_MAP[s] || s);
}
