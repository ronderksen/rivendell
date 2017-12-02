import EventCard from '../../event-card';

export default class BeornsHospitality extends EventCard {
  setupCardAbilities() {
    this.action({
      target: context => ({
        activePromptTitle: 'Select a player',
        // TODO: figure out how to select a player
      }),
      handler: context => {
        context.target.player.getHeroes().forEach(hero => {
          hero.heal(hero.hitpoints);
        });
        this.game.addMessage(`${context.event.player.name} uses ${this.name} to heal all damage on each hero controlled by ${context.target.player.name}.`)
      }
    })
  }
}
