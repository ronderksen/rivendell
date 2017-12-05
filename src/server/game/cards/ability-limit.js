class FixedAbilityLimit {
  constructor(max) {
    this.max = max;
    this.useCount = 0;
  }

  isRepeatable() {
    return false;
  }

  isAtMax() {
    return this.useCount >= this.max;
  }

  increment() {
    this.useCount += 1;
  }

  reset() {
    this.useCount = 0;
  }

  registerEvents() {

  }

  unregisterEvents() {

  }
}

class RepeatableAbilityLimit extends FixedAbilityLimit {
  constructor(max, eventName) {
    super(max);

    this.eventName = eventName;
    this.resetHandler = () => this.reset();
  }

  isRepeatable() {
    return true;
  }

  registerEvents(eventEmitter) {
    eventEmitter.on(this.eventName, this.resetHandler);
  }

  unregisterEvents(eventEmitter) {
    eventEmitter.removeListener(this.eventName, this.resetHandler);
    this.reset();
  }
}

const AbilityLimit = {
  fixed(max) {
    return new FixedAbilityLimit(max);
  },
  repeatable(max, eventName) {
    return new RepeatableAbilityLimit(max, eventName);
  },
  perPhase(max) {
    return new RepeatableAbilityLimit(max, 'onPhaseEnded');
  },
  perRound(max) {
    return new RepeatableAbilityLimit(max, 'onRoundEnded');
  },
};

export default AbilityLimit;
