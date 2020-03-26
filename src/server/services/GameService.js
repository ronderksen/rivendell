import logger from "../log";

export default class GameService {
  constructor(db) {
    this.games = db.get('games');
  }

  create(game) {
    return this.games.insert(game)
      .catch(err => {
        logger.error('Unable to create game', err);
        throw new Error('Unable to create game');
      });
  }

  update(game) {
    const properties = {
      startedAt: game.startedAt,
      players: game.players,
      winner: game.winner,
      winReason: game.winReason,
      finishedAt: game.finishedAt
    };
    return this.games.update({ gameId: game.gameId }, { '$set': properties })
      .catch(err => {
        logger.error('Unable to update game', err);
        throw new Error('Unable to update game');
      });
  }

  getAllGames(from, to) {
    return this.games.find()
      .then(games => games.filter(game => game.startedAt >= from && game.startedAt < to))
      .catch(err => {
        logger.error(`Unable to get all games from ${from} to ${to}`, err);
        throw new Error('Unable to get all games');
      });
  }
}

