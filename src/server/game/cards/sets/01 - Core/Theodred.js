import HeroCard from '../../hero-card';
import { afterCommitToQuest } from '../../../events';
import {cardTypes} from "../../../constants";

export default class Theodred extends HeroCard {
  static code = '116-002';

  setCardAbilities() {
    this.response({
      when: {
        [afterCommitToQuest]: event => event.target === this,
      },
      target: {
        activePromptTitle: 'Select a hero',
        cardCondition: card => card.getType() === cardTypes.hero && card.isCommittedToQuest(),
      },
      handler: context => {
        context.target.addResources(1)
      }
    });
  }
}
