import EventEmitter from 'events';
import GameChat from './game-chat';
import GamePipeline from './game-pipeline';
import Player from './player';
import Spectator from './spectator';
import Scenario from './scenario';
import phases from './phases';
import {onBeginRound} from './events';
import ForcedTriggeredAbilityWindow from "./phases/forced-triggered-ability-window";
import TriggeredAbilityWindow from "./phases/triggered-ability-window";

export default class GameEngine extends EventEmitter {
  constructor(details, options = {}) {
    super();
    this.gameChat = new GameChat();
    this.playersAndSpectators = {};
    this.playerHeroes = {};
    this.playerCards = {};
    this.encounterCards = {};
    this.questCards = {};
    this.scenarioId = details.scenarioId;
    this.pipeline = new GamePipeline();
    this.id = details.id;
    this.name = details.name;
    this.allowSpectators = details.allowSpectators;
    this.owner = details.owner.username;
    this.started = false;
    this.playStarted = false;
    this.createdAt = new Date();
    this.savedGameId = details.savedGameId;
    this.difficulty = details.difficulty;
    this.abilityCardStack = [];
    this.abilityWindowStack = [];
    this.password = details.password;
    this.cancelPromptUsed = false;
    this.skipPhase = {};

    this.playersAndSpectators = details.players.reduce((acc, player) => {
      acc[player.user.username] = new Player(player.id, player.user, this.owner === player.user.username, this);
      return acc;
    }, this.playersAndSpectators);

    this.playersAndSpectators = details.spectators.reduce((acc, spectator) => {
      acc[spectator.user.username] = new Spectator(spectator.id, spectator.user, this);
      return acc;
    }, this.playersAndSpectators);

    this.scenario = new Scenario(this.scenarioId);

    this.setMaxListeners(0);

    this.pushAbilityContext('framework', null, 'framework');
  }

  reportError(e) {
    this.router.handleError(this, e);
  }

  addMessage(...args) {
    this.gameChat.addChatMessage(...args);
  }

  addAlert(...args) {
    this.gameChat.addAlert(...args);
  }

  get messages() {
    return this.gameChat.messages;
  }

  isSpectator(player) {
    return player.constructor === Spectator;
  }

  hasActivePlayer(playerName) {
    return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
  }

  getPlayers() {
    return Object.values(this.playersAndSpectators).filter(player => !this.isSpectator(player));
  }

  getPlayerByName(playerName) {
    const player = this.playersAndSpectators[playerName];

    if (!player || this.isSpectator(player)) {
      return null;
    }

    return player;
  }

  getPlayersInFirstPlayerOrder() {
    return this.getPlayersInBoardOrder(player => player.firstPlayer);
  }

  getPlayersInBoardOrder(predicate) {
    const players = this.getPlayers();
    const index = players.findIndex(predicate);
    if (index === -1) {
      return players;
    }

    const beforeMatch = players.slice(0, index);
    const matchAndAfter = players.slice(index);

    return matchAndAfter.concat(beforeMatch);
  }

  getPlayersAndSpectators() {
    return this.playersAndSpectators;
  }

  getSpectators() {
    return Object.values(this.playersAndSpectators).filter(player => this.isSpectator(player));
  }

  getFirstPlayer() {
    return this.getPlayers().find(p => p.firstPlayer);
  }

  getOpponents(player) {
    return this.getPlayers().filter(p => p !== player);
  }

  findAnyCardInPlayByUuid(cardId) {
    return this.getPlayers().reduce((card, player) => {
      if (card) {
        return card;
      }

      return player.findCardInPlayByUuid(cardId);
    }, null);
  }

  findAnyCardInAnyList(cardId) {
    return this.allPlayerCards.find(card => card.uuid === cardId);
  }

  findAnyCardsInPlay(predicate) {
    return this.getPlayers().reduce((acc, player) => {
      acc.concat(player.findCards(player.cardsInPlay, predicate));
      return acc;
    }, []);
  }

  anyCardsInPlay(predicate) {
    return this.allPlayerCards.any(card => card.location === 'play area' && predicate(card));
  }

  filterCardsInPlay(predicate) {
    return this.allPlayerCards.filter(card => card.location === 'play area' && predicate(card));
  }

  selectDeck(playerName, deck) {
    const player = this.getPlayerByName(playerName);
    if (!player) {
      return;
    }
    player.selectDeck(deck);
  }

  shuffleDeck(playerName) {
    const player = this.getPlayerByName(playerName);
    if (!player) {
      return;
    }
    this.addAlert(`${playerName} is shuffling their draw deck`);
    player.shuffleDrawDeck();
  }

