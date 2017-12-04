import HeroCard from '../../hero-card';
import { onEnemyKilled } from '../../../events';

export default class Legolas extends HeroCard {
  setCardAbilities(ability) {
    this.response({
      when: {
        [onEnemyKilled]: event => event.attackers.includes(this),
      },
      effect: ability.effects.addProgress(2, this.game.scenario.getActiveQuest()),
    })
  }
}
