import EventCard from '../../event-card';
import { cardTypes, locations, } from '../../../constants';

export default class ALightInTheDark extends EventCard {
  static cardCondition(card) {
    return (
      card.getType() === cardTypes.enemy &&
      card.location === locations.engagedArea
    );
  }

  constructor(owner, cardData) {
    super(owner, cardData);

    this.type = cardTypes.event;
  }

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
}
