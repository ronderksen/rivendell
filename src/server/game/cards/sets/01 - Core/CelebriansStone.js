import AttachmentCard from '../../attachment-card';
import { spheres} from "../../../constants";

export default class CelebriansStone extends AttachmentCard {
    setupCardAbilities(ability) {
      this.whileAttached({
        effect: ability.effects.modifyWillpower(2)
      });
      this.whileAttached({
        match: card => card.name === 'Aragorn',
        effect: ability.effects.addSphere(spheres.spirit),
      });
    }
}
