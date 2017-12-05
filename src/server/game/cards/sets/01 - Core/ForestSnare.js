import AttachmentCard from '../../attachment-card';
import {cardTypes} from "../../../constants";

export default class ForestSnare extends AttachmentCard {
  static code = '116-069';

  setupCardAbilities(ability) {
    this.whileAttached({
      effect: ability.effects.canNotAttack()
    });
  }

  canAttach(player, card) {
    return (
      card.getType() === cardTypes.enemy &&
      card.isEngaged(player)
    )
  }
}
