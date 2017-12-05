function createCards(count, types = []) {
  const cardsPerType = Math.ceil(count / types.length);
  const cards = types.reduce((acc, type) => {
    for(let i = 0; i < cardsPerType; i += 1) {
      acc.push({
        type,
        name: `${type}-${i}`,
      });
    }
    return acc;
  }, []);
  return cards.splice(0, count);
}

export default function MockDeckFactory() {
  const drawCards = createCards(50, ['ally', 'attachment', 'event']);
  const heroes = createCards(3, ['hero']);
  return {
    allCards: drawCards.concat(heroes),
    drawCards,
    heroes,
  };
}
