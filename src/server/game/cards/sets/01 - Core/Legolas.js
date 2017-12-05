import HeroCard from '../../hero-card';
import { onEnemyKilled } from '../../../events';

export default class Legolas extends HeroCard {
  static code = '01-005';

  setCardAbilities(ability) {
    this.response({
      when: {
        [onEnemyKilled]: event => event.attackers.includes(this),
      },
      effect: ability.effects.modifyProgress(2, this.game.scenario.getActiveLocation(true)),
    });
  }
}
