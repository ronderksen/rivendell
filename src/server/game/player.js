import Deck from './deck';
import { onCardReadied, onCardExhausted } from './events';

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

  readyCard(card) {
    if (!card.exhausted) {
      return;
    }

    this.game.applyGameAction('ready', card, c => {
      c.ready();

      this.game.raiseEvent(onCardReadied, { player: this, card });
    });
  }

  exhaustCard(card) {
    if (card.exhausted) {
      return;
    }

    this.game.applyGameAction('exhaust', card, c => {
      c.exhaust();

      this.game.raiseEvent(onCardExhausted, { player: this, card });
    });
  }
}
