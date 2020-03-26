import Phase from './phase';
import SelectFirstPlayerPrompt from './setup/select-first-player';
import KeepOrMulliganPrompt from './setup/keep-or-mulligan';
import SimpleStep from './simple-step';
import { onHeroSetup } from '../events';
import {phases} from "../constants";

export default class SetupPhase extends Phase {
  constructor(game) {
    super(game, phases.setup);
    this.players = this.game.getPlayers();
    this.initialize([
      new SimpleStep(game, () => this.setupHeroes()),
      new SelectFirstPlayerPrompt(game, this.players[0]),
      new SimpleStep(game, () => this.drawSetupHand()),
      new KeepOrMulliganPrompt(game),
      new SimpleStep(game, () => { console.log('setupQuestCards'); this.setupQuestCards() }),
      new SimpleStep(game, () => this.applyQuestSetupInstructions()),
      new SimpleStep(game, () => this.startGame()),
      new SimpleStep(game, () => this.setupDone())
    ]);
  }

  setupHeroes() {
    this.game.raiseEvent(onHeroSetup);
    this.players.forEach(player => {
      player.heroes.forEach(hero => hero.applyPersistentEffects());
    });
  }

  drawSetupHand() {
    this.players.forEach(player => {
      player.drawCardsToHand(6);
    });
  }

  setupQuestCards() {
    this.game.activeStage = this.game.questCards[0].getStage('A');
  }

  applyQuestSetupInstructions() {
    // TODO
  }

  startGame() {
    this.players.forEach(player => player.startGame());
  }

  setupDone() {
    this.players.forEach(player => player.setupDone());
  }
}
