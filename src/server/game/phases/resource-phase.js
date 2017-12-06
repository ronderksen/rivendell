import Phase from './phase';
import SimpleStep from './simple-step';
import ActionWindow from './action-window';

export default class ResourcePhase extends Phase {
  constructor(game) {
    super(game, 'resource');

    this.initialize([
      new SimpleStep(this.game, () => this.addResourcesToHeroes()),
      new SimpleStep(this.game, () => this.playerDrawCards()),
      new ActionWindow(this.game, 'After resource phase', 'Resource'),
    ])
  }

  addResourcesToHeroes() {
    this.game.getHeroes().forEach(hero => {
      hero.addResources();
    });
  }

  playerDrawCards() {
    this.game.getPlayers().forEach(player => player.drawCards())
  }
}
