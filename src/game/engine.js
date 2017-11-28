import { db } from '../database/firebase-init';

export default class Engine {
  constructor() {
    this.games = db.ref('games');
  }

  parse(tree) {
    if (!tree) {
      return;
    }
    const keys = Object.keys(tree);
    const id = keys[0];
    const game = tree[id];
    return [id, game];
  }

  async startGame(players) {
    const game = this.games.push();
    await game.set(players);
  }

  findGame(playerToken, cb) {
    ['p1_token'].forEach(token => {
      const gameRef = this.games.orderByChild(token).equalTo(playerToken);
      gameRef.on('value', ref => {
        const [id, game] = this.parse(ref.val());
        if (!id) {
          return;
        }
        cb(id, game);
      });
    });
  }
}
