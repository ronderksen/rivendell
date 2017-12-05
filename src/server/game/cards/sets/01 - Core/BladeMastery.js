import EventCard from '../../event-card';
import { cardTypes } from "../../../constants";

export default class BladeMastery extends EventCard {
  static code = '116-032';

  setupCardAbilities() {
    this.action({
      target: card => this.cardCondition(card),
      handler: context => {
        this.untilEndOfPhase(ability => ({
          match: context.event.target,
          effects: [ability.effects.modifyAttack(1), ability.effects.modifyDefense(1)]
        }));
      }
    })
  }

  cardCondition(card) {
    return card.getType() === cardTypes.hero;
  }
}