  initialize() {
    // check if all players are still present
    this.playersAndSpectators = Object.values(this.playersAndSpectators)
      .reduce((acc, player) => {
        if (!player.left) {
          acc[player.name] = player;
        }
        return acc;
      }, {});

    // initialize the players
    this.getPlayers().forEach(player => player.initialize());

    // get all player cards
    this.allPlayerCards = this.gatherAllCards();

    const {SetupPhase, SimpleStep} = phases;

    this.pipeline.initialize([
      new SetupPhase(this),
      new SimpleStep(this, () => this.beginRound()),
    ]);

    this.playStarted = true;
    this.startedAt = new Date();
    this.round = 0;
    this.continue();
  }

  gatherAllCards() {
    return this.getPlayers()
      .reduce((cards, player) => cards.concat(player.preparedDeck.allCards), [])
      .concat(
        this.scenario.drawDeck,
      );
  }

  beginRound() {
    const {
      ResourcePhase,
      PlanningPhase,
      QuestPhase,
      TravelPhase,
      EncounterPhase,
      CombatPhase,
      RefreshPhase,
      SimpleStep
    } = phases;

    this.raiseEvent(onBeginRound);
    this.queueStep(new ResourcePhase(this));
    this.queueStep(new PlanningPhase(this));
    this.queueStep(new QuestPhase(this));
    this.queueStep(new TravelPhase(this));
    this.queueStep(new EncounterPhase(this));
    this.queueStep(new CombatPhase(this));
    this.queueStep(new RefreshPhase(this));
    this.queueStep(new SimpleStep(this, () => this.beginRound()));
  }

  queueStep(step) {
    this.pipeline.queueStep(step);
  }

  queueSimpleStep(step) {
    this.pipeline.queueStep(new phases.SimpleStep(this, step));
  }

  continue() {
    this.pipeline.continue();
  }

  pushAbilityContext(source, card, stage) {
    this.abilityCardStack.push({source, card, stage});
  }

  applyGameAction(actionType, cards, func) {
    if (!Array.isArray(cards)) {
      cards = [cards]; // eslint-disable-line no-param-reassign
    }

    const [allowed, disallowed] = cards.reduce((acc, card) => {
      if (card.allowGameAction(actionType)) {
        acc[0].push(card)
      } else {
        acc[1].push(card);
      }
      return acc;
    }, [[], []]);

    if (disallowed.length === 0) {
      // TODO: add a cannot / immunity message.
    }

    if (allowed.length === 0) {
      return;
    }

    func(allowed);
  }

  reapplyStateDependentEffects() {
    // TODO: implement
  }

  raiseEvent(eventName, params, handler) {
    const {EventWindow} = phases;
    if (!handler) {
      handler = () => true; // eslint-disable-line no-param-reassign
    }

    this.queueStep(new EventWindow(this, eventName, params || {}, handler, true));
  }

  openAbilityWindow(properties) {
    const WindowClass = ['forcedreaction', 'forcedinterrupt', 'whenrevealed']
      .includes(properties.abilityType) ?
      ForcedTriggeredAbilityWindow :
      TriggeredAbilityWindow;

    const window = new WindowClass(this, {abilityType: properties.abilityType, event: properties.event});
    this.abilityWindowStack.push(window);
    window.emitEvents();
    this.queueStep(window);
    this.queueSimpleStep(() => this.abilityWindowStack.pop());
  }

  menuButton(playerName, arg, method) {
    const player = this.getPlayerByName(playerName);
    if(!player) {
      return false;
    }

    return this.pipeline.handleMenuCommand(player, arg, method);
  }

  cardClicked(sourcePlayer, cardId) {
    const player = this.getPlayerByName(sourcePlayer);

    if(!player) {
      return;
    }

    const card = this.findAnyCardInAnyList(cardId);

    if(!card) {
      return;
    }

    if(this.pipeline.handleCardClicked(player, card)) {
      return;
    }

    // Attempt to play cards that are not already in the play area.
    if(['hand', 'discard pile', 'dead pile'].includes(card.location) && player.playCard(card)) {
      return;
    }

    if(card.onClick(player)) {
      return;
    }

    if(!card.facedown && card.location === 'play area' && card.controller === player) {
      if(card.exhausted) {
        player.readyCard(card);
      } else {
        player.exhaustCard(card);
      }

      this.addAlert('danger', '{0} {1} {2}', player, card.kneeled ? 'kneels' : 'stands', card);
    }
  }
}
