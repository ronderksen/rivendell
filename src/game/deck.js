import cards from './cards/sets';
import HeroCard from './cards/hero-card';
import DrawCard from './cards/draw-card';

export default class Deck {
  constructor(data) {
    this.data = data;
  }

  prepare() {
    return {
      heroes: this.data.heroes
        .forEach(heroData => this.createCard(HeroCard, player, heroData)),
      drawCards: this.eachRepeatedCard(this.data.drawCards, cardData => ({
        ...this.createCard(DrawCard, player, cardData),
        location: 'draw deck',
      })),
    };
  };
  
  createCard(CardFactory, player, cardData) {
    const CardClass = cards[cardData.code] || CardFactory;
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
