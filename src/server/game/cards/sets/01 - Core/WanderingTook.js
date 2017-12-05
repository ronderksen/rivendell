import AllyCard from '../../ally-card';

export default class WanderingTook extends AllyCard {
  static code = '116-043';

  setCardAbilities(ability) {
    this.action({
      cost: ability.costs.modifyThreatCount(-3),
      choosePlayer: true,
      handler(context) {
        const sourceController = this.controller;
        this.controller = context.player;
        context.player.modifyThreatCount(3);
        this.game.addMessage(`${sourceController.name} gives ${this.name} to ${context.player.name} and lowers their threat by 3. 
        ${context.player.name} increases their threat by 3.`);
      }
    })
  }
}
