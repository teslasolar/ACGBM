// R0/overlay-def.js — Overlay Type UDT
// Ring 0: atomic type. No imports.

export const OVERLAY_TYPES = {
  aura_flame:   {layer:'under',animate:true, frames:8, speed:120},
  aura_crystal: {layer:'under',animate:true, frames:6, speed:200},
  aura_electric:{layer:'under',animate:true, frames:4, speed:80},
  aura_void:    {layer:'under',animate:true, frames:6, speed:150},
  aura_wind:    {layer:'under',animate:true, frames:8, speed:100},
  aura_prism:   {layer:'under',animate:true, frames:12,speed:90},
  face_sparkle: {layer:'over', animate:true, frames:4, speed:200,region:'face'},
  face_hearts:  {layer:'over', animate:true, frames:6, speed:150,region:'face'},
  fx_sparkles:  {layer:'over', animate:true, frames:8, speed:100},
  fx_fire:      {layer:'over', animate:true, frames:6, speed:80},
  fx_confetti:  {layer:'over', animate:true, frames:12,speed:90},
  fx_lightning: {layer:'over', animate:true, frames:4, speed:60},
  contour_thick:{layer:'over', animate:false,width:3},
  contour_glow: {layer:'over', animate:true, frames:4, speed:200},
  contour_rainbow:{layer:'over',animate:true,frames:12,speed:100}
};

export const ELEMENT_OVERLAYS = {
  FIRE:['aura_flame','fx_fire','contour_glow'],
  CRYSTAL:['aura_crystal','fx_sparkles','contour_glow'],
  METAL:['contour_thick','fx_sparkles'],
  WIND:['aura_wind','fx_sparkles','contour_glow'],
  VOID:['aura_void','fx_sparkles','contour_glow'],
  PRISM:['aura_prism','fx_confetti','contour_rainbow'],
  AETHER:['fx_sparkles','contour_glow'],
  LIGHTNING:['aura_electric','fx_lightning','contour_glow']
};
