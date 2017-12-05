import AttachmentCard from '../../attachment-card';
import {cardTypes, traits} from "../../../constants";

export default class StewardOfGondor extends AttachmentCard {
  static code = '116-026';

  setupCardAbilities(ability) {
    this.whileAttached({
      effect: ability.effects.addTrait(traits.gondor),
    });
    this.action({
      cost: ability.costs.exhaustSelf(),
      effect: ability.effects.modifyResources(2)
    });
  }
  
  canAttach(player, card) {
    return card.getType() === cardTypes.hero
  }
}
