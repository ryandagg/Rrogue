import { refreshScreen } from 'app/game/GameInterface';

// import { refreshScreen } from 'app/game/GameInterface';
import { ACTOR } from 'app/game/mixins/MixinConstants';

export default {
	name: 'PlayerActor',
	groupName: ACTOR,
	level: 1,
	act: function() {
		refreshScreen();
		// Lock the engine and wait asynchronously
		// for the player to press a key.
		this.getMap().getEngine().lock();
	},
	getAttackValue: function() {
		return this.level * 2;
	},
};
