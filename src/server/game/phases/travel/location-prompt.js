import UiPrompt from "../../prompts/ui-prompt";
import {cardTypes} from '../../constants';

export default class LocationPrompt extends UiPrompt {
  constructor(game, player) {
    super(game);
    this.player = player;
  }

  activeCondition(player) {
    return this.player === player;
  }

  activePrompt() {
    const buttons = this.game.getStagedCards()
      .filter(card => card.getType() === cardTypes.location)
      .map(card => ({arg: card, text: card.name}))
      .concat({text: 'None', arg: null});

    return {
      menuTitle: 'Select a location',
      buttons
    };
  }

  waitingPrompt() {
    return {menuTitle: `Waiting for ${this.player.name} to finish choosing a location to travel to`};
  }

  onMenuCommand(player, card) {
    if (this.player !== player) {
      return false;
    }

    if (this.card) {
      this.game.addMessage('{0} has chosen {1}', player, card);
    } else {
      this.game.addMessage('{0} has chosen to not travel to a location', player);
    }
    this.complete();
    return true;
  }
}
