import HeroCard from '../../hero-card';
import {onCharacterDamage} from '../../../events';

export default class Gloin extends HeroCard {
  setCardAbilities() {
    this.response({
      when: {
        [onCharacterDamage]: event => event.target === this,
      },
      handler: context => {
        this.addResources(context.event.wounds);
        this.game.addMessage(`${this.name} gains ${context.event.wounds} resources after taking damage`);
      }
    })
  }
}
