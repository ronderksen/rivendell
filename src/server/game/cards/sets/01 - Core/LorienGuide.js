import AllyCard from '../../ally-card';
import { afterCommitToQuest } from '../../../events';

export default class LorienGuide extends AllyCard {
  static code = '116-044';

  setCardAbilities(ability) {
    this.response({
      when: {
        [afterCommitToQuest]: (event) => event.target === this,
      },
      target: this.game.getActiveLocation(),
      effect: ability.effects.modifyProgress(1)
    })
  }
}
