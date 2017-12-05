import HeroCard from '../../hero-card';
import { phases } from '../../../constants';
import { afterCommitToQuest } from '../../../events';

export default class Aragorn extends HeroCard {
  static code = '116-001';

  setupCardAbilities(ability) {
    // After Aragorn commits to a quest, spend 1 resource from his resource pool to ready him.
    this.response({
      when: {
        [afterCommitToQuest]: (event) => (
          event.target === this &&
          this.game.currentPhase === phases.quest
        )
      },
      cost: ability.costs.payResource(1),
      handler: card => card.ready()
    });
  }
}
