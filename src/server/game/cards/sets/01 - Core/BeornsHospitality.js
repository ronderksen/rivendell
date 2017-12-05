import EventCard from '../../event-card';

export default class BeornsHospitality extends EventCard {
  static code = '01-068';

  setupCardAbilities() {
    this.action({
      choosePlayer: player => player.getHeroes().find(hero => hero.isWounded()) !== undefined,
      handler: context => {
        context.target.player.getHeroes().forEach(hero => {
          hero.heal(hero.hitpoints);
        });
        this.game.addMessage(`${context.event.player.name} uses ${this.name} to heal all damage on each hero controlled by ${context.target.player.name}.`)
      }
    })
  }
}
