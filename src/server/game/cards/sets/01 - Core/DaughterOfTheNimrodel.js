import AllyCard from "../../ally-card";
import {cardTypes} from "../../../constants";

export default class DaughterOfTheNimrodel extends AllyCard {
  static code = '116-056';

  setupCardAbilities(ability) {
    this.action({
      cost: ability.costs.exhaustSelf(),
      target: {
        activePromptTitle: 'Select a hero',
        cardCondition: card => card.getType() === cardTypes.hero,
      },
      handler: context => {
        context.target.heal(2);
        this.game.addMessage(`${this.controller.name} exhausts ${this.name} to heal ${context.target.name}`);
      }
    });
  }
}
