import Deck from './deck';
import HeroCard from "./cards/hero-card";
import DrawCard from "./cards/draw-card";
import {locations} from "./constants";

export default class PlayerDeck extends Deck {
  constructor(game, player, data) {
    super(data);
    this.game = game;
    this.owner = player;
    this.controller = player;
  }

  prepare() {
    const result = {
      heroes: [],
      drawCards: [],
      allCards: [],
    };

    result.heroes = this.data.heroes
      .forEach(heroData => this.createCard(HeroCard, this.controller, heroData));

    result.drawCards = this.eachRepeatedCard(this.data.drawCards, cardData => ({
      ...this.createCard(DrawCard, this.controller, cardData),
      location: locations.playerDrawDeck,
    }));

    result.allCards = result.heroes.concat(result.drawCards);

    return result;
  };

}
