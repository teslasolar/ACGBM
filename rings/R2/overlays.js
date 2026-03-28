// R2/overlays.js — Overlay State TAG
// Ring 2: manages active overlay state per card.

import { ELEMENT_OVERLAYS } from '../R0/overlay-def.js';

const _state = new Map();

export function initOverlays(cardId, element) {
  const defaults = ELEMENT_OVERLAYS[element] || ['contour_thick'];
  _state.set(cardId, new Set(defaults));
  return _state.get(cardId);
}

export function toggleOverlay(cardId, name) {
  const set = _state.get(cardId);
  if (!set) return;
  if (set.has(name)) set.delete(name);
  else set.add(name);
}

export function getActiveOverlays(cardId) {
  const set = _state.get(cardId);
  return set ? [...set] : [];
}

export function isOverlayActive(cardId, name) {
  const set = _state.get(cardId);
  return set ? set.has(name) : false;
}
