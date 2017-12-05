import AllyCard from '../../ally-card';
import { onCharacterEntersPlay, onEndRound } from '../../../events';

export default class Gandalf extends AllyCard {
  static code = '01-073';

  setCardAbilities() {
    this.response({
      when: {
        [onCharacterEntersPlay]: event => event.target === this,
      },
      handler() {
        this.game.promptWithMenu(this.controller, this, {
          activePrompt: {
            menuTitle: 'Choose Gandalf\'s effect',
            buttons: [
              { text: 'Draw 3 cards', method: 'drawCards' },
              { text: 'Deal 4 damage to one enemy in play', method: 'dealDamage' },
              { text: 'Reduce your threat by 5', method: 'reduceThreat' }
            ]
          },
          source: this
        });
      }
    });

    this.response({
      when: {
        [onEndRound]: () => true,
      },
      handler() {
        if (this.isInPlay()) {
          this.owner.returnCardToHand(this)
        }
      }
    })
  }

  drawCards() {
    this.owner.drawCards(3);
    this.game.addMessage(`${this.owner.name} uses ${this.name} to draw 3 cards`);
  }

  dealDamage() {
    const buttons = this.game.scenario.encounterCards.reduce((acc, card) => {
      if (card.isInPlay()) {
        acc.push({method: 'enemySelected', card});
      }
      return acc;
    }, []);

    this.game.promptWithMenu(this.controller, this, {
      activePrompt: {
        menuTitle: 'Select a card',
        buttons
      },
      source: this
    });
  }
  enemySelected(enemy) {
    enemy.modifyWounds(4);
    this.game.addMessage(`${this.owner.name} uses ${this.name} to deal 4 damage to ${enemy.name}`);
  }

  reduceThreat() {
    this.owner.modifyThreatCount(-5);
    this.game.addMessage(`${this.owner.name} uses ${this.name} to reduce their threat by 5`);
  }
}
