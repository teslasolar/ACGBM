// R2/cards.js — Card TAG Provider
// Ring 2: generated card data cache.

let _cards = [];

export function setCards(cards) {
  _cards = cards;
}

export function getCards() {
  return _cards;
}

export function getCard(id) {
  return _cards.find(c => c.id === id);
}

export function findCard(query) {
  const q = query.toUpperCase();
  return _cards.find(c =>
    c.id === q ||
    c.memberId.toUpperCase() === q ||
    c.memberName.toUpperCase() === q
  );
}

export function getCardCount() {
  return _cards.length;
}
