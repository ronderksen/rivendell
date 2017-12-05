import AttachmentCard from '../../attachment-card';

export default class SelfPreservation extends AttachmentCard {
  static code = '116-072';

  setupCardAbilities(ability) {
    this.action({
      cost: ability.costs.exhaustSelf(),
      effect: ability.effects.heal(2)
    });
  }
  
  canAttach(player, card) {
    return card.isCharacter();
  }
}
