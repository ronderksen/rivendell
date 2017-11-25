import React, { Component } from 'react';
import PlayerArea from './components/PlayerArea';
import ScenarioArea from './components/ScenarioArea';

const player = {
  deck: [],
  heroes: [],
  allies: [],
  discard: [],
  currentThreat: 30,
};

export default class PlayContainer extends Component {
  render() {
    // const { players, scenario } = this.props;
    const players = [player, player, player, player];
    const scenario = {
      deck: [],
      staging: [],
      discard: [],
      quest: [],
      stage: 1,
      activeLocation: 1
    };

    return <div>
      {players.length >= 2 && <PlayerArea isOpponent player={players[1]} />}
      {players.length >= 3 && <PlayerArea isOpponent player={players[2]} />}
      {players.length >= 4 && <PlayerArea isOpponent player={players[3]} />}
      <ScenarioArea scenario={scenario} />
      <PlayerArea player={players[0]} />
    </div>;
  }
}
