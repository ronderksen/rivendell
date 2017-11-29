export default class GamePipeline {
  constructor() {
    this.pipeline = [];
    this.queue = [];
  }

  initialize(steps) {
    if(!Array.isArray(steps)) {
      steps = [steps];
    }

    this.pipeline = steps;
  }

  get length() {
    return this.pipeline.length;
  }

  getCurrentStep() {
    const [step] = this.pipeline;

    if(typeof step === 'function') {
      const createdStep = step();
      this.pipeline[0] = createdStep;
      return createdStep;
    }

    return step;
  }

  queueStep(step) {
    if(this.pipeline.length === 0) {
      this.pipeline.unshift(step);
    } else {
      const currentStep = this.getCurrentStep();
      if(currentStep.queueStep) {
        currentStep.queueStep(step);
      } else {
        this.queue.push(step);
      }
    }
  }

  cancelStep() {
    if(this.pipeline.length === 0) {
      return;
    }

    const step = this.getCurrentStep();

    if(step.cancelStep && step.isComplete) {
      step.cancelStep();
      if(!step.isComplete()) {
        return;
      }
    }

    this.pipeline.shift();
  }

  handleCardClicked(player, card) {
    if(this.pipeline.length > 0) {
      const step = this.getCurrentStep();
      if(step.onCardClicked(player, card) !== false) {
        return true;
      }
    }

    return false;
  }

  handleMenuCommand(player, arg, method) {
    if(this.pipeline.length > 0) {
      var step = this.getCurrentStep();
      if(step.onMenuCommand(player, arg, method) !== false) {
        return true;
      }
    }

    return false;
  }

  continue() {
    while(this.pipeline.length > 0) {
      const currentStep = this.getCurrentStep();

      // Explicitly check for a return of false - if no return values is
      // defined then just continue to the next step.
      if(currentStep.continue() === false) {
        if(this.queue.length === 0) {
          return false;
        }
      } else {
        const [_, ...rest] = this.pipeline;
        this.pipeline = rest;
      }
      this.pipeline = this.queue.concat(this.pipeline);
      this.queue = [];
    }
    return true;
  }

  getDebugInfo() {
    return {
      pipeline: this.pipeline.map(step => this.getDebugInfoForStep(step)),
      queue: this.queue.map(step => this.getDebugInfoForStep(step))
    };
  }

  getDebugInfoForStep(step) {
    let name = step.constructor.name;
    if(step.pipeline) {
      return {
        [name]: step.pipeline.getDebugInfo()
      };
    }

    if(step.getDebugInfo) {
      return step.getDebugInfo();
    }

    if(typeof step === 'function') {
      return step.toString();
    }

    return name;
  }
}
