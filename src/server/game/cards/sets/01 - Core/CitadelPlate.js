import AttachmentCard from "../../attachment-card";

export default class CitadelPlate extends AttachmentCard {
    setupCardAbilities(ability) {
      this.whileAttached({
        effect: ability.effects.modifyHitpoints(4),
      });
    }
}
