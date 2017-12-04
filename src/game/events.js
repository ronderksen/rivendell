import nskeymirror from 'nskeymirror';

export default nskeymirror({
  onBeginRound: null,
  onPhaseStarted: null,
  onPhaseEnded: null,
  onAtEndOfPhase: null,
  onPlayerKeepHandOrMulligan: null,
  onFirstPlayerSelect: null,
  afterCommitToQuest: null,
  onEncounterCardRevealed: null,
  onEnemyEngaged: null,
  onCharacterLeavesPlay: null,
  onEnemyAttacking: null,
  onCharacterAttacking: null,
  onEnemyKilled: null,
  onShadowCardDealt: null,
  onCharacterDamage: null,
})
