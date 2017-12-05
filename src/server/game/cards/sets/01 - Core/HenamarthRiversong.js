import AllyCard from '../../ally-card';

export default class HenamarthRiversong extends AllyCard {
  static code = '116-060';

  setupCardAbilities(ability) {
    this.action({
      cost: ability.costs.exhaustSelf(),
      handler() {
        const topCard = this.game.scenario.searchEncounterDeck(1);

        const buttons = [
          {method: 'done', card: topCard},
        ];

        this.game.promptWithMenu(this.controller, this, {
          activePrompt: {
            menuTitle: 'Click card when done',
            buttons
          },
          source: this
        });
      }
    });
  }

  done() {
    this.game.addMessage(`${this.controller.name} exhausts ${this.name} to view the top card of the encounter deck`);
    return true;
  }
}
