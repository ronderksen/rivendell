import AllyCard from '../../ally-card';
import {onCharacterEntersPlay} from "../../../events";
import { cardTypes } from '../../../constants';

export default class MinerOfTheIronHills extends AllyCard {
  static code = '01-002';
  setCardAbilities() {
    this.response({
      when:{
        [onCharacterEntersPlay]: event => event.target === this
      },
      target: {
        activePromptTitle: 'Select Condition',
        cardCondition: card => card.getType() === cardTypes.condition && card.isAttached()
      },
      handler(context) {
        this.game.addMessage(`${this.owner.name} uses ${this.name} to remove ${context.target.name} from ${context.target.parent.name}`);
        context.target.discard();
      },
    })
  }
}
