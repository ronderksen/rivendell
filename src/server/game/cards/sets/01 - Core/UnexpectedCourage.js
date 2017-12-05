import AttachmentCard from '../../attachment-card';
import {cardTypes} from "../../../constants";

export default class UnexpectedCourage extends AttachmentCard {
  static code = '116-057';

  setupCardAbilities(ability) {
    this.whileAttached({
      cost: ability.costs.exhaustSelf(),
      handler: () => {
        this.controller.readyCard(this.parent);
        this.game.addMessage(`${this.controller.name} exhausts ${this.name} to ready ${this.parent.name}`);
      }
    });
  }

  canAttach(player, card) {
    return card.getType() === cardTypes.hero;
  }
}
