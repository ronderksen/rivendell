import AllyCard from '../../ally-card';
import {onCharacterEntersPlay} from '../../../events';
import {cardTypes, traits} from "../../../constants";

export default class LongbeardOrcSlayer extends AllyCard {
  static code = '01-018';

  setCardAbilities(ability) {
    this.response({
      when: {
        [onCharacterEntersPlay]: event => event.target === this,
      },
      targets: {
        cardCondition: card => this.cardCondition(card)
      },
      effect: ability.costs.modifyWounds(1)
    });
  }

  cardCondition(card) {
    return (
      card.getType() === cardTypes.enemy &&
      card.isInPlay() &&
      card.hasTrait(traits.orc)
  )
  }
}
