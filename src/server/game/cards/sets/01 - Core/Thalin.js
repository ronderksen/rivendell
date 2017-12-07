import HeroCard from '../../hero-card';
import { onEncounterCardRevealed } from '../../../events';

export default class Thalin extends HeroCard {
  static code = '116-006';

  setupCardAbilities() {
    this.interrupt({
      when: {
        [onEncounterCardRevealed]: event => this.isCommittedToQuest() && event.target.isEnemy(),
      },
      handler: context => context.event.target.modifyWounds(1)
    });
  }
}
