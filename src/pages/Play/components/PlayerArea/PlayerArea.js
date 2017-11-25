import React from 'react';
import DiscardPile from '../DiscardPile';
import AlliesArea from './components/AlliesArea';
import DrawDeck from './components/DrawDeck';
import HeroArea from './components/HeroArea';
import ThreatCounter from './components/ThreatCounter';
import EngagedEnemiesArea from './components/EngagedEnemiesArea';

export default function(props) {
  const { player } = props;

  return (
    <section>
      <EngagedEnemiesArea enemies={player.enemies} />
      <HeroArea heroes={player.deck.heroes} />
      <AlliesArea allies={player.deck.allies} />
      <DrawDeck deck={player.deck} />
      <DiscardPile deck={player.discard} />
      <ThreatCounter currentThreat={player.currentThreat} />
    </section>
  )
}
