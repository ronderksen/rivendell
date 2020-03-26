import BaseStep from "./base-step";

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

export default class BaseAbilityWindow extends BaseStep {
  constructor(game, properties) {
    super(game);
    this.abilityChoices = [];
    this.events = flatten([properties.event]);
    this.abilityType = properties.abilityType;
  }

  canTriggerAbility(ability) {
    return ability.eventType === this.abilityType && this.events.every(event => ability.isTriggeredByEvent(event));
  }

  emitEvents() {
    this.events.forEach(event => {
      this.game.emit(`${event.name}:${this.abilityType}`, ...event.params);
    });
  }

  registerAbilityForEachEvent(ability) {
    const matchingEvents = this.events.filter(event => ability.isTriggeredByEvent(event));
    matchingEvents.forEach(event => {
      this.registerAbility(ability, event);
    });
  }
}
