import EventCard from '../../event-card';
import {cardTypes, locations,} from '../../../constants';

export default class ALightInTheDark extends EventCard {
  static code = '01-052';
  //  Choose an enemy engaged with a player. Return that enemy to the staging area.
  setupCardAbilities() {
    this.action({
      target: {
        activePromptTitle: 'Select engaged enemy',
        cardCondition: card => this.cardCondition(card),
      },
      handler: context => {
        context.target.addToStagingArea();
        this.game.addMessage(`${context.player.name} uses ${this.name} to return ${context.target.name} to the staging area.`)
      }
    });
  }

  cardCondition(card) {
    return (
      card.getType() === cardTypes.enemy &&
      card.location === locations.engagedArea &&
      card.target === this.controller
    );
  }
}
