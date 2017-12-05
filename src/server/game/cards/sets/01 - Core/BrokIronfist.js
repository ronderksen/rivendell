import AllyCard from '../../ally-card';
import { cardTypes, traits } from '../../../constants'; 
import { onCharacterLeavesPlay } from '../../../events';

export default class BrokIronfist extends AllyCard {
  static code = '01-019';
  
  setupCardAbilities() {
    this.response({
      location: 'hand',
      when: {
        [onCharacterLeavesPlay]: event => (
          event.target.hasTrait(traits.dwarf) && event.target.hasType(cardTypes.hero)
        )
      },
      handler: () => {
        this.controller.putIntoPlay(this);
        this.game.addMessage(`${this.controller.name} uses ${this.name} to put ${this.name} into play`);
      } 
    })
  }
                     
} 
