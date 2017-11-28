import BaseStep from './base-step';

export default class SimpleStep extends BaseStep {
  constructor(game, continueFunc) {
    super(game);
    this.continueFunc = continueFunc;
  }

  continue() {
    return this.continueFunc();
  }

  getDebugInfo() {
    return { SimpleStep: this.continueFunc.toString() };
  }
}
