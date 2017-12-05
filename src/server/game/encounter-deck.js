import Deck from './deck';
import DrawCard from "./cards/draw-card";
import {locations} from "./constants";

export default class EncounterDeck extends Deck {
  constructor(game, data) {
    super(data);
    this.owner = game;
    this.controller = game;
  }

  prepare() {
    return {
      questCards: this.data.quest.map(cardData => ({
        ...this.createQuestCard(DrawCard, this.controller, cardData),
        location: locations.questDeck,
      })),
      drawCards: this.eachRepeatedCard(this.data.drawCards, cardData => ({
        ...this.createCard(DrawCard, this.controller, cardData),
        location: locations.encounterDeck,
      })),
    };
  };

}
