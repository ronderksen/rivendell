import playerCards from './cards/sets';

export default class Deck {
  constructor(data) {
    this.data = data;
  }

  prepare() {};

  createCard(CardFactory, player, cardData) {
    const CardClass = playerCards[cardData.code] || CardFactory;
    return new CardClass(player, cardData);
  }

  eachRepeatedCard(cards, func) {
    return cards.forEach(cardEntry => {
      for (let i = 0; i < cardEntry.count; i += 1) {
        func(cardEntry.card);
      }
    });
  }
}
