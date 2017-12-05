import AttachmentCard from "../../attachment-card";
import {onShadowCardDealt} from '../../../events';

export default class DarkKnowledge extends AttachmentCard {
  static code = '116-071';

  setupCardAbilities(ability) {
    this.whileAttached({
      effect: ability.effects.modifyWillpower(-1),
    });
    this.response({
      when: {
        [onShadowCardDealt]: true,
      },
      target: card => {
        const {attacker} = this.game.currentAttack;
        return (card === attacker && attacker.hasShadowCard());
      },
      cost: ability.costs.exhaustSelf(),
      handler: context => {
        context.target.getShadowCard().view(this.controller);
        this.game.addMessage(`${this.controller.name} uses ${this.name} to look at ${context.target.name}'s shadow card`);
      }
    });
  }
}
