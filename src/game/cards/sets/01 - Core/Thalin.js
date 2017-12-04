import HeroCard from '../../hero-card';
import { onEncounterCardRevealed } from '../../../events';

export default class Thalin extends HeroCard {
  setCardAbilities() {
    this.forcedinterrupt({
      when: {
        [onEncounterCardRevealed]: event => this.isCommittedToQuest() && event.target.isEnemy(),
      },
      handler: context => context.event.target.addWounds(1)
    });
  }
}
