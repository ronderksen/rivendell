import AllyCard from '../../ally-card';
import { onCharacterEntersPlay } from '../../../events';
import { cardTypes } from '../../../constants';

export default class SonOfArnor extends AllyCard {
  static code = '116-015';

  setupCardAbilities() {
    this.response({
      when: {
        [onCharacterEntersPlay]: event => event.target === this
      },
      target: {
        activePromptTitle: 'Select an enemy',
        cardCondition: card => card.getType() === cardTypes.enemy && card.isInPlay()
      },
      handler(context) {
        this.controller.engage(context.target);
        this.game.addMessage(`${this.controller.name} uses ${this.name} to engage ${context.target.name}.`);
      }
    })
  }
}
