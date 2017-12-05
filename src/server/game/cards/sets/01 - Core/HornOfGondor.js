import AttachmentCard from '../../attachment-card';
import { onCharacterLeavesPlay } from '../../../events';
import {cardTypes} from "../../../constants";

export default class HornOfGondor extends AttachmentCard {
  static code = '116-042';

  setupCardAbilities(ability) {
    this.response({
      when: {
        [onCharacterLeavesPlay]: true,
      },
      effect: ability.effects.modifyParentResources(1)
    })
  }
  
  canAttach(player, card) {
    return card.getType() === cardTypes.hero;
  }
}
