import GamePipeline from '../game-pipeline';
import BaseStep from './base-step';
import SimpleStep from './simple-step';

export default class Phase extends BaseStep {
  constructor(game, name) {
    super(game);
    this.name = name;
    this.pipeline = new GamePipeline();
  }

  initialize(steps) {
    this.pipeline.initialize([
      new SimpleStep(this.game, () => this.startPhase()),
      ...steps,
      new SimpleStep(this.game, () => this.endPhase()),
    ]);
  }

  queueStep(step) {
    this.pipeline.queueStep(step);
  }

  isComplete() {
    return this.pipeline.length === 0;
  }

  onCardClicked(player, card) {
    return this.pipeline.handleCardClicked(player, card);
  }

  onMenuCommand(player, arg, method) {
    return this.pipeline.handleMenuCommand(player, arg, method);
  }

  cancelStep() {
    this.pipeline.cancelStep();
  }

  continue() {
    return this.pipeline.continue();
  }

  startPhase() {
    this.game.currentPhase = this.name;
    this.game.getPlayers().forEach(player => {
      player.phase = this.name;
    });
    this.game.reapplyStateDependentEffects();
    this.game.raiseEvent('onPhaseStarted', { phase: this.name });
  }

  endPhase() {
    this.game.raiseEvent('onPhaseEnded', { phase: this.name });
    this.game.currentPhase = '';
    this.game.getPlayers().forEach(player => {
      player.phase = '';
    });
    this.game.raiseEvent('onAtEndOfPhase');
  }
}
