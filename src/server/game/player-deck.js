import Deck from './deck';
import HeroCard from "./cards/hero-card";
import DrawCard from "./cards/draw-card";
import {locations} from "./constants";

export default class PlayerDeck extends Deck {
  prepare(player) {
    const result = {
      heroes: [],
      drawCards: [],
      allCards: [],
    };

    result.heroes = Object.values(this.data.heroes)
      .map(heroData => this.createCard(HeroCard, player, heroData));

    result.drawCards = this.eachRepeatedCard(Object.values(this.data.drawCards), cardData => {
      const card = this.createCard(DrawCard, player, cardData);
      card.location = locations.playerDrawDeck;
      return card;
    });

    result.allCards = result.heroes.concat(result.drawCards);

    return result;
  };

}
