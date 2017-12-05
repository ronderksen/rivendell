import AllyCard from '../../ally-card';
import { onCharacterEntersPlay } from '../../../events';
import { cardTypes } from '../../../constants';

export default class SnowbournScout extends AllyCard {
  static code = '116-016';

  setCardAbilities(ability) {
    this.response({
      when: {
        [onCharacterEntersPlay]: event => event.target === this,
      },
      target: {
        activePromptTitle: 'Choose a location',
        cardCondition: card => card.getType() === cardTypes.location && card.isInPlay()
      },
      effect: ability.effects.modifyProgress(1)
    })
  }
}
