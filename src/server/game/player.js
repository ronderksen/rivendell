import Deck from './deck';

export default class Player {
  constructor(id, user, isOwner, game) {
    this.id = id;
    this.user = user;
    this.name = user.username;
    this.isOwner = isOwner;
    this.game = game;
    this.left = false;
  }

  initialize() {

  }

  prepareDeck() {
    const deck = new Deck(this.deck);
    this.preparedDeck = deck.prepare(this);
    this.heroes = this.preparedDeck.heroes;
    this.drawDeck = this.preparedDeck.drawCards;
  }

  drawCards(count) {
    if (this.drawDeck.length > 0) {
      return this.drawDeck.splice(0, count);
    }
    return [];
  }
  
  modifyThreatCount(value) {
    this.threatCount += value;
  }
}
