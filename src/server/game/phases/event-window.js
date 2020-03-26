import BaseStep from "./base-step";
import GamePipeline from "../game-pipeline";
import SimpleStep from "./simple-step";
import Event from "../event";

export default class EventWindow extends BaseStep {
  constructor(game, eventName, params, handler, merged = false) {
    super(game);

    this.eventName = eventName;
    this.handler = handler;

    this.event = new Event(eventName, params, merged);
    this.pipeline = new GamePipeline();
    this.pipeline.initialize([
      new SimpleStep(game, () => this.cancelInterrupts()),
      new SimpleStep(game, () => this.interrupts()),
      new SimpleStep(game, () => this.executeHandler()),
      new SimpleStep(game, () => this.forcedReactions()),
      new SimpleStep(game, () => this.reactions())
    ]);
  }

  queueStep(step) {
    this.pipeline.queueStep(step);
  }

  isComplete() {
    console.log(this.pipeline.length);
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

  cancelInterrupts() {
    this.game.openAbilityWindow({
      abilityType: 'cancelinterrupt',
      event: this.event
    });
  }

  interrupts() {
    if(this.event.cancelled) {
      return;
    }

    this.game.openAbilityWindow({
      abilityType: 'interrupt',
      event: this.event
    });
  }

  executeHandler() {
    if(this.event.cancelled) {
      return;
    }

    this.event.executeHandler(this.handler);

    if(this.event.cancelled) {
      return;
    }

    this.game.emit(this.eventName, ...this.event.params);
  }

  forcedReactions() {
    if(this.event.cancelled) {
      return;
    }

    this.game.openAbilityWindow({
      abilityType: 'forcedreaction',
      event: this.event
    });
  }

  reactions() {
    if(this.event.cancelled) {
      return;
    }

    this.game.openAbilityWindow({
      abilityType: 'reaction',
      event: this.event
    });
  }
}
