import Phase from './phase';
import SimpleStep from './simple-step';
import { cardTypes } from '../constants';

function byThreatValue(a, b) {
  if (a.threat > b.threat) {
    return 1;
  } else if (a.threat < b.threat) {
    return -1;
  }
  return 0;
}

export default class EngagementPhase extends Phase {
  constructor(game) {
    super(game, 'engagement');

    this.initialize([
      // OptionalEngagementPrompt(),
      new SimpleStep(game, () => this.engageEnemies()),
    ])
  }

  engageEnemies() {
    const stagedEnemies = this.game.getStagedCards()
      .filter(c => c.type = cardTypes.enemy)
      .sort(byThreatValue);
    let players = this.game.getPlayersInFirstPlayerOrder();
    const ignoredPlayers = new Set();

    while (stagedEnemies.length > 0 && players.length > 0) {
      players = players
        .filter(p => !ignoredPlayers.has(p));
      players
        .forEach(player => {
          if (stagedEnemies.length > 0) {
            if (!this.makeEngagementCheck(player, stagedEnemies)) {
              ignoredPlayers.add(player);
            }
          }
        });
    }
  }

  makeEngagementCheck(player, stagedEnemies) {
    return stagedEnemies.some(enemy => {
      if (enemy.threat <= player.threatCount) {
        player.engagedEnemies.push(enemy);
        stagedEnemies.shift();
        return true;
      }
      return false;
    });
  }
}
