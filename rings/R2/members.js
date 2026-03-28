// R2/members.js — Member TAG Provider
// Ring 2: data access layer. Wraps raw JSON.

let _cache = null;

export async function loadMembers(basePath = '.') {
  if (_cache) return _cache;
  const resp = await fetch(`${basePath}/data/members.json`);
  _cache = await resp.json();
  return _cache;
}

export function setMembers(data) {
  _cache = data;
}

export function getMembers() {
  return _cache || [];
}

export function getMember(id) {
  return (_cache || []).find(m => m.id === id);
}

export function getMemberCount() {
  return (_cache || []).length;
}
