import EventCard from '../../event-card';
import {cardTypes} from "../../../constants";

export default class EverVigilant extends EventCard {
  static code = '116-020';

  setupCardAbilities() {
    this.action({
      target: {
        cardCondition: card =>
          card.getType() === cardTypes.ally &&
          card.controller === this.controller &&
          card.isExhausted()
      },
      handler: context => {
        this.controller.readyCard(context.target);
      }
    })
  }
}
