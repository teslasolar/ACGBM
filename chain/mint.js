// mint.js — Mint Barcode Monster cards from member data
// Usage: node mint.js [memberId]

import { generateCard } from '../generator/card.js';
import { readFileSync } from 'fs';

const members = JSON.parse(readFileSync(new URL('../data/members.json', import.meta.url)));

async function mintCard(memberId) {
  const member = members.find(m => m.id === memberId);
  if (!member) {
    console.error(`Member not found: ${memberId}`);
    return null;
  }

  const card = generateCard(member);

  console.log('='.repeat(50));
  console.log('BARCODE MONSTERS — CARD MINTED');
  console.log('='.repeat(50));
  console.log(`Card ID:     ${card.id}`);
  console.log(`Monster:     ${card.monsterName}`);
  console.log(`Member:      ${card.memberName}`);
  console.log(`Type:        ${card.type}`);
  console.log(`Element:     ${card.element}`);
  console.log(`Tier:        ${card.tier}`);
  console.log(`Rarity:      ${card.rarity}`);
  console.log(`ATK: ${card.stats.atk}  DEF: ${card.stats.def}  SPD: ${card.stats.spd}  RES: ${card.stats.res}`);
  console.log(`Total Power: ${card.stats.total}`);
  console.log(`Abilities:   ${card.abilities.join(', ')}`);
  console.log('='.repeat(50));

  // NFT metadata (for on-chain storage)
  const metadata = {
    card_id: card.id,
    monster_name: card.monsterName,
    member_id: card.memberId,
    type: card.type,
    element: card.element,
    tier: card.tier,
    stats: card.stats,
    abilities: card.abilities,
    rarity: card.rarity,
    set: card.set,
    stl_hash: `Qm${card.seed.toString(16).padStart(40, '0')}`,
    barcode_data: `${card.id}${card.type.substring(0, 4)}${card.element.substring(0, 4)}${card.tier}${card.rarity}`,
    generated_from: `member_hash_${card.seed}`,
    print_count: 0,
    battle_record: { wins: 0, losses: 0, draws: 0 }
  };

  console.log('\nNFT Metadata:');
  console.log(JSON.stringify(metadata, null, 2));

  return metadata;
}

async function mintAll() {
  console.log('BARCODE MONSTERS — MINTING ALL GUILD CARDS');
  console.log(`Minting ${members.length} cards...\n`);

  const results = [];
  for (const member of members) {
    const metadata = await mintCard(member.id);
    if (metadata) results.push(metadata);
    console.log('');
  }

  console.log(`\nMinted ${results.length}/${members.length} cards successfully.`);
  return results;
}

// CLI usage
const targetMember = process.argv[2];
if (targetMember) {
  mintCard(targetMember);
} else {
  mintAll();
}

export { mintCard, mintAll };
