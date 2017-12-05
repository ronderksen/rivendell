import AttachmentCard from '../../attachment-card';
import {cardTypes, traits} from "../../../constants";

export default class DwarvenAxe extends AttachmentCard {
  static code = '116-041';

  setupCardAbilities(ability) {
    this.whileAttached({
      match: card => card.hasTrait(traits.dwarf),
      effect: ability.effects.modifyAttack(1)
    });
    this.whileAttached({
      effect: ability.effects.modifyAttack(1)
    })
  }

  canAttach(player, card) {
    return card.getType() === cardTypes.hero;
  }
}
