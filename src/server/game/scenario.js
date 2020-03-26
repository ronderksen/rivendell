import EncounterDeck from "./encounter-deck";

export default class Scenario {
  constructor(id, setId) {
    this.id = id;
    this.setId = setId;
    this.drawDeck = {};
  }

  setEncounterDeck(deck) {
    this.deckSelected = false;
    this.deck = deck;
    this.deckSelected = true;
  }

  prepareDeck() {
    const deck = new EncounterDeck(this.deck);
    this.preparedDeck = deck.prepare(this);
    this.drawDeck = this.preparedDeck.drawCards;
  }

  searchEncounterDeck(limit, predicate) {
    let cards = [...this.drawDeck];

    if (typeof limit === 'function') {
      predicate = limit; // eslint-disable-line no-param-reassign
    } else if (limit > 0) {
      cards = cards.splice(0, limit);
    } else {
      cards = cards.reverse.splice(0, limit).reverse();
    }

    return cards.filter(predicate);
  }

  getActiveLocation(questAllowed) {
    if (this.activeLocation) {
      return this.activeLocation;
    } else if (questAllowed) {
      return this.activeQuestCard;
    }
    return null;
  }
}
