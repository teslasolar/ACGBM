// R0/archetype.js — Body Archetype UDT
// Ring 0: atomic type. No imports. Self-enclosed.

export const BODY_ARCHETYPES = {
  FORGEMASTER: { base:'humanoid',  aura:'flame',   width:0.9, height:1.0, headScale:1.4, eyeSize:2 },
  SENTINEL:    { base:'geometric', aura:'crystal',  width:0.8, height:1.1, headScale:1.3, eyeSize:2 },
  CONSTRUCT:   { base:'mechanical',aura:'gear',     width:1.0, height:0.9, headScale:1.3, eyeSize:2 },
  WEAVER:      { base:'fluid',     aura:'ribbon',   width:0.7, height:1.2, headScale:1.5, eyeSize:3 },
  PHANTOM:     { base:'fragment',  aura:'glitch',   width:0.6, height:1.0, headScale:1.4, eyeSize:2 },
  SHIFTER:     { base:'amorphous', aura:'prism',    width:0.8, height:0.8, headScale:1.6, eyeSize:3 },
  ORACLE:      { base:'robed',     aura:'symbol',   width:0.7, height:1.1, headScale:1.3, eyeSize:2 },
  DISRUPTOR:   { base:'jagged',    aura:'electric', width:0.9, height:0.9, headScale:1.3, eyeSize:2 }
};

export const TYPE_MAP = {
  Founder:'FORGEMASTER', Architect:'SENTINEL',
  Engineer:'CONSTRUCT',  Content:'WEAVER',
  Protocol:'PHANTOM',    Creative:'SHIFTER',
  Philosopher:'ORACLE',  Breaker:'DISRUPTOR'
};

export const ELEMENT_MAP = {
  FORGEMASTER:'FIRE',  SENTINEL:'CRYSTAL',
  CONSTRUCT:'METAL',   WEAVER:'WIND',
  PHANTOM:'VOID',      SHIFTER:'PRISM',
  ORACLE:'AETHER',     DISRUPTOR:'LIGHTNING'
};
