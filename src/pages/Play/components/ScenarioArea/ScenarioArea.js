import React from 'react';
import DiscardPile from '../DiscardPile';
import EncounterDeck from './components/EncounterDeck';
import StagingArea from './components/StagingArea';
import QuestArea from './components/QuestArea';
import LocationArea from './components/LocationArea';

export default function(props) {
  const { scenario } = props;

  return (
    <section>
      <EncounterDeck heroes={scenario.deck} />
      <StagingArea allies={scenario.staging} />
      <DiscardPile deck={scenario.discard} />
      <QuestArea quest={scenario.quest} stage={scenario.stage} />
      <LocationArea location={scenario.activeLocation} />
    </section>
  )
}
