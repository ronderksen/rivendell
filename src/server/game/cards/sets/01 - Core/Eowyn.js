import HeroCard from '../../hero-card';

export default class Eowyn extends HeroCard {
    setCardAbilities(ability) {
        this.action({
          cost: ability.costs.discard(1),
          controller: 'any',
          effect: ability.effects.modifyWillpower(1),
        })
    }
}
