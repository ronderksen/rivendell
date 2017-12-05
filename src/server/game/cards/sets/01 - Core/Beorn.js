import AllyCard from '../../ally-card';

export default class Beorn extends AllyCard {
  static code = '01-031';

  setupCardAbilities() {
    this.action({
      target: this,
      handler: context => {
        this.untilEndOfPhase(ability => ({
          match: context.target,
          effect: ability.effects.modifyAttack(5)
        }))
      }
    })
  }
}
