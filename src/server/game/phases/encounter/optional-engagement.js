import PlayerOrderPrompt from '../../prompts/player-order-prompt';
import { cardTypes } from '../../constants';
import { onEnemyEngaged } from '../../events';

export default class OptionalEngagementPrompt extends PlayerOrderPrompt {
  activePrompt() {
    return {
      menuTitle: 'Select an enemy to engage',
      buttons: this.game
        .getStagingCards()
        .filter(c => c.type === cardTypes.enemy)
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
    this.game.raiseEvent(onEnemyEngaged, { player, enemy });
  }
}
