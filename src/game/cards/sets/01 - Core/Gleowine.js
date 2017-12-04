import AllyCard from '../../ally-card';

export default class Gleowine extends AllyCard {
  setCardAbilities() {
    this.action({
      choosePlayer: true,
      handler: context => {
        context.player.drawCards(1);
        this.game.addMessage(`${this.owner.name} uses ${this.name} to let ${context.player.name} draw a card`);
      }
    })
  }
}
