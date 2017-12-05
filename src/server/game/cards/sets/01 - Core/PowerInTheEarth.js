import AttachmentCard from '../../attachment-card';
import { cardTypes } from '../../../events';

export default class PowerInTheEarth extends AttachmentCard {
  static code = '116-056';

  setupCardAbilities(ability) {
    this.whileAttached({
      effect: ability.effects.modifyThreatStrength(-1)
    });
  }

  canAttach(player, card) {
    return card.getType() === cardTypes.location;
  }
}
