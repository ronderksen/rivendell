import uuid from 'uuid';
import BaseAbilityWindow from "./base-ability-window";
import TriggeredAbilityWindowTitles from "./triggered-ability-window-titles";

export default class TriggeredAbilityWindow extends BaseAbilityWindow {
  constructor(game, properties) {
    super(game, properties);

    this.forceWindowPerPlayer = {};

    game.getPlayersInFirstPlayerOrder().forEach(player => {
      if(this.isCancellableEvent(player)) {
        this.forceWindowPerPlayer[player.name] = true;
      }
    });
  }

  registerAbility(ability, event) {
    const context = ability.createContext(event);
    const { player } = context;
    const choiceTexts = ability.getChoices(context);
    const abilityGroupId = uuid.v1();

    choiceTexts.forEach(choiceText => {
      this.abilityChoices.push({
        id: uuid.v1(),
        abilityGroupId,
        player,
        ability,
        card: ability.card,
        text: choiceText.text,
        choice: choiceText.choice,
        context
      });
    });
  }

  continue() {
    this.players = this.filterChoicelessPlayers(this.players || this.game.getPlayersInFirstPlayerOrder());

    if(this.players.length === 0 || Object.values(this.abilityChoices).length === 0 && !this.forceWindowPerPlayer[this.players[0].name]) {
      return true;
    }

    this.promptPlayer(this.players[0]);

    return false;
  }

  isTimerEnabled(player) {
    return !player.noTimer && player.user.settings.windowTimer !== 0;
  }

  isWindowEnabledForEvent(player, event) {
    const eventsEnabled = player.timerSettings.events;
    const abilitiesEnabled = player.timerSettings.abilities;

    if(event.name === 'onCardAbilityInitiated') {
      if(event.source.getType() === 'event') {
        return eventsEnabled;
      }

      return abilitiesEnabled;
    }

    // Must be onClaimApplied, which we tie to events setting
    return eventsEnabled;
  }

  isCancellableEvent(player) {
    const cancellableEvents = {
      onCardAbilityInitiated: 'cancelinterrupt',
      onClaimApplied: 'interrupt'
    };

    return this.isTimerEnabled(player) &&this.events.every(event =>
      event.player !== player &&
      cancellableEvents[event.name] &&
      cancellableEvents[event.name] === this.abilityType &&
      this.isWindowEnabledForEvent(player, event)
    );
  }

  filterChoicelessPlayers(players) {
    return players.filter(player =>
      this.isCancellableEvent(player) ||
      this.abilityChoices.every(abilityChoice => this.eligibleChoiceForPlayer(abilityChoice, player)));
  }

  eligibleChoiceForPlayer(abilityChoice, player) {
    return abilityChoice.player === player && abilityChoice.ability.meetsRequirements(abilityChoice.context);
  }

  promptPlayer(player) {
    const choicesForPlayer = this.getChoicesForPlayer(player);
    const buttons = choicesForPlayer.map(abilityChoice => {
      let title = abilityChoice.card.name;
      if(abilityChoice.text !== 'default') {
        title += ` - ${abilityChoice.text}`;
      }

      return { text: title, method: 'chooseAbility', arg: abilityChoice.id, card: abilityChoice.card };
    });

    if(this.isCancellableEvent(player)) {
      buttons.push({ timer: true, method: 'pass', id: uuid.v1() });
      buttons.push({ text: 'I need more time', timerCancel: true });
      buttons.push({ text: 'Don\'t ask again until end of round', timerCancel: true, method: 'pass', arg: 'pauseRound' });
    }

    buttons.push({ text: 'Pass', method: 'pass' });
    this.game.promptWithMenu(player, this, {
      activePrompt: {
        menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events[0]),
        buttons,
        controls: this.getAdditionalPromptControls()
      },
      waitingPromptTitle: 'Waiting for opponents'
    });

    this.forceWindowPerPlayer[player.name] = false;
  }

  getAdditionalPromptControls() {
    const controls = [];
    this.events.forEach(event => {
      if(event.name === 'onCardAbilityInitiated' && event.targets.length > 0) {
        controls.push({
          type: 'targeting',
          source: event.source.getShortSummary(),
          targets: event.targets.map(target => target.getShortSummary())
        });
      }
    });

    return controls;
  }

  getChoicesForPlayer(player) {
    const choices = this.abilityChoices.filter(abilityChoice => {
      try {
        return this.eligibleChoiceForPlayer(abilityChoice, player);
      } catch(e) {
        this.abilityChoices = this.abilityChoices.filter(a => a !== abilityChoice);
        this.game.reportError(e);
        return false;
      }
    });
    // Cards that have a maximum should only display a single choice by
    // title even if multiple copies are available to be triggered.
    return choices;
    // return _.uniq(choices, choice => choice.ability.hasMax() ? choice.card.name : choice);
  }

  chooseAbility(player, id) {
    const choice = this.abilityChoices.find(ability => ability.id === id);

    if(!choice || choice.player !== player) {
      return false;
    }

    choice.context.choice = choice.choice;
    this.game.resolveAbility(choice.ability, choice.context);

    this.abilityChoices = this.abilityChoicesfilter(ability => ability.abilityGroupId !== choice.abilityGroupId);

    // Always rotate player order without filtering, in case an ability is
    // triggered that could then make another ability eligible after it is
    // resolved: e.g. Rains of Castamere into Wardens of the West
    this.players = this.rotatedPlayerOrder(player);

    return true;
  }

  pass(player, arg) {
    if(arg === 'pauseRound') {
      player.noTimer = true;
      player.resetTimerAtEndOfRound = true;
    }

    this.players.shift();
    return true;
  }

  rotatedPlayerOrder(player) {
    const players = this.game.getPlayersInFirstPlayerOrder();
    const splitIndex = players.indexOf(player);
    const beforePlayer = players.slice(0, splitIndex);
    const afterPlayer = players.slice(splitIndex + 1);
    return afterPlayer.concat(beforePlayer).concat([player]);
  }
}
