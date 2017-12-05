import GamePipeline from './game-pipeline';

describe('Class: GamePipeline', () => {
  function MockStep(id, doContinue) {
    this.id = id;
    this.onCardClicked = jest.fn();
    this.continue = jest.fn().mockReturnValue(doContinue);
    this.onMenuCommand = jest.fn();
    this.onDebugInfo = jest.fn().mockReturnValue('MockStep');
  }

  let steps = [];
  let phase = null;
  beforeEach(() => {
    steps = [
      new MockStep(1, true),
      new MockStep(2, true),
      new MockStep(3, false),
    ];
    phase = new GamePipeline();
  });

  it('should create a pipeline out of given steps', () => {
    expect(phase.pipeline).toBeInstanceOf(Array);
    expect(phase.queue).toBeInstanceOf(Array);
    phase.initialize(steps);
    expect(phase.pipeline).toEqual(steps);
  });

  it('should provide debug info for all steps', () => {
    phase.initialize(steps);
    expect(phase.getDebugInfo()).toMatchSnapshot();
  });

  it('should get the current step', () => {
    phase.initialize(steps);
    expect(phase.getCurrentStep()).toEqual(steps[0]);
  });

  it('should continue through the pipeline as long as steps do not halt the flow', () => {
    phase.initialize(steps);
    phase.continue();
    expect(phase.pipeline).toMatchSnapshot();
    expect(phase.getCurrentStep()).toEqual(steps[2]);
  });
});
