import AllyCard from '../../ally-card';

export default class Beorn extends AllyCard {
  setupCardAbilities() {
    this.action({
      target: this,
      handler: context => {
        this.untilEndOfPhase(ability => ({
          match: context.event.target,
          effect: ability.effects.modifyAttack(5)
        }))
      }
    })
  }
}
