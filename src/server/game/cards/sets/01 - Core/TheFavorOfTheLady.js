import AttachmentCard from '../../attachment-card';
import {cardTypes} from "../../../constants";

export default class TheFavorOfTheLady extends AttachmentCard {
  static code = '-';

  setupCardAbilities(ability) {
    this.whileAttached({
      effect: ability.effects.modifyWillpower(1)
    });
  }

  canAttach(player, card) {
    return card.getType() === cardTypes.hero;
  }
}
