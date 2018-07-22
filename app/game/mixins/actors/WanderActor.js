import Movable from 'app/game/mixins/actors/Movable';
import {ACTOR} from 'app/game/mixins/MixinConstants';

export default {
	...Movable,
	name: 'WanderActor',
	groupName: ACTOR,
	act: function() {
		// Flip coin to determine if moving by 1 in the positive or negative direction
		const moveOffset = Math.round(Math.random()) === 1 ? 1 : -1;
		// Flip coin to determine if moving in x direction or y direction
		if (Math.round(Math.random()) === 1) {
			this.tryMove(this.getX() + moveOffset, this.getY(), this.getZ(), this.getMap());
		} else {
			this.tryMove(this.getX(), this.getY() + moveOffset, this.getZ(), this.getMap());
		}
	},
};
