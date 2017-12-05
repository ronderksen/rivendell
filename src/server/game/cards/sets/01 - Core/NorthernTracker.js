import AllyCard from '../../ally-card';
import {afterCommitToQuest} from "../../../events";
import { cardTypes, locations } from '../../../constants';

export default class NorthernTracker extends AllyCard {
  static code = '01-045';
  setCardAbilities() {
    this.response({
      when: {
        [afterCommitToQuest]: (event) => event.target === this,
      },
      targets: card => card.getType() === cardTypes.location && card.location === locations.stagingArea,
      handler(context) {
        context.targets.forEach(target => {
          target.modifyProgress(1);
        });
        this.game.addMessage(`${this.owner.name} uses ${this.name} to put 1 progress token on each location in the staging area.`);
      }
    });
  }
}
