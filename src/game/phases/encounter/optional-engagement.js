import AllPlayerPrompt from '../../prompts/all-player-prompt';
import { cardTypes } from '../../constants';

export default class OptionalEngagementPrompt extends AllPlayerPrompt {
  activePrompt() {
    return {
      menuTitle: 'Select an enemy to engage',
      buttons: this.game
        .getStagingCards()
        .filter(c => c.type = cardTypes.enemy)
        .map(card => ({ arg: card.id, text: card.name })),
    };
  }

  waitingPrompt() {
    return {
      menuTitle: 'Waiting for other players to optionally engage an enemy',
    }
  }

  onMenuCommand(player, enemy) {
    const selectedEnemy = this.game.getStagingCards().find(c => c.id === enemy);
    this.game.addMessage(`${player.name} has engaged ${selectedEnemy.name}.`);
    this.game.raiseEvent('onEnemyEngaged', { player, enemy });
  }
}
