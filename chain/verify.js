// verify.js — Verify Barcode Monster card authenticity
// Checks card data against deterministic generation

import { generateCard } from '../generator/card.js';
import { readFileSync } from 'fs';

const members = JSON.parse(readFileSync(new URL('../data/members.json', import.meta.url)));

function verifyCard(cardId, claimedData) {
  // Find the member this card should belong to
  const member = members.find(m => {
    const card = generateCard(m);
    return card.id === cardId;
  });

  if (!member) {
    return { valid: false, reason: 'Card ID does not match any guild member' };
  }

  const expectedCard = generateCard(member);

  // Verify each field
  const checks = [
    { field: 'monsterName', expected: expectedCard.monsterName, got: claimedData.monsterName },
    { field: 'type', expected: expectedCard.type, got: claimedData.type },
    { field: 'element', expected: expectedCard.element, got: claimedData.element },
    { field: 'rarity', expected: expectedCard.rarity, got: claimedData.rarity },
    { field: 'atk', expected: expectedCard.stats.atk, got: claimedData.stats?.atk },
    { field: 'def', expected: expectedCard.stats.def, got: claimedData.stats?.def },
    { field: 'spd', expected: expectedCard.stats.spd, got: claimedData.stats?.spd },
    { field: 'res', expected: expectedCard.stats.res, got: claimedData.stats?.res }
  ];

  const failures = checks.filter(c => c.expected !== c.got);

  if (failures.length > 0) {
    return {
      valid: false,
      reason: 'Data mismatch',
      failures: failures.map(f => `${f.field}: expected ${f.expected}, got ${f.got}`)
    };
  }

  return {
    valid: true,
    card: expectedCard,
    member: member.name,
    message: `VERIFIED: ${expectedCard.monsterName} is an authentic Barcode Monster card.`
  };
}

function verifyByMemberId(memberId) {
  const member = members.find(m => m.id === memberId);
  if (!member) return { valid: false, reason: 'Member not found' };

  const card = generateCard(member);
  return {
    valid: true,
    card,
    message: `Card ${card.id} (${card.monsterName}) verified for member ${member.name}.`
  };
}

export { verifyCard, verifyByMemberId };
