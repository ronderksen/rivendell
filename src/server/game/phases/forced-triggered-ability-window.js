import uuid from 'uuid';
import BaseAbilityWindow from "./base-ability-window";
import TriggeredAbilityWindowTitles from "./triggered-ability-window-titles";

function byProperty(propertyName) {
  return (a, b) => {
    if (a[propertyName] > b[propertyName]) {
      return 1;
    } else if (a[propertyName] < b[propertyName]) {
      return -1;
    }
    return 0;
  }
}

export default class ForcedTriggeredAbilityWindow extends BaseAbilityWindow {
  registerAbility(ability, event) {
    const context = ability.createContext(event);
    const player = ability.card.controller;
    this.abilityChoices.push({
      id: uuid.v1(),
      card: ability.card,
      player,
      ability,
      context
    });
  }

  continue() {
    this.abilityChoices = this.abilityChoices.filter(abilityChoice => abilityChoice.ability.meetsRequirements(abilityChoice.context));

    if(this.abilityChoices.length > 1) {
      this.promptPlayer();
      return false;
    }

    this.abilityChoices.forEach(abilityChoice => {
      this.game.resolveAbility(abilityChoice.ability, abilityChoice.context);
    });

    return true;
  }

  promptPlayer() {
    const buttons = Object.values(this.abilityChoices)
      .map(abilityChoice => {
        const title = `${abilityChoice.player.name} - ${abilityChoice.card.name}`;
        return {
          text: title,
          method: 'chooseAbility',
          arg: abilityChoice.id,
          card: abilityChoice.card
        };
      })
      .sort(byProperty('text'))
      .value();

    this.game.promptWithMenu(this.game.getFirstPlayer(), this, {
      activePrompt: {
        menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events[0]),
        buttons
      },
      waitingPromptTitle: 'Waiting for opponents to resolve forced abilities'
    });
  }

  chooseAbility(player, id) {
    const choice = this.abilityChoices.find(ability => ability.id === id);

    if(!choice) {
      return false;
    }
    if(this.abilityType === 'whenrevealed') {
      this.game.addMessage('{0} has chosen to resolve first the when revealed ability of {1}\'s {2}',
        player, choice.player.name, choice.card.name);
    }

    this.game.resolveAbility(choice.ability, choice.context);
    this.abilityChoices = this.abilityChoices.filter(ability => ability.card !== choice.card);

    return true;
  }
}
