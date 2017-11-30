export default function createMockDetails() {
  return {
    scenarioId: '01001',
    id: 'test-id001',
    name: 'Test game',
    allowSpectators: true,
    owner: {
      username: 'chevalric',
    },
    savedGameId: null,
    difficulty: 'easy',
    password: '',
    players: [{
      user: {
        username: 'chevalric',
      },
      id: 'test-id002',
    }, {
      user: {
        username: 'darius',
      },
      id: 'test-id003',
    }],
    spectators: [{
      user: {
        username: 'john',
      },
      id: 'test-id004',
    }],
  }
}
