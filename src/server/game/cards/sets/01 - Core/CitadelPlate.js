import AttachmentCard from "../../attachment-card";

export default class CitadelPlate extends AttachmentCard {
  static code = '116-040';

  setupCardAbilities(ability) {
    this.whileAttached({
      effect: ability.effects.modifyHitpoints(4),
    });
  }
}
