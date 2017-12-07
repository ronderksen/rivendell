import EventEmitter from "events";
import zmq from "zmq";
import monk from "monk";
import logger from "./log";
import GameService from "./services/GameService";



const router = zmq.socket('router');

class GameRouter extends EventEmitter {
  constructor(config) {
    super();

    this.workers = {};
    this.gameService = new GameService(monk(config.dbPath));

    router.bind(config.mqUrl, err => {
      if(err) {
        logger.info(err);
      }
    });

    router.on('message', this.onMessage.bind(this));

    setInterval(this.checkTimeouts.bind(this), 1000 * 60);
  }

  // External methods
  startGame(game) {
    const node = this.getNextAvailableGameNode();

    if(!node) {
      logger.error('Could not find new node for game');
      return null;
    }

    this.gameService.create(game.getSaveState());

    node.numGames += 1;

    this.sendCommand(node.identity, 'STARTGAME', game);
    return node;
  }

  addSpectator(game, user) {
    this.sendCommand(game.node.identity, 'SPECTATOR', { game, user });
  }

  getNextAvailableGameNode() {
    if(this.workers && this.workers.length === 0) {
      return undefined;
    }

    let returnedWorker;

    this.workers.forEach(worker => {
      if(worker.numGames >= worker.maxGames || worker.disabled) {
        return;
      }

      if(!returnedWorker || returnedWorker.numGames > worker.numGames) {
        returnedWorker = worker;
      }
    });

    return returnedWorker;
  }

  getNodeStatus() {
    return this.workers.map(worker => (
      {
        name: worker.identity,
        numGames: worker.numGames,
        status: worker.disabled ? 'disabled' : 'active'
      }
    ));
  }

  disableNode(nodeName) {
    const worker = this.workers[nodeName];
    if(!worker) {
      return false;
    }

    worker.disabled = true;

    return true;
  }

  enableNode(nodeName) {
    const worker = this.workers[nodeName];
    if(!worker) {
      return false;
    }

    worker.disabled = false;

    return true;
  }

  notifyFailedConnect(game, username) {
    if(!game.node) {
      return;
    }

    this.sendCommand(game.node.identity, 'CONNECTFAILED', { gameId: game.id, username });
  }

  closeGame(game) {
    if(!game.node) {
      return;
    }

    this.sendCommand(game.node.identity, 'CLOSEGAME', { gameId: game.id });
  }

  // Events
  onMessage(identity, msg) {
    const identityStr = identity.toString();

    let worker = this.workers[identityStr];

    let message;

    try {
      message = JSON.parse(msg.toString());
    } catch(err) {
      logger.info(err);
      return;
    }

    switch(message.command) {
      case 'HELLO':
        this.emit('onWorkerStarted', identityStr);
        this.workers[identityStr] = {
          identity: identityStr,
          maxGames: message.arg.maxGames,
          numGames: 0,
          address: message.arg.address,
          port: message.arg.port,
          protocol: message.arg.protocol
        };
        worker = this.workers[identityStr];

        this.emit('onNodeReconnected', identityStr, message.arg.games);

        worker.numGames = message.arg.games.length;

        break;
      case 'PONG':
        if(worker) {
          worker.pingSent = undefined;
        } else {
          logger.error('PONG received for unknown worker');
        }
        break;
      case 'GAMEWIN':
        this.gameService.update(message.arg.game);
        break;
      case 'GAMECLOSED':
        if(worker) {
          worker.numGames -= 1;
        } else {
          logger.error('Got close game for non existant worker', identity);
        }

        this.emit('onGameClosed', message.arg.game);

        break;
      case 'PLAYERLEFT':
        if(!message.arg.spectator) {
          this.gameService.update(message.arg.game);
        }

        this.emit('onPlayerLeft', message.arg.gameId, message.arg.player);

        break;
      default:
        break;
    }

    if(worker) {
      worker.lastMessage = Date.now();
    }
  }

  // Internal methods
  sendCommand(identity, command, arg) {
    router.send([identity, '', JSON.stringify({ command, arg })]);
  }

  checkTimeouts() {
    const currentTime = Date.now();
    const pingTimeout = 1 * 60 * 1000;

    this.workers.forEach(worker => {
      if(worker.pingSent && currentTime - worker.pingSent > pingTimeout) {
        logger.info(`worker ${worker.identity} timed out`);
        delete this.workers[worker.identity];
        this.emit('onWorkerTimedOut', worker.identity);
      } else if(!worker.pingSent) {
        if(currentTime - worker.lastMessage > pingTimeout) {
          worker.pingSent = currentTime; // eslint-disable-line no-param-reassign
          this.sendCommand(worker.identity, 'PING');
        }
      }
    });
  }
}

module.exports = GameRouter;
