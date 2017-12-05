import Phase from './phase';
import SimpleStep from './simple-step';
import ActionWindow from './action-window';

export default class ResourcePhase extends Phase {
  constructor(game) {
    super(game, 'resource');
    
    this.initialize([
      new SimpleStep(game, () => this.addResourcesToHeroes()),
      new SimpleStep(game, () => this.playerDrawCards()),
    ])
  }
  
  addResourcesToHeroes() {
    game.getHeroes().forEach(hero => {
      hero.addResources();
    });
  }
  
  playerDrawCards() {
    game.getPlayers().forEach(player => player.drawCards())
  }
} 
