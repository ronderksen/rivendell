import EventCard from "../../event-card";
import {cardTypes} from "../../../constants";

export default class CommonCause extends EventCard {
  setupCardAbilities(ability) {
    this.action({
      cost: ability.costs.exhaustHero(),
      target: card => (
        card !== this && card.getType() === cardTypes.hero
      ),
      handler: context => {
        context.target.ready();
        this.game.addMessage(`${this.controller.name} uses ${this.name} to ready ${context.target.name}`);
      }
    })
  }
}
