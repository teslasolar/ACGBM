// R0/element.js — Element UDT
// Ring 0: atomic type. No imports.

export const ELEMENTS = ['FIRE','METAL','WIND','CRYSTAL','VOID','PRISM','LIGHTNING','AETHER'];

export const CYCLE = {
  FIRE:'METAL', METAL:'WIND', WIND:'CRYSTAL',
  CRYSTAL:'VOID', VOID:'PRISM', PRISM:'FIRE'
};

export const ADVANTAGE_BONUS = 500;

export { ELEMENT_COLORS } from './element-colors.js';
