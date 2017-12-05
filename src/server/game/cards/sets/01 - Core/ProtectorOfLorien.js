import AttachmentCard from '../../attachment-card';
import {cardTypes} from "../../../constants";

export default class ProtectorOfLorien extends AttachmentCard {
  static code = '116-070';

  setupCardAbilities(ability) {
    this.action({
      cost: ability.costs.discardCardFromHand(),
      handler: () => {
        this.untilEndOfPhase({
          match: this.parent,
          handler: () => {
            const buttons = [
              { text: '+1 defense', method: 'addDefense' },
              { text: '+1 willpower', method: 'addWillpower' }
            ];

            this.game.promptWithMenu(this.parent.controller, this, {
              activePrompt: {
                menuTitle: `Select choice for ${this.name}`,
                buttons
              }
            });
          }
        })
      }
    });
  }

  canAttach(player, card) {
    return card.getType === cardTypes.hero;
  }

  addDefense() {
    this.parent.modifyDefense(1);
    this.game.addMessage(`${this.controller.name} uses ${this.name} to add 1 defense until the end of phase for ${this.parent.name}`);
  }

  addWillpower() {
    this.parent.addWillpower(1);
    this.game.addMessage(`${this.controller.name} uses ${this.name} to add 1 willpower until the end of phase for ${this.parent.name}`);
  }
}
