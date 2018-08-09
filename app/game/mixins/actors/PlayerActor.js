import { refreshScreen, sendMessage, setGameOver } from 'app/game/GameInterface';
import { ACTOR } from 'app/game/mixins/MixinConstants';


export default {
	name: 'PlayerActor',
	groupName: ACTOR,
	level: 1,
	act: function() {
		// Detect if the game is over
		if (!this.isAlive()) {
			// Send a last message to the player
			sendMessage(this, 'You have died... Press [Enter] to continue!');
			setGameOver();
		}
		refreshScreen();
		// Lock the engine and wait asynchronously
		// for the player to press a key.
		this.getMap().lockEngine(this.getZ());
	},
	getAttackValue: function() {
		return this.level * 2;
	},
};
